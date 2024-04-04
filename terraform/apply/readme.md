# Terraform - Apply

Runs terraform apply

## Example Usage

```yaml
  - uses: Chia-Network/actions/terraform/apply@main
    with:
      workspace: mainnet-us-west-2
      varfile: vars/mainnet-us-west-2.tfvars
      terraform_dir: terraform
```

### Parameters

`workspace` The terraform workspace to run in. Can pass "default" if not using workspaces. [Workspace Documentation](https://www.terraform.io/language/state/workspaces).

`varfile` The vars file to pass to terraform (relative to the `terraform_dir` and without the `.j2` extension).

`terraform_dir` Path to the directory that contains the terraform configuration
