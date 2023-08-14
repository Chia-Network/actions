# Digicert Windows Codesign

Windows Code signing with digicert HSM.

```yaml
  - name: Sign windows artifacts
    uses: Chia-Network/actions/digicert/windows-sign@main
    with:
      sm_host: ${{ secrets.SM_HOST }}
      sm_api_key: ${{ secrets.SM_API_KEY }}
      sm_client_cert_file_b64: ${{ secrets.SM_CLIENT_CERT_FILE_B64 }}
      sm_client_cert_password: ${{ secrets.SM_CLIENT_CERT_PASSWORD }}
      sm_code_signing_cert_sha1_hash: ${{ secrets.SM_CODE_SIGNING_CERT_SHA1_HASH }}
      file: ${{ github.workspace }}/dist/my-file.exe
```
