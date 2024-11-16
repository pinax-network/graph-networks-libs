import { NetworksRegistryClient } from "@pinax/graph-networks-ts";

async function main() {
  // Fetch latest registry
  const url = NetworksRegistryClient.getLatestVersionUrl();
  console.log("Fetching latest registry: ", url);
  const registry = await NetworksRegistryClient.fromLatestVersion();

  console.log("Successfully loaded", registry.networks.length, "networks");

  // Get network by ID
  const mainnet = registry.getNetworkById("mainnet");
  if (mainnet) {
    console.log("Found mainnet:", mainnet.fullName);
  }
}

main().catch(console.error);
