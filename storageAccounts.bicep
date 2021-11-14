var regions = [
  'eastus'
  'eastus2'
  'southcentralus'
  'westus2'
  'westus3'
  'australiaeast'
  'southeastasia'
  'northeurope'
  // 'swedencentral'
  'uksouth'
  'westeurope'
  'centralus'
  'northcentralus'
  'westus'
  'southafricanorth'
  'centralindia'
  'eastasia'
  'japaneast'
  // 'jioindiawest'
  'koreacentral'
  'canadacentral'
  'francecentral'
  'germanywestcentral'
  'norwayeast'
  'switzerlandnorth'
  'uaenorth'
  'brazilsouth'
  // 'centraluseuap'
  // 'eastus2euap'
  'westcentralus'
  // 'southafricawest'
  'australiacentral'
  // 'australiacentral2'
  'australiasoutheast'
  'japanwest'
  // 'jioindiacentral'
  'koreasouth'
  'southindia'
  'westindia'
  'canadaeast'
  // 'francesouth'
  // 'germanynorth'
  // 'norwaywest'
  // 'switzerlandwest'
  'ukwest'
  // 'uaecentral'
  // 'brazilsoutheast'
]

resource accounts 'Microsoft.Storage/storageAccounts@2021-02-01' = [for region in regions: {
  name: 'jcbdevfst${uniqueString(region)}'
  location: region
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'Storage'
}]

output storageAccounts array = [for (region, i) in regions: {
  id: region
  name: accounts[i].name
  url: accounts[i].properties.primaryEndpoints.blob
}]
