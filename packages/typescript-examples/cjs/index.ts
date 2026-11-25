import { NetworksRegistry } from "@pinax/graph-networks-registry";

(async () => {
  try {
    const registry = await NetworksRegistry.fromLatestVersion();
    console.log("Successfully loaded", registry.networks.length, "networks");

    const mainnet = registry.getNetworkByGraphId("mainnet");
    if (!mainnet) {
      throw new Error("Mainnet not found");
    }
    console.log("Found network by graph ID `mainnet`:", mainnet.fullName);

    const apis = registry.getApiUrls("mainnet");
    console.log("API URLs:", apis);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
})();
