# Tailscale Wrapper w/ SSH Support

Wrapper around `tailscale/github-action` that works w/ containers and sets up SSH support.

Either an OAuth trust credential (`oauth-secret`) or an OIDC / workload identity
federation trust credential (`oidc-audience`) must be provided. Whichever
credential is used must have the writable `auth_keys` scope and permission to
apply the requested `tags`.

## OAuth trust credential

```yaml
- name: Tailscale
  uses: chia-network/actions/tailscale@main
  with:
    oauth-client-id: ${{ env.TAILSCALE_CLIENT_ID }}
    oauth-secret: ${{ env.TAILSCALE_SECRET }}
    tags: tag:ci
```

## OIDC / Workload identity federation

Requires Tailscale `1.90.1` or later, and the `id-token: write` permission on
the workflow so the action can request a JWT from GitHub:

```yaml
permissions:
  id-token: write
```

```yaml
- name: Tailscale
  uses: chia-network/actions/tailscale@main
  with:
    oauth-client-id: ${{ secrets.TS_OAUTH_CLIENT_ID }}
    oidc-audience: ${{ secrets.TS_AUDIENCE }}
    tags: tag:ci
```
