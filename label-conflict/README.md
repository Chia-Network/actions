# Action: Label merge-conflict

This action tries to resolve issues found in [eps1lon/actions-label-merge-conflict](https://github.com/eps1lon/actions-label-merge-conflict)  
- It tries to check conflict status of PRs which share the same base(target) branch as the PR triggering the action.  
  For example, if you have 20 PRs which target to `main` branch, and you push commits to one of the 20 PRs,
  it tries to check conflict for all the 20 PRs between `main` and adds/removes conflict labels for those 19 irrelevant PRs.
- When conflict status turns out to be "UNKNOWN", it retries GraphQL request after retry interval.  
  The problem is, that if conflict statuses of 3 PRs are "UNKNOWN",
  3 same GraphQL requests which ask for the same data for each targeted PRs will be submitted.  
  This very much consumes time and bandwidth if you have a large number of PRs.
- In the above case, even if one of 3 GraphQL response has no "UNKNOWN" mergeable status data, 
  it waits for remaining 2 GraphQL response, which should be canceled or ignored.
  In the worst case scenario, if it receives some of remaining GraphQL response which contain "UNKNOWN" data,
  it will wait and retry another GraphQL request to GitHub API server.

This repository hopefully resolved the above issues.

---

This action adds/removes a label when Pull Request conflict status is changed.

![Add/Remove conflict label](https://user-images.githubusercontent.com/84098616/190456896-2408776e-4778-4879-a8fe-c0b2e4eb8eca.png).

## Example usage

```yaml
name: "Check conflict"
on:
  # If you specify `push`, then this action checks conflict between this branch and
  # child branches which target this branch on push event.
  push:

  # If you specify `pull_request_target`, then this action checks conflicts between
  # - This branch and its base branch
  # - This branch and child branches which target this branch
  # on pull request event
  # Note that `pull_request_target` is run on base branch's context for security reason.
  pull_request_target:
    # `opened` type is triggered when a user opens a pull request
    # `synchronize` type is usually triggered when a user pushes commits on pull request
    types: [opened, synchronize]

  # If you specify `pull_request` conflict check is done as well as `pull_request_target`.
  # But in this context, adding label/comment fails because security token is not available in this context.
  # If you want to specify `pull_request`, please set input `ignorePermissionError` to `true`.
  # Otherwise, the action will fail by permission error.
  #
  # pull_request:

jobs:
  main:
    runs-on: ubuntu-latest
    steps:
      - name: Check conflicts
        uses: Chia-Network/actions/label-conflict@main
        with:
          secretToken: "${{ secrets.GITHUB_TOKEN }}"
          labelToAddOnConflict: "merge conflict"
          labelToRemoveOnConflict: "ready to merge"
          commentToAddOnConflict: "This pull request has conflicts, please resolve those before we can evaluate the pull request."
          commentToAddOnClean: "Conflicts have been resolved. A maintainer will review the pull request shortly."
```

## Inputs

### `secretToken`

**Required** Token for the repository. Can be passed in using {{ secrets.GITHUB_TOKEN }}

### `labelToAddOnConflict`

**Required** Name of the label which indicates that the branch has conflict

### `labelToRemoveOnConflict`

Name of the label removed when conflict is detected

**Default**: No label is removed if a PR is marked conflicting.

### `retryIntervalSec`

Number of interval seconds to retry conflict check for branches whose mergeable state is unknown.
(GitHub is calculating whether it has conflict)

**Default**: 120

### `retryMax`

Number of retries to check conflict. If it is set to 0, checking conflict will be done only once

**Default**: 5

### `ignorePermissionError`

Boolean. Whether to continue or fail when the provided token is missing permissions.
By default, pull requests from a fork do not have access to secrets and get a read only GitHub token,
resulting in a failure to update tags.

**Default**: false

### `commentToAddOnConflict`

Comment to add when conflict is detected. Supports Markdown

**Default**: No comment is posted.

### `commentToAddOnClean`

Comment to add when conflict is resolved. Supports Markdown

**Default**: No comment is posted.

##  Note for developers
In order for public availability, I committed `dist/index.js` which is compiled from `src/*.ts` files.  
To prevent manual rewrite of the dist js file, there is a CI job to check whether the committed dist js file is
actually built from ts files.  
This check is done by comparing sha256hash of the dist js file.  
You need to be careful when you want to commit `dist/index.js` because the sha256hash of the dist js file will change
between runtime environment.
You need to run `yarn build` on Ubuntu/WSL or the same OS as the `test-label-conflict.yml` CI job uses.
If you build the dist js file on Windows, maybe the CI job will fail.