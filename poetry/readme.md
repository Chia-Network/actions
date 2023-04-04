# Poetry

Installs [poetry](https://python-poetry.org/) for Python package and dependency management.  Supports Windows and Linux, and in the future will hopefully support macOS.  

The `poetry-command` is optional and defaults to `install`.  This allows any [poetry command](https://python-poetry.org/docs/cli/) to be passed

```yaml
- uses: Chia-Network/actions/poetry@main
  with:
    poetry-command: "update"
```
