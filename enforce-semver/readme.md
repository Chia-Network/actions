# Enforce Semantic Versioning

Ensures the current version/tag is compliant with `Major.minor.patch` formatting. Supports up to three digits per release type, and numerics/periods only. Suitable for runners with Bash.

```yaml
- uses: Chia-Network/actions/enforce-semver@main

- name: Checkout Code
  uses: actions/checkout@v2
```
