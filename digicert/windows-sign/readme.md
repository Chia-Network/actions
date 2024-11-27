# Digicert Windows Codesign

Windows Code signing with digicert HSM.

```yaml
- name: Sign windows artifacts
  uses: Chia-Network/actions/digicert/windows-sign@main
  # Passing this as an environment variable makes it so the default input will be used if the vars.SM_TOOLS_DOWNLOAD_URL
  # is not set on the org/repo. By having this in place even if the var doesn't exist, it allows globally changing
  # the download URL quickly if necessary
  env:
    SM_TOOLS_DOWNLOAD_URL: ${{ vars.SM_TOOLS_DOWNLOAD_URL }}
  with:
    sm_host: ${{ secrets.SM_HOST }}
    sm_api_key: ${{ secrets.SM_API_KEY }}
    sm_client_cert_file_b64: ${{ secrets.SM_CLIENT_CERT_FILE_B64 }}
    sm_client_cert_password: ${{ secrets.SM_CLIENT_CERT_PASSWORD }}
    sm_code_signing_cert_sha1_hash: ${{ secrets.SM_CODE_SIGNING_CERT_SHA1_HASH }}
    file: ${{ github.workspace }}/dist/my-file.exe
    sign: "true" # True is default, false will only install the tools but not sign
```
