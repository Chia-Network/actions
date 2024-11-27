# Vault Login

Logs into vault and sets env.VAULT_TOKEN using the GitHub JWT token. Assumes vault is already configured with a [jwt auth method](https://www.vaultproject.io/docs/auth/jwt) that will accept jwt tokens signed by GitHub Actions.

## Example Usage

```yaml
- name: Vault Login
  uses: Chia-Network/actions/vault/login@main
  with:
    vault_url: ${{ secrets.VAULT_URL }}
    role_name: github
```

### Parameters

`vault_url` The URL to the vault instance. Ex: `https://vault.mycompany.com:8200/`

`role_name` The specific role within vault to log in as
