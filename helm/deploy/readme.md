# Helm Deploy

Deploys a helm chart to a k8s cluster.

```yaml
- uses: Chia-Network/actions/helm/deploy@main
  with:
    namespace: k8s-namespace
    app_name: "my-k8s-app-name"
    helm_chart: "./k8s/charts/my-chart"
    helm_values: "./k8s/values/prd.yaml"
```
