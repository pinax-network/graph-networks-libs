import { NetworksRegistry } from "@pinax/graph-networks-registry";

async function main() {
  // Fetch latest registry
  const url = NetworksRegistry.getLatestVersionUrl();
  console.log("Fetching latest registry: ", url);
  const registry = await NetworksRegistry.fromLatestVersion();

  console.log("Successfully loaded", registry.networks.length, "networks");

  // Using the new getNetworkByGraphId method which works with both network ID and alias
  const mainnet = registry.getNetworkByGraphId("mainnet");
  if (mainnet) {
    console.log("Found mainnet by graph ID:", mainnet.fullName);
  }

  const apis = registry.getApiUrls("mainnet");
  console.log("API URLs:", apis);
}

main().catch(console.error);
