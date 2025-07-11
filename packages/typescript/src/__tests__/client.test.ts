import { vi, describe, test, expect, beforeEach, afterEach } from "vitest";
import { NetworksRegistry } from "../client";
import { schemaVersion } from "../version";
import { version as packageVersion } from "../../package.json";
import { join } from "path";
import { APIURLKind } from "../types";

describe("NetworksRegistry", () => {
  const testRegistryJson = {
    $schema: "https://networks-registry.thegraph.com/TheGraphNetworksRegistrySchema_v0_7.json",
    version: "0.7.0",
    title: "Test Registry",
    description: "Test Registry",
    updatedAt: "2025-01-01T00:00:00Z",
    networks: [
      {
        id: "mainnet",
        fullName: "Ethereum Mainnet",
        shortName: "Ethereum",
        caip2Id: "eip155:1",
        networkType: "mainnet",
        aliases: ["ethereum", "eth"],
        issuanceRewards: true,
        services: {},
        apiUrls: [
          {
            kind: "etherscan",
            url: "https://api.etherscan.io/api",
          },
          {
            kind: "etherscan",
            url: "https://api.etherscan.io/api?apikey={ETHERSCAN_API_KEY}",
          },
          {
            kind: "ethplorer",
            url: "https://api.ethplorer.io/{ETHPLORER_API_KEY}",
          },
          {
            kind: "blockscout",
            url: "https://blockscout.com/eth/mainnet/api",
          },
        ],
        rpcUrls: [
          "https://ethereum.publicnode.com",
          "https://eth.llamarpc.com",
          "https://mainnet.infura.io/v3/{INFURA_API_KEY}",
          "https://eth-mainnet.g.alchemy.com/v2/{ALCHEMY_API_KEY}",
        ],
      },
    ],
  };

  describe("parsing and loading", () => {
    test("should parse registry from JSON string", () => {
      const registry = NetworksRegistry.fromJson(JSON.stringify(testRegistryJson));
      expect(registry.networks.length).toBe(1);
      expect(registry.version).toBe("0.7.0");
    });

    test("should load registry from file", () => {
      // Write test JSON to temp file
      const tempFile = join(__dirname, "temp-registry.json");
      const jsonStr = JSON.stringify(testRegistryJson, null, 2);
      require("fs").writeFileSync(tempFile, jsonStr);

      const registry = NetworksRegistry.fromFile(tempFile);
      expect(registry.networks.length).toBe(1);

      // Cleanup
      require("fs").unlinkSync(tempFile);
    });
  });

  describe("network lookup", () => {
    const registry = NetworksRegistry.fromJson(JSON.stringify(testRegistryJson));

    test("should find network by ID", () => {
      const network = registry.getNetworkById("mainnet");
      expect(network).toBeDefined();
      expect(network?.id).toBe("mainnet");
    });

    test("should find network by alias", () => {
      const network = registry.getNetworkByAlias("eth");
      expect(network).toBeDefined();
      expect(network?.id).toBe("mainnet");

      const network2 = registry.getNetworkByAlias("ethereum");
      expect(network2).toBeDefined();
      expect(network2?.id).toBe("mainnet");
    });

    test("should find network by graph ID", () => {
      // Find by network ID
      const network = registry.getNetworkByGraphId("mainnet");
      expect(network).toBeDefined();
      expect(network?.id).toBe("mainnet");

      // Find by alias
      const network2 = registry.getNetworkByGraphId("eth");
      expect(network2).toBeDefined();
      expect(network2?.id).toBe("mainnet");

      const network3 = registry.getNetworkByGraphId("ethereum");
      expect(network3).toBeDefined();
      expect(network3?.id).toBe("mainnet");

      // Non-existent ID
      const network4 = registry.getNetworkByGraphId("nonexistent");
      expect(network4).toBeUndefined();
    });

    test("should return undefined for nonexistent network", () => {
      const network = registry.getNetworkById("nonexistent");
      expect(network).toBeUndefined();

      const network2 = registry.getNetworkByAlias("nonexistent");
      expect(network2).toBeUndefined();
    });

    test("should find network by CAIP-2 chain ID", () => {
      const network = registry.getNetworkByCaip2Id("eip155:1");
      expect(network).toBeDefined();
      expect(network?.id).toBe("mainnet");
    });

    test("should return undefined for nonexistent CAIP-2 chain ID", () => {
      const network = registry.getNetworkByCaip2Id("cosmos:cosmoshub-4");
      expect(network).toBeUndefined();
    });

    test("should warn and return undefined for invalid CAIP-2 chain ID format", () => {
      // Mock console.warn
      const originalConsoleWarn = console.warn;
      const mockConsoleWarn = vi.fn();
      console.warn = mockConsoleWarn;

      const network = registry.getNetworkByCaip2Id("invalid-format");
      expect(network).toBeUndefined();
      expect(mockConsoleWarn).toHaveBeenCalledWith(
        "Warning: CAIP-2 Chain ID should be in the format '[namespace]:[reference]', e.g., 'eip155:1'"
      );

      // Restore console.warn
      console.warn = originalConsoleWarn;
    });
  });

  describe("version URLs", () => {
    const [major, minor] = schemaVersion.split(".");
    const [major2, minor2] = packageVersion.split(".");

    test("version should match package version", () => {
      expect(major).toBe(major2);
      expect(minor).toBe(minor2);
    });

    test("should generate correct latest version URL", () => {
      const url = NetworksRegistry.getLatestVersionUrl();
      expect(url).toBe(`https://networks-registry.thegraph.com/TheGraphNetworksRegistry_v${major}_${minor}_x.json`);
    });

    test("should generate correct exact version URL", () => {
      const url = NetworksRegistry.getExactVersionUrl("1.2.3");
      expect(url).toBe("https://networks-registry.thegraph.com/TheGraphNetworksRegistry_v1_2_3.json");
    });

    test("should generate correct latest version fallback URL", () => {
      const url = NetworksRegistry.getLatestVersionFallbackUrl();
      expect(url).toBe(
        `https://raw.githubusercontent.com/graphprotocol/networks-registry/refs/heads/main/public/TheGraphNetworksRegistry_v${major}_${minor}_x.json`
      );
    });
  });

  describe("API URLs", () => {
    let originalEnv: NodeJS.ProcessEnv;
    const registry = NetworksRegistry.fromJson(JSON.stringify(testRegistryJson));

    beforeEach(() => {
      originalEnv = process.env;
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    test("should get all API URLs when no kind specified", () => {
      process.env.ETHERSCAN_API_KEY = "test-key-1";
      process.env.ETHPLORER_API_KEY = "test-key-2";

      const urls = registry.getApiUrls("mainnet");
      expect(urls).toHaveLength(4);
      expect(urls).toContain("https://api.etherscan.io/api");
      expect(urls).toContain("https://api.etherscan.io/api?apikey=test-key-1");
      expect(urls).toContain("https://api.ethplorer.io/test-key-2");
      expect(urls).toContain("https://blockscout.com/eth/mainnet/api");
    });

    test("should filter URLs by kind", () => {
      process.env.ETHERSCAN_API_KEY = "test-key-1";

      const urls = registry.getApiUrls("eth", [APIURLKind.Etherscan]);
      expect(urls).toHaveLength(2);
      expect(urls[0]).toBe("https://api.etherscan.io/api");
      expect(urls[1]).toBe("https://api.etherscan.io/api?apikey=test-key-1");
    });

    test("should filter URLs by kind", () => {
      process.env.ETHERSCAN_API_KEY = "test-key-1";

      const urls = registry.getApiUrls("ethereum", [APIURLKind.Etherscan, APIURLKind.Ethplorer]);
      expect(urls).toHaveLength(2);
      expect(urls[0]).toBe("https://api.etherscan.io/api");
      expect(urls[1]).toBe("https://api.etherscan.io/api?apikey=test-key-1");
    });

    test("should filter URLs by kind", () => {
      process.env.ETHERSCAN_API_KEY = "test-key-1";
      process.env.ETHPLORER_API_KEY = "test-key-2";

      const urls = registry.getApiUrls("mainnet", [APIURLKind.Etherscan, APIURLKind.Ethplorer]);
      expect(urls).toHaveLength(3);
      expect(urls[0]).toBe("https://api.etherscan.io/api");
      expect(urls[1]).toBe("https://api.etherscan.io/api?apikey=test-key-1");
      expect(urls[2]).toBe("https://api.ethplorer.io/test-key-2");
    });

    test("should omit URLs with missing environment variables", () => {
      delete process.env.ETHERSCAN_API_KEY;
      process.env.ETHPLORER_API_KEY = "test-key-2";

      const urls = registry.getApiUrls("mainnet");
      expect(urls).toHaveLength(3);
      expect(urls).toContain("https://api.etherscan.io/api");
      expect(urls).toContain("https://api.ethplorer.io/test-key-2");
      expect(urls).toContain("https://blockscout.com/eth/mainnet/api");
      expect(urls).not.toContain(expect.stringContaining("etherscan"));
    });

    test("should return empty array for non-existent network", () => {
      const urls = registry.getApiUrls("nonexistent");
      expect(urls).toEqual([]);
    });

    test("should return empty array for network without API URLs", () => {
      const registryWithoutApis = NetworksRegistry.fromJson(
        JSON.stringify({
          ...testRegistryJson,
          networks: [
            {
              ...testRegistryJson.networks[0],
              apiUrls: undefined,
            },
          ],
        })
      );

      const urls = registryWithoutApis.getApiUrls("mainnet");
      expect(urls).toEqual([]);
    });
  });

  describe("RPC URLs", () => {
    let originalEnv: NodeJS.ProcessEnv;
    const registry = NetworksRegistry.fromJson(JSON.stringify(testRegistryJson));

    beforeEach(() => {
      originalEnv = process.env;
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    test("should get all RPC URLs", () => {
      process.env.INFURA_API_KEY = "test-key-1";
      process.env.ALCHEMY_API_KEY = "test-key-2";

      const urls = registry.getRpcUrls("mainnet");
      expect(urls).toHaveLength(4);
      expect(urls).toContain("https://ethereum.publicnode.com");
      expect(urls).toContain("https://eth.llamarpc.com");
      expect(urls).toContain("https://mainnet.infura.io/v3/test-key-1");
      expect(urls).toContain("https://eth-mainnet.g.alchemy.com/v2/test-key-2");
    });

    test("should omit RPC URLs with missing environment variables", () => {
      process.env.INFURA_API_KEY = "test-key-1";
      // ALCHEMY_API_KEY is not set

      const urls = registry.getRpcUrls("ethereum");
      expect(urls).toHaveLength(3);
      expect(urls).toContain("https://ethereum.publicnode.com");
      expect(urls).toContain("https://eth.llamarpc.com");
      expect(urls).toContain("https://mainnet.infura.io/v3/test-key-1");
      expect(urls).not.toContain(expect.stringContaining("alchemy"));
    });

    test("should return empty array for non-existent network", () => {
      const urls = registry.getRpcUrls("nonexistent");
      expect(urls).toEqual([]);
    });

    test("should find network by alias", () => {
      process.env.INFURA_API_KEY = "test-key-1";

      const urls = registry.getRpcUrls("mainnet");
      expect(urls.length).toBeGreaterThan(0);
      expect(urls).toContain("https://mainnet.infura.io/v3/test-key-1");
    });

    test("should return empty array for network without RPC URLs", () => {
      const registryWithoutRpc = NetworksRegistry.fromJson(
        JSON.stringify({
          ...testRegistryJson,
          networks: [
            {
              ...testRegistryJson.networks[0],
              rpcUrls: undefined,
            },
          ],
        })
      );

      const urls = registryWithoutRpc.getRpcUrls("mainnet");
      expect(urls).toEqual([]);
    });
  });
});
