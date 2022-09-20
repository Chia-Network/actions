# Chia-Network/Actions
This repository stores internal actions and workflows that will be reused in GitHub Actions across various other Chia-Network repositories. Each `action.yml` file in the directories within this repository should have its own `readme.md` file that describes its use and provides some insight into its functionality. A brief summary of each is listed below as well in order to improve visibility.

**If you would like to contribute to this repository, please ensure that you follow the established naming convention.** If the action uses a separate tool, such as Ansible or Terraform, use the existing directory for that tool if it exists or create one if it doesn't. Otherwise, if the action doesn't rely on any third-party tools, create your directory at the root level.

## Reusable Actions

### ansible/run-playbook
Runs an ansible playbook against an inventory of hosts

### clean-workspace
Cleans the current workspace prior to running the checkout action, to ensure the job starts with a clean slate.

### enforce-semver
Ensures that the checked-out code has a GitHub tag that complies with semantic versioning in format `Major.minor.patch`. Supports up to three numeric digits per release type.

### git-mark-workspace-safe
Marks the GitHub workspace as safe. See [bug report](https://github.com/actions/checkout/issues/760)
The underlying checkout issue is resolved, but if you need to commit back to a repo, especially in a container, this action is still needed.

### git-ssh-to-https
Sets up the global git config to replace any ssh clone URLs with HTTPS URLs. This must be used after the checkout code action.

### github/keep-alive


### helm/deploy
Deploys a helm chart to a k8s cluster.

### k8s/image-pull-secret
Creates/updates a kubernetes image pull secret in a namespace.

### label-conflict
Add/Remove labels when PR's conflict status changes.

### setup-python
Wrapper around actions/setup-python that also supports ARM64 Mac and ARM64 Linux.

### sign/windows
Windows Codesigning. Signs a file with a cert for windows.

### terraform/plan
Runs terraform plan and shows the output.

### terraform/apply
Runs terraform apply.

### terraform/destroy
Runs terraform destroy.

### vault/login
Log in to the vault server using the jwt token and set env vars, to be able to use other vault actions.

### vault/aws-sts
Get ephemeral AWS credentials from Vault

### vault/k8s-login
Log in to a k8s cluster, using a certificate issued by vault signed by the same CA k8s uses.

### vault/signed-ssh-key
Generate a new ssh key and have vault sign it with the SSH CA

## Reusable Workflows

### workflows/docker/build

Job definition that builds a docker image and pushes to ghcr.io
