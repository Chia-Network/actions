# K8S Image Pull Secret

Creates/updates a kubernetes image pull secret in a namespace.

```yaml
- uses: Chia-Network/actions/k8s/image-pull-secret@main
  with:
    secret_name: my-image-pull-secret
    namespace: grafana
    username: ${{ env.IMAGE_PULL_USERNAME }}
    password: ${{ env.IMAGE_PULL_PASSWORD }}
    docker_server: "ghcr.io"
```
