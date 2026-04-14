# Message Action

Sends a message to the alert-receiver worker using GitHub OIDC for authentication. Automatically obtains a JWT with the receiver URL as the audience, then POSTs the message to the specified route.

## Inputs

| Name | Required | Default | Description |
|------|----------|---------|-------------|
| `receiver_url` | No | `https://alert-receiver.chiaops.com/` | Base URL of the alert-receiver worker |
| `receiver_route` | Yes | | The route to call on the receiver (appended to `receiver_url`) |
| `message` | Yes | | The message to send in the POST body |

## Permissions

The calling workflow must have `id-token: write` permission for the GitHub OIDC token request.

```yaml
permissions:
  id-token: write
```

## Usage

```yaml
- name: Send message
  uses: Chia-Network/actions/message@main
  with:
    receiver_route: teambottesting-github
    message: "Build succeeded for ${{ github.repository }}"
```

With a custom receiver URL:

```yaml
- name: Send message
  uses: Chia-Network/actions/message@main
  with:
    receiver_url: https://1.alert-receiver-dev.chiaops.com/
    receiver_route: teambottesting-github
    message: "Smoke test from deploy-dev workflow"
```
