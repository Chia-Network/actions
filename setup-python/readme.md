# Setup Python

Wrapper around actions/setup-python that also will support python on ARM64 macOS (viw Homebrew) and ARM64 Linux (via pyenv).
Note that the mac runners must be running with native GitHub Actions runner code, NOT the `arch` flag workaround.
Setting `allow-prerelease` to `true` will allow alpha, beta, and RC versions.
This is only usable when specifying just major and minor versions.
If you specify a patch version prereleases must not be allowed.

```yaml
- uses: Chia-Network/actions/setup-python@main
  with:
    python-version: "3.11"
    allow-prerelease: true
```
