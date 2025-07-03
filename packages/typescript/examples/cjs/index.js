(async () => {
    const { NetworksRegistry } = await import('@pinax/graph-networks-registry');

    const registry = await NetworksRegistry.fromLatestVersion();
    console.log("Successfully loaded", registry.networks.length, "networks");

    const mainnet = registry.getNetworkByGraphId("mainnet");
    console.log("Found network by graph ID `mainnet`:", mainnet.fullName);

    const apis = registry.getApiUrls("mainnet");
    console.log("API URLs:", apis);
})();
