import { NetworksRegistry } from "@pinax/graph-networks-registry";

async function main() {
  // Fetch latest registry
  const url = NetworksRegistry.getLatestVersionUrl();
  console.log("Fetching latest registry: ", url);
  const registry = await NetworksRegistry.fromLatestVersion();

  console.log("Successfully loaded", registry.networks.length, "networks");

  const mainnet = registry.getNetworkById("mainnet");
  if (mainnet) {
    console.log("Found mainnet:", mainnet.fullName);
  }
}

main().catch(console.error);
