import type { NetworksRegistry } from "./types";

export function getNetworkById(registry: NetworksRegistry, id: string) {
  return registry.networks.find((network) => network.id === id);
}

export async function fetchRegistry(): Promise<NetworksRegistry> {
  const response = await fetch(
    "https://registry.thegraph.com/TheGraphNetworksRegistry.json"
  );
  return response.json();
}
