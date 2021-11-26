var regions = [
  'eastus'
  'eastus2'
  'southcentralus'
  'westus2'
  'westus3'
  'australiaeast'
  'southeastasia'
  'northeurope'
  'swedencentral'
  'uksouth'
  'westeurope'
  'centralus'
  'northcentralus'
  'westus'
  'southafricanorth'
  'centralindia'
  'eastasia'
  'japaneast'
  // 'jioindiawest' // not allowed
  'koreacentral'
  'canadacentral'
  'francecentral'
  'germanywestcentral'
  'norwayeast'
  'switzerlandnorth'
  'uaenorth'
  'brazilsouth'
  // 'centraluseuap' // not allowed
  // 'eastus2euap' // not allowed
  'westcentralus'
  // 'southafricawest' // secondary region
  'australiacentral'
  // 'australiacentral2' // secondary region
  'australiasoutheast'
  'japanwest'
  // 'jioindiacentral' // not allowed
  'koreasouth'
  'southindia'
  'westindia'
  'canadaeast'
  // 'francesouth' // secondary region
  // 'germanynorth' // secondary region
  // 'norwaywest' // secondary region
  // 'switzerlandwest' // secondary region
  'ukwest'
  // 'uaecentral' // secondary region
  // 'brazilsoutheast' // not allowed
]

resource accounts 'Microsoft.Storage/storageAccounts@2021-02-01' = [for region in regions: {
  name: uniqueString(resourceGroup().name, region)
  location: region
  sku: {
    name: 'Standard_RAGRS'
  }
  kind: 'Storage'
}]

output storageAccounts array = [for (region, i) in regions: {
  id: region
  name: accounts[i].name
  url: accounts[i].properties.primaryEndpoints.blob
  secondary: {
    id: accounts[i].properties.secondaryLocation
    url: accounts[i].properties.secondaryEndpoints.blob
  }
}]
