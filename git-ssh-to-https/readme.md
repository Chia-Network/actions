# Git SSH to HTTPS

Sets up the global git config to replace any ssh clone urls with https urls. This must be used after the checkout code action.

```yaml
- name: Checkout Code
  uses: actions/checkout@v2

- uses: Chia-Network/actions/git-ssh-to-https@main
```
