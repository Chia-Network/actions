# Changelog

## [3.0.0]
### Added
- Added `ignoreRetryTimeout` option, which indicates whether to mark the action success when unknown
  PRs still exist after all retry.  
  (Default to `true` so there's breaking change if you update from the previous versions)

## [2.0.1]
### Fixed
- Fixed incorrect retry sleep location.  
  Previous flow:  
  (0) Send GraphQL queries to fetch PR's conflict status  
  (Starting retry loop from this point)  
  (1) Update label for PRs whose conflict status are returned  
  (2) Send GraphQL queries for PRs whose conflict status are still unknown  
  (3) Sleep  
  (4) Go to `(1)`  

  As you might notice, "Sleep" should be between `(1)` and `(2)`

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
