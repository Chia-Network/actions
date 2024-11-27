# Check that PR commits are signed

Checks that all commits in a PR have been signed.
GitHub's unsigned commit branch protections only provide notifications when the PR has at least been approved, which is far too late to be correcting the situation cleanly.
This provides an earlier warning in PRs with unsigned commits.
Signing is done at the time the Git commit is created generally by either a GPG or SSH key.

The commits checked are those that would be added to the target branch if the PR were merged.
Historical commits already on both branches are not checked.
This list of commits is identified using Git's `...` diff option.

```yaml
- uses: Chia-Network/actions/check-commit-signing@main
```

There are two options that can be passed, `target` and `source`.
They default to the PR base and head accordingly, but can be specified if special situations arise.

This action only runs on PR triggers so the caller need not specify their own `if:` condition.
