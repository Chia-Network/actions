# DigiCert Windows Codesign (retired)

This action no longer signs binaries. DigiCert Signing Manager rejects the
organization `SM_*` credentials with HTTP 403 (`Invalid credentials`), so
calling it only produced a slow `smctl` / `certutil` failure.

Use [`sign/azure-windows`](../sign/azure-windows/readme.md) instead.

Existing workflow `with:` inputs are still accepted so callers fail immediately
with a pointer rather than a schema error. They are not used.

```yaml
- name: Sign windows artifacts
  uses: Chia-Network/actions/sign/azure-windows@main
  with:
    azure_tenant_id: ${{ secrets.AZURE_SIGNING_TENANT_ID }}
    azure_client_id: ${{ secrets.AZURE_SIGNING_CLIENT_ID }}
    file: ${{ github.workspace }}/dist/my-file.exe
```

The calling job must run on Windows, set `environment: windows-code-signing`,
and have `permissions: id-token: write`.
