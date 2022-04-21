# Vault AWS STS

Get ephemeral AWS credentials from vault. [AWS Secret Engine](https://www.vaultproject.io/docs/secrets/aws)

## Example Usage

```yaml
- name: Get ephemeral aws credentials
  uses: Chia-Network/actions/vault/aws-sts@main
  with:
    vault_url: ${{ secrets.VAULT_URL }}
    vault_token: ${{ env.VAULT_TOKEN }}
    role_name: "my-role-name"
```

### Parameters

`vault_url` The URL to the vault instance issuing the credentials. Ex: `https://vault.mycompany.com:8200/`

`vault_token` A vault token with permissions to issue certificates from this secret engine. See the [vault login action](../login)

`backend_name` The path to the backend configured for the AWS STS Secret Engine. Default is `aws` but can be customized when setting up the secret engine with the `path` parameter.

`role_name` The specific role within the backend_name that the credentials will be issued for

`ttl` How long the ephemeral credentials should be valid for. Can only be set as high as the role is configured to allow in vault.
