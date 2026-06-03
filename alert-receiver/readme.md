# Alert-Manager Receiver Action

NOTE: In most cases you probably want to use the `message` Action in this repository, not this one. This is an older method to send messages from GitHub Actions using a static token. The new method uses short lived GitHub Action job JWTs.

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
