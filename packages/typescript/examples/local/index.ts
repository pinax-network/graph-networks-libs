import { NetworksRegistry } from "@pinax/graph-networks-registry";

// Read from local file
const registry = NetworksRegistry.fromFile("../../../../sample/TheGraphNetworksRegistry.json");

console.log("Successfully loaded", registry.networks.length, "networks");

// Get network by graph ID (works with both network ID and alias)
const mainnet = registry.getNetworkByGraphId("mainnet");
if (mainnet) {
  console.log("Found mainnet by graph ID:", mainnet.fullName);
}

// Get network by graph ID using an alias
const ethereum = registry.getNetworkByGraphId("eth");
if (ethereum) {
  console.log("Found ethereum by graph ID:", ethereum.fullName);
}
