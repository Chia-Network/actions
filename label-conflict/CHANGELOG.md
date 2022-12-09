# Changelog

## [2.0.0]
### Breaking change
- Removed `core.setOutput()` because it was deprecated
  (https://github.blog/changelog/2022-10-11-github-actions-deprecating-save-state-and-set-output-commands/)  
  Starting from `2.0.0`, `label-conflict` action does not produce output anymore.

### Changed
- Greatly reduced the number of GraphQL requests.
  GraphQL requests for pull requests whose base branch is the working branch are now unified
  into a single GraphQL request. 

## [1.0.0]
Initial release.
