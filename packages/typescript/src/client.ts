import { readFileSync } from "fs";
import { type NetworksRegistryElement, type Network } from "./types";
import { version as packageVersion } from "../package.json";

const REGISTRY_BASE_URL = "https://registry.thegraph.com";

/**
 * Client for interacting with The Graph Networks Registry.
 * Provides methods to load the registry from json, file or URL.
 */
export class NetworksRegistry {
  /**
   * Creates a new NetworksRegistry instance.
   * @param registry - The parsed NetworksRegistry data
   */
  constructor(private registry: NetworksRegistryElement) {}

  /**
   * Gets all networks in the registry.
   * @returns Array of all network elements
   */
  get networks(): Network[] {
    return this.registry.networks;
  }

  /**
   * Gets the version of the loaded registry.
   * @returns Version string
   */
  get version(): string {
    return this.registry.version;
  }

  /**
   * Gets the date of the last update of the registry.
   * @returns Date object
   */
  get updatedAt(): Date {
    return new Date(this.registry.updatedAt);
  }
  /**
   * Fetches and loads the latest version of the networks registry.
   * Uses the library version to determine the latest compatible registry URL.
   * Library version 0.5.x will use the latest registry version 0.5.y even if 0.6.z is available
   *
   * @returns Promise that resolves to a new NetworksRegistry instance
   * @throws Error if the registry fetch fails
   *
   * @example
   * ```typescript
   * const registry = await NetworksRegistry.fromLatestVersion();
   * ```
   */
  static async fromLatestVersion(): Promise<NetworksRegistry> {
    const url = NetworksRegistry.getLatestVersionUrl();
    return NetworksRegistry.fromUrl(url);
  }

  /**
   * Fetches and loads a specific version of the networks registry.
   *
   * @param version - The exact version to fetch (e.g. "0.5.0")
   * @returns Promise that resolves to a new NetworksRegistry instance
   * @throws Error if the registry fetch fails
   *
   * @example
   * ```typescript
   * const registry = await NetworksRegistry.fromExactVersion("0.5.0");
   * ```
   */
  static async fromExactVersion(version: string): Promise<NetworksRegistry> {
    const url = NetworksRegistry.getExactVersionUrl(version);
    return NetworksRegistry.fromUrl(url);
  }

  /**
   * Loads the networks registry from a URL.
   *
   * @param url - The URL to fetch the registry from
   * @returns Promise that resolves to a new NetworksRegistry instance
   * @throws Error if the fetch fails or the response is invalid
   */
  static async fromUrl(url: string): Promise<NetworksRegistry> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch registry: ${response.statusText}`);
    }
    const json = await response.text();
    return NetworksRegistry.fromJson(json);
  }

  /**
   * Creates a new registry instance from a JSON string.
   *
   * @param json - The JSON string containing registry data
   * @returns A new NetworksRegistry instance
   * @throws Error if the JSON is invalid
   */
  static fromJson(json: string): NetworksRegistry {
    const parsedData = JSON.parse(json);
    const networksRegistry = parsedData as NetworksRegistryElement;
    return new NetworksRegistry(networksRegistry);
  }

  /**
   * Loads the networks registry from a local JSON file.
   *
   * @param path - Path to the JSON file
   * @returns A new NetworksRegistry instance
   * @throws Error if the file cannot be read or contains invalid data
   */
  static fromFile(path: string): NetworksRegistry {
    const contents = readFileSync(path, "utf-8");
    return NetworksRegistry.fromJson(contents);
  }

  /**
   * Gets the URL for the latest compatible version of the registry.
   * Uses the major and minor version from package.json.
   *
   * @returns The URL string for the latest version
   */
  static getLatestVersionUrl(): string {
    const [major, minor] = packageVersion.split(".");
    return `${REGISTRY_BASE_URL}/TheGraphNetworksRegistry_v${major}_${minor}_x.json`;
  }

  /**
   * Gets the URL for a specific version of the registry.
   *
   * @param version - The exact version (e.g. "0.5.0")
   * @returns The URL string for the specified version
   */
  static getExactVersionUrl(version: string): string {
    return `${REGISTRY_BASE_URL}/TheGraphNetworksRegistry_v${version.replace(/\./g, "_")}.json`;
  }

  /**
   * Finds a network by its unique identifier.
   *
   * @param id - The network ID (e.g. "mainnet", "optimism")
   * @returns The network if found, undefined otherwise
   *
   * @example
   * ```typescript
   * const mainnet = registry.getNetworkById("mainnet");
   * ```
   */
  getNetworkById(id: string): Network | undefined {
    return this.registry.networks.find((network) => network.id === id);
  }

  /**
   * Finds a network by its ID or one of its aliases.
   *
   * @param alias - The network ID or alias (e.g. "eth" for Ethereum mainnet)
   * @returns The network if found, undefined otherwise
   *
   * @example
   * ```typescript
   * const ethereum = registry.getNetworkByAlias("eth");
   * ```
   */
  getNetworkByAlias(alias: string): Network | undefined {
    return this.registry.networks.find((network) => network.id === alias || network.aliases?.includes(alias));
  }
}
