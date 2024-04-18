# GitHub Glue

Makes a request to the Glue service.

## Example

```yaml
- uses: Chia-Network/actions/github/glue@main
  with:
    http_method: "POST"                   # Optional: defaults to POST
    json_data: '{"key":"value"}'          # Optional: defaults to '{}'
    glue_url: ${{ secrets.GLUE_API_URL }}
    glue_api_version: "v1"                # Optional: defaults to v1
    glue_project: "my-project"
    glue_path: "{{ github.sha }}/success/deploy"
```
