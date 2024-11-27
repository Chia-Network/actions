# Git Mark Workspace Safe

Marks the GITHUB_WORKSPACE as a safe Git directory. See [bug report](https://github.com/actions/checkout/issues/760)
The underlying checkout issue is resolved, but if you need to commit back to a repository, especially in a container, this action is still needed.

```yaml
- name: Add safe Git directory
  uses: Chia-Network/actions/git-mark-workspace-safe@main

- name: Checkout Code
  uses: actions/checkout@v4
```
