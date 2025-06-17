# Terraform - Destroy

Runs terraform destroy

## Example Usage

```yaml
- uses: Chia-Network/actions/terraform/destroy@main
  with:
    workspace: mainnet-us-west-2
    varfile: vars/mainnet-us-west-2.tfvars
    terraform_dir: terraform
    backend_config: backends/fmt.backend
```

### Parameters

`workspace` The terraform workspace to run in. Can pass "default" if not using workspaces. [Workspace Documentation](https://www.terraform.io/language/state/workspaces).

`varfile` The vars file to pass to terraform

`terraform_dir` Path to the directory that contains the terraform configuration

`backend_config` Path to the directory that contains the terraform backends. This is not required.
