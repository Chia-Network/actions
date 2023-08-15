# Tailscale Wrapper w/ SSH Support

Wrapper around tailscale/github-action that works w/ containers and sets up SSH support

```yaml
- name: Tailscale
  uses: chia-network/actions/tailscale@tailscale
  with:
    oauth-client-id: ${{ env.TAILSCALE_CLIENT_ID }}
    oauth-secret: ${{ env.TAILSCALE_SECRET }}
    tags: tag:ci
```
