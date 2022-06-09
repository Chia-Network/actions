# Reusable Workflows

## Docker Build

Reusable workflow for building a docker image. Assumes that the Dockerfile is in the root of the repository when building.

```yaml
name: Build

on:
  push:
    branches:
      - main
  pull_request:

jobs:
  package:
    uses: Chia-Network/actions/.github/workflows/docker-build.yaml@main
```
