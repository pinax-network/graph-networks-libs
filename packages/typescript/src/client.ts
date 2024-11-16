import { readFileSync } from "fs";
import { type NetworksRegistry, type NetworkElement, Convert } from "./types";
import { version as packageVersion } from "../package.json";

const REGISTRY_BASE_URL = "https://registry.thegraph.com";

export class NetworksRegistryClient {
  constructor(private registry: NetworksRegistry) {}

  static async fromLatestVersion(): Promise<NetworksRegistryClient> {
    const url = NetworksRegistryClient.getLatestVersionUrl();
    return NetworksRegistryClient.fromUrl(url);
  }

  static async fromExactVersion(version: string): Promise<NetworksRegistryClient> {
    const url = NetworksRegistryClient.getExactVersionUrl(version);
    return NetworksRegistryClient.fromUrl(url);
  }

  static async fromUrl(url: string): Promise<NetworksRegistryClient> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch registry: ${response.statusText}`);
    }
    const json = await response.text();
    return NetworksRegistryClient.fromJson(json);
  }

  static fromJson(json: string): NetworksRegistryClient {
    const networksRegistry = Convert.toNetworksRegistry(json);
    return new NetworksRegistryClient(networksRegistry);
  }

  static fromFile(path: string): NetworksRegistryClient {
    const contents = readFileSync(path, "utf-8");
    return NetworksRegistryClient.fromJson(contents);
  }

  // URL helpers
  static getLatestVersionUrl(): string {
    const [major, minor] = packageVersion.split(".");
    return `${REGISTRY_BASE_URL}/TheGraphNetworksRegistry_v${major}_${minor}_x.json`;
  }

  static getExactVersionUrl(version: string): string {
    return `${REGISTRY_BASE_URL}/TheGraphNetworksRegistry_v${version.replace(/\./g, "_")}.json`;
  }

  // Instance methods
  getNetworkById(id: string): NetworkElement | undefined {
    return this.registry.networks.find((network) => network.id === id);
  }

  getNetworkByAlias(alias: string): NetworkElement | undefined {
    return this.registry.networks.find((network) => network.id === alias || network.aliases?.includes(alias));
  }

  // Getters for registry properties
  get networks(): NetworkElement[] {
    return this.registry.networks;
  }

  get version(): string {
    return this.registry.version;
  }
}
