# Poetry

Installs [poetry](https://python-poetry.org/) for Python package and dependency management.

The `poetry-command` is optional and defaults to `install`. This allows any [poetry command](https://python-poetry.org/docs/cli/) to be passed.  If `poetry-version` is not specified, pip will install the latest version available.

```yaml
- name: Create virtual environment for Poetry
  uses: Chia-Network/actions/create-venv@main
  id: create-poetry-venv

- name: Run poetry install
  uses: Chia-Network/actions/poetry@main
  with:
    poetry-command: "update"
    python-executable: ${{ steps.create-poetry-venv.outputs.python_executable }}
    poetry-version: "1.8.5"
```
