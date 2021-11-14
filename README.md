# fastest-azure-region

## Pre-deployment

```sh
az group deployment create \
  --resource-group <YOUR-RESOURCE-GROUP> \
  --template-file ./storageAccounts.bicep \
  --query properties.outputs.storageAccounts.value \
  --output json \
    > storageAccounts.json
```