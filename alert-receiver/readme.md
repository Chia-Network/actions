# Alert-Manager Receiver Action

Sends JSON to the alertmanager receiver, which generates alerts in Keybase.

```yaml
- name: Alertmanager Receiver
  uses: chia-network/actions/alert-receiver@main
  with:
    status: firing
    title: Missing files
    description: Files are missing from folder upload
    webhook_endpoint: ips-alerts
    bearer_token: ${{ BEARER_TOKEN }}
```
