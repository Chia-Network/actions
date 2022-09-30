# Set Job Environment

Sets usable env for all job steps based on payload in GitHub Event. To be ran immediately after 'actions/checkout' step.

```yaml
- name: Checkout Code
  uses: actions/checkout@v2
- uses: Chia-Network/actions/setjobenv@main
```