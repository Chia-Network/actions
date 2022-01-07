# Vault K8S Login

This action assumes you already have a [PKI secret engine](https://www.vaultproject.io/docs/secrets/pki) set up in vault that can issue certificates signed by a CA certificate that the k8s cluster will accept. Setting that up is outside the scope of this action.

## Example Usage

```yaml
- name: Login to k8s cluster
  uses: Chia-Network/actions/vault/k8s-login@main
  with:
    vault_url: ${{ secrets.VAULT_URL }}
    vault_token: ${{ env.VAULT_TOKEN }}
    backend_name: pki-secret-engine-path
    role_name: pki-secret-engine-role-name
    cluster_url: https://my-k8s-api-server.com:6443
```

### Parameters

`vault_url` The URL to the vault instance issuing the certificates. Ex: `https://vault.mycompany.com:8200/`

`vault_token` A vault token with permissions to issue certificates from this PKI. See the [vault login action](../login)

`backend_name` The path to the backend configured for the PKI Secret Engine. Default is `pki` but can be customized when setting up the secret engine with the `path` parameter.

`role_name` The specific role within the backend_name that the certificate will be issued from

`cluster_url` The k8s cluster URL. Used to generate the kubeconfig. Ex: `https://my-k8s-api-server.com:6443`
