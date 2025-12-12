# Docker build

```yaml
permissions:
  id-token: write
  contents: read
  packages: write

jobs:
  package:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6

      # Some pre-work

      - name: Package
        uses: Chia-Network/actions/docker/remote-arm-build@main
```
