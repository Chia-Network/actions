# Commit Sign / GPG Action

Wrapper around crazy-max/ghaction-import-gpg that imports a gpg key and sets up git commit signing

```yaml
- uses: Chia-Network/actions/commit-sign/gpg@main
  with:
    gpg_private_key: ${{ secrets.gpg_private_key }}
    passphrase: ${{ secrets.gpg_passphrase }}
```
