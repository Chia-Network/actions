# Retrieve the library for workflows

```yaml
jobs:
  library:
    uses: Chia-Network/actions/.github/workflows/reflow-library.yml

  test:
    # <snip>
    steps:
      - name: Echo a test value
        run: |
          echo ${{ fromJSON(needs.library.outputs.root)._test.an-anchor }}
```
