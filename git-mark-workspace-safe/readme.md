# Git Mark Workspace Safe

Marks the GITHUB_WORKSPACE as a safe git directory. See [bug report](https://github.com/actions/checkout/issues/760)
The underlying checkout issue is resolved, but if you need to commit back to a repo, especially in a container, this action is still needed.

```yaml
- name: Add safe git directory
  uses: Chia-Network/actions/git-mark-workspace-safe@main

- name: Checkout Code
  uses: actions/checkout@v3
```
