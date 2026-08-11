# Docker build

```yaml
- uses: actions/checkout@v4

# Some pre-work

- name: Package
  uses: Chia-Network/actions/docker/build@main
```

## Registry cache

When `enable-cache` is `true`, BuildKit registry cache is stored at:

`ghcr.io/<org>/<repo>[/<image_subpath>]:cache-<platforms>`

- **Image / subpath:** same base as the published image (`image_subpath` is included when set).
- **Platforms:** derived from `docker-platforms` (trimmed, lowercased, `/` → `-`, sorted, joined with `-`).

Examples:

| `image_subpath` | `docker-platforms` | Cache tag |
|---|---|---|
| _(empty)_ | `linux/amd64` | `cache-linux-amd64` |
| _(empty)_ | `linux/arm64` | `cache-linux-arm64` |
| `mcp` | `linux/amd64` | `ghcr.io/org/repo/mcp:cache-linux-amd64` |
| _(empty)_ | `linux/amd64,linux/arm64` | `cache-linux-amd64-linux-arm64` |

Single-arch matrix legs therefore get isolated caches automatically. The previous unscoped `:cache` tag is no longer used (one cold rebuild after upgrading).
