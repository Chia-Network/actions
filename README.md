# Actions
This repository stores internal actions that will be reused in GitHub Actions across various other Chia-Network repositories. Each `action.yml` file in the directories within this repository should have its own `readme.md` file that describes its use and provides some insight into its functionality. A brief summary of each is listed below as well in order to improve visibility.

**If you would like to contribute to this repository, please ensure that you follow the established naming convention.** If the action uses a separate tool, such as Ansible or Terraform, use the existing directory for that tool if it exists or create one if it doesn't. Otherwise, if the action doesn't rely on any third-party tools, create your directory at the root level.

## ansible/run-playbook


## clean-workspace
Cleans the current workspace prior to running the checkout action, to ensure the job starts with a clean slate.

## enforce-semver
Ensures that the checked-out code has a GitHub tag that complies with semantic versioning in format `Major.minor.patch`. Supports up to three numeric digits per release type.

## git-ssh-to-https
Sets up the global git config to replace any ssh clone URLs with HTTPS URLs. This must be used after the checkout code action.

## github/keep-alive


## helm/deploy


## k8s/image-pull-secret


## sign/windows


## terraform


## vault


