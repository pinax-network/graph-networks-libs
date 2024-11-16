import { NetworksRegistry } from "@pinax/graph-networks-ts";

// Read from local file
const registry = NetworksRegistry.fromFile("./TheGraphNetworksRegistry_v0_5_3.json");

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
