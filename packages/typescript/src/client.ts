import { type NetworksRegistryInner, type Network, type APIURLKind } from "./types.js";
import { applyEnvVars } from "./env.js";
import { schemaVersion } from "./version.js";

const REGISTRY_BASE_URL = "https://networks-registry.thegraph.com";
const FALLBACK_BASE_URL = "https://raw.githubusercontent.com/graphprotocol/networks-registry/refs/heads/main/public";

let readFileSync: ((path: string, encoding: string) => string) | undefined;
try {
  // Only import fs in Node.js environment
  const fs = require("fs");
  readFileSync = fs.readFileSync;
} catch {}

/**
 * Client for interacting with The Graph Networks Registry.
 * Provides methods to load the registry from json, file or URL.
 */
export class NetworksRegistry {
  /**
   * Creates a new NetworksRegistry instance.
   * @param registry - The parsed NetworksRegistry data
   */
  constructor(private registry: NetworksRegistryInner) {}

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
   * Attempts to fetch the registry from a given URL, returns null if fetch fails
   * @internal
   */
  private static async tryFetchRegistry(url: string): Promise<NetworksRegistry | null> {
    try {
      return await NetworksRegistry.fromUrl(url);
    } catch {
      return null;
    }
  }

  /**
   * Fetches and loads the latest version of the networks registry. First tries to fetch from
   * the primary registry URL at networks-registry.thegraph.com, then falls back to the fallback URL at GitHub
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
    const primaryUrl = NetworksRegistry.getLatestVersionUrl();
    const primaryRegistry = await NetworksRegistry.tryFetchRegistry(primaryUrl);
    if (primaryRegistry) return primaryRegistry;

    const fallbackUrl = NetworksRegistry.getLatestVersionFallbackUrl();
    const fallbackRegistry = await NetworksRegistry.tryFetchRegistry(fallbackUrl);
    if (fallbackRegistry) return fallbackRegistry;

    throw new Error(`Failed to fetch registry from ${primaryUrl}`);
  }

  /**
   * Fetches and loads a specific version of the networks registry. First tries to fetch from
   * the primary registry URL at networks-registry.thegraph.com, then falls back to the fallback URL at GitHub
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
    const primaryUrl = NetworksRegistry.getExactVersionUrl(version);
    const primaryRegistry = await NetworksRegistry.tryFetchRegistry(primaryUrl);
    if (primaryRegistry) return primaryRegistry;

    const fallbackUrl = NetworksRegistry.getExactVersionFallbackUrl(version);
    const fallbackRegistry = await NetworksRegistry.tryFetchRegistry(fallbackUrl);
    if (fallbackRegistry) return fallbackRegistry;

    throw new Error(`Failed to fetch registry from ${primaryUrl}`);
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
    const networksRegistry = parsedData as NetworksRegistryInner;
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
    if (!readFileSync) {
      throw new Error("File system operations are not supported in this environment");
    }
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
    const [major, minor] = schemaVersion.split(".");
    return `${REGISTRY_BASE_URL}/TheGraphNetworksRegistry_v${major}_${minor}_x.json`;
  }

  /**
   * Gets the URL for the latest compatible version of the registry at GitHub.
   * Uses the major and minor version from package.json.
   *
   * @returns The URL string for the latest version
   */
  static getLatestVersionFallbackUrl(): string {
    const [major, minor] = schemaVersion.split(".");
    return `${FALLBACK_BASE_URL}/TheGraphNetworksRegistry_v${major}_${minor}_x.json`;
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
   * Gets the URL for a specific version of the registry at GitHub.
   *
   * @param version - The exact version (e.g. "0.5.0")
   * @returns The URL string for the specified version
   */
  static getExactVersionFallbackUrl(version: string): string {
    return `${FALLBACK_BASE_URL}/TheGraphNetworksRegistry_v${version.replace(/\./g, "_")}.json`;
  }

  /**
   * Finds a network by its unique identifier.
   *
   * @param id - The network ID (e.g. "mainnet", "optimism")
   * @returns The network if found, undefined otherwise
   * @deprecated Use getNetworkByGraphId instead
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
   * @deprecated Use getNetworkByGraphId instead
   *
   * @example
   * ```typescript
   * const ethereum = registry.getNetworkByAlias("eth");
   * ```
   */
  getNetworkByAlias(alias: string): Network | undefined {
    return this.registry.networks.find((network) => network.id === alias || network.aliases?.includes(alias));
  }

  /**
   * Finds a network by its graph ID (either its ID field or one of its aliases).
   *
   * @param id - The graph ID, which could be either the network's ID or one of its aliases
   * @returns The network if found, undefined otherwise
   *
   * @example
   * ```typescript
   * const mainnet = registry.getNetworkByGraphId("mainnet");
   * const ethereum = registry.getNetworkByGraphId("eth");
   * ```
   */
  getNetworkByGraphId(id: string): Network | undefined {
    return this.registry.networks.find((network) => network.id === id || network.aliases?.includes(id));
  }

  /**
   * Finds a network by its CAIP-2 chain ID.
   *
   * @param chainId - The CAIP-2 chain ID in the format "[namespace]:[reference]" (e.g., "eip155:1")
   * @returns The network if found, undefined otherwise
   *
   * @example
   * ```typescript
   * const ethereum = registry.getNetworkByCaip2Id("eip155:1");
   * ```
   */
  getNetworkByCaip2Id(chainId: string): Network | undefined {
    if (!chainId.includes(":")) {
      console.warn("Warning: CAIP-2 Chain ID should be in the format '[namespace]:[reference]', e.g., 'eip155:1'");
      return undefined;
    }

    return this.registry.networks.find((network) => network.caip2Id === chainId);
  }

  /**
   * Gets API URLs for a network, filtered by kind and with environment variables applied.
   * Environment variable placeholders in the format {VARIABLE_NAME} will be replaced with
   * actual environment variable values. URLs that reference non-existent environment
   * variables will be omitted from the result.
   *
   * @param networkId - The network ID or alias
   * @param kinds - Optional array of API URL kinds to filter by. If not provided or empty, returns all kinds
   * @returns Array of API URLs with environment variables applied
   *
   * @example
   * ```typescript
   * // Get all Etherscan API URLs
   * const etherscanUrls = registry.getApiUrls("mainnet", [APIURLKind.Etherscan]);
   *
   * // Get all API URLs for the network
   * const allUrls = registry.getApiUrls("mainnet");
   * ```
   */
  getApiUrls(networkId: string, kinds: APIURLKind[] = []): string[] {
    const apis = this.getNetworkById(networkId)?.apiUrls ?? this.getNetworkByAlias(networkId)?.apiUrls ?? [];

    return apis
      .filter(({ kind }) => kinds.length === 0 || kinds.includes(kind))
      .map(({ url }) => applyEnvVars(url))
      .filter(Boolean);
  }

  /**
   * Gets RPC URLs for a network with environment variables applied.
   * Environment variable placeholders in the format {VARIABLE_NAME} will be replaced with
   * actual environment variable values. URLs that reference non-existent environment
   * variables will be omitted from the result.
   *
   * @param networkId - The network ID or alias
   * @returns Array of RPC URLs with environment variables applied
   *
   * @example
   * ```typescript
   * // Get all RPC URLs for ethereum mainnet
   * const rpcUrls = registry.getRpcUrls("mainnet");
   * ```
   */
  getRpcUrls(networkId: string): string[] {
    const urls = this.getNetworkById(networkId)?.rpcUrls ?? this.getNetworkByAlias(networkId)?.rpcUrls ?? [];

    return urls.map((url) => applyEnvVars(url)).filter(Boolean);
  }
}
