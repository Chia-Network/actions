# Vault Signed SSH Key

Generates a new ssh keypair and then gets it signed by the [vault ssh CA](https://www.vaultproject.io/docs/secrets/ssh/signed-ssh-certificates)

## Example Usage

```yaml
- uses: Chia-Network/actions/vault/signed-ssh-key@main
  with:
    vault_url: ${{ secrets.VAULT_URL }}
    vault_token: ${{ env.VAULT_TOKEN }}
    role_name: "role-name"
```

### Parameters

`vault_url` The URL to the vault instance signing the certificate. Ex: `https://vault.mycompany.com:8200/`

`vault_token` A vault token with permissions to sign ssh keys from this secret engine. See the [vault login action](../login)

`backend_name` The path to the backend configured for the SSH CA. Default is `ssh-client-signer` but can be customized when setting up the secret engine with the `path` parameter.

`role_name` The specific role within the backend_name that the credentials will be issued for

`keypair_path` Full path to the keypair that should be generated
