# Windows Codesign

Windows Codesigning. Signs a file with a cert for windows.

```yaml
  - name: Decode code signing cert into an encrypted file
    uses: kitek/decode-base64-into-file-action@1.0
    with:
      encoded-value: ${{ secrets.WIN_CODE_SIGN_CERT }}
      destination-file: .\win_code_sign_cert.pfx

  - name: Sign windows artifacts
    uses: Chia-Network/actions/sign/windows@main
    with:
      certificate_path: .\win_code_sign_cert.pfx
      certificate_password: ${{ secrets.WIN_CODE_SIGN_PASSWORD }}
      file: ${{ github.workspace }}/dist/my-file.exe
```
