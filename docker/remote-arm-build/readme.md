# Remote ARM Docker build (deprecated)

This action is deprecated and fails immediately, before any AWS API calls. It
has no callers.

It used to build `linux/amd64` on the GitHub runner and `linux/arm64` on a
short-lived EC2 BuildKit instance. `coinset-org/server` used it from December
2025 until August 2026, then switched to GitHub-hosted ARM runners.

Use [`docker/build`](../build/readme.md) on an `ubuntu-24.04-arm` runner for
the arm64 image. Existing `with:` inputs are still accepted so an old workflow
fails with this notice instead of a schema error. They are not used.
