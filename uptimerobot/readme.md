# Uptime Robot

Actions to help with pausing and resuming uptime robot monitors

## Example

**Pause**

```yaml
- uses: Chia-Network/actions/uptimerobot/pause@main
  with:
    api-key: "${{ secrets.uptimerobot-key }}"
    monitor-id: "${{ secrets.uptimerobot-monitor-id }}"
```

**Resume**

```yaml
- uses: Chia-Network/actions/uptimerobot/resume@main
  with:
    api-key: "${{ secrets.uptimerobot-key }}"
    monitor-id: "${{ secrets.uptimerobot-monitor-id }}"
```
