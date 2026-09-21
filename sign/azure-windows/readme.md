# Azure Windows Code Sign

Windows code signing with [Azure Artifact Signing](https://learn.microsoft.com/en-us/azure/trusted-signing/how-to-signing-integrations) (`signtool` + `Azure.CodeSigning.Dlib.dll`).

This is the replacement for `digicert/windows-sign`. Authentication is GitHub OIDC federated into Entra — there is no DigiCert `SM_*` client cert or KSP.

The calling job needs:

- `permissions: id-token: write`
- A GitHub Actions environment whose name matches the federated credential subject, typically `windows-code-signing` (`repo:<org>/<repo>:environment:windows-code-signing`)
- Org/repo secrets `AZURE_SIGNING_TENANT_ID` and `AZURE_SIGNING_CLIENT_ID`

```yaml
permissions:
  id-token: write
  contents: read

jobs:
  build_windows:
    runs-on: windows-latest
    environment: windows-code-signing
    steps:
      - name: Sign windows artifacts
        uses: Chia-Network/actions/sign/azure-windows@main
        with:
          azure_tenant_id: ${{ secrets.AZURE_SIGNING_TENANT_ID }}
          azure_client_id: ${{ secrets.AZURE_SIGNING_CLIENT_ID }}
          file: ${{ github.workspace }}/dist/my-file.exe
```

`file` accepts multiple paths, one per line.

Set `sign: "false"` to only install the Artifact Signing client and write `AZURE_CODE_SIGNING_DLIB` / `AZURE_CODE_SIGNING_METADATA` into the job env (the same split `chia-blockchain` uses when a local script signs many binaries). Re-running the action in the same job skips the nuget install if those env vars already point at existing files.
