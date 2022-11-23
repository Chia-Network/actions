# Setup Python

Wrapper around actions/setup-python that also will support python on ARM64 macOS (viw homebrew) and ARM64 Linux (via pyenv). Note that the mac runners must be running with native GitHub actions runner code, NOT the `arch` flag workaround.

```yaml
- uses: Chia-Network/actions/setup-python@main
  with:
    python-version: "3.10"
```
