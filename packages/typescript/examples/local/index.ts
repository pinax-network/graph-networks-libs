import { NetworksRegistry } from "@pinax/graph-networks-registry";

// Read from local file
const registry = NetworksRegistry.fromFile("../../../../registry/TheGraphNetworksRegistry.json");

console.log("Successfully loaded", registry.networks.length, "networks");

// Get network by ID
const mainnet = registry.getNetworkById("mainnet");
if (mainnet) {
  console.log("Found mainnet:", mainnet.fullName);
}

// Get network by alias
const ethereum = registry.getNetworkByAlias("eth");
if (ethereum) {
  console.log("Found ethereum by alias:", ethereum.fullName);
}
