# Cache pip cache directory to GitHub Actions cache

Provides caching and pip cache configuration into a runner temporary directory.

Cache restore is retried once on failure and is non-fatal so install can proceed on a cold cache. Job-end cache save behavior is preserved via a lookup-only `actions/cache` step.

```yaml
- uses: Chia-Network/actions/cache-pip@main
```
