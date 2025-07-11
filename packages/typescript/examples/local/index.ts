import { NetworksRegistry } from "@pinax/graph-networks-registry";

try {
  // Read from local file
  const registry = NetworksRegistry.fromFile("../../../../sample/TheGraphNetworksRegistry.json");

  console.log("Successfully loaded", registry.networks.length, "networks");

  // Get network by graph ID (works with both network ID and alias)
  const mainnet = registry.getNetworkByGraphId("mainnet");
  if (!mainnet) {
    throw new Error("Mainnet not found");
  }
  console.log("Found mainnet by graph ID:", mainnet.fullName);
} catch (error) {
  console.error("Error:", error);
  process.exit(1);
}
