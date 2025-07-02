package registry

import (
	"testing"
)

func TestNetworksRegistry(t *testing.T) {
    testRegistryJSON := `{
        "$schema": "https://networks-registry.thegraph.com/TheGraphNetworksRegistrySchema_v0_7.json",
        "version": "0.7.0",
        "title": "Test Registry",
        "description": "Test Registry",
        "updatedAt": "2025-01-01T00:00:00Z",
        "networks": [
            {
                "id": "mainnet",
                "fullName": "Ethereum Mainnet",
                "shortName": "Ethereum",
                "caip2Id": "eip155:1",
                "networkType": "mainnet",
                "aliases": ["ethereum", "eth"],
                "issuanceRewards": true,
                "services": {}
            }
        ]
    }`

    registry, err := FromJSON([]byte(testRegistryJSON))
    if err != nil {
        t.Fatalf("Failed to parse registry: %v", err)
    }

    if len(registry.Networks) != 1 {
        t.Errorf("Expected 1 network, got %d", len(registry.Networks))
    }

    if registry.Version != "0.7.0" {
        t.Errorf("Expected version 0.7.0, got %s", registry.Version)
    }

    // Test network lookup with new unified method
    if network := registry.GetNetworkByGraphId("mainnet"); network == nil {
        t.Error("Expected to find mainnet network by ID")
    }

    if network := registry.GetNetworkByGraphId("eth"); network == nil {
        t.Error("Expected to find network by alias 'eth'")
    }

    if network := registry.GetNetworkByGraphId("nonexistent"); network != nil {
        t.Error("Expected nil for nonexistent network")
    }

    // Test deprecated methods for backward compatibility
    if network := registry.GetNetworkById("mainnet"); network == nil {
        t.Error("Expected to find mainnet network with deprecated GetNetworkById")
    }

    if network := registry.GetNetworkByAlias("eth"); network == nil {
        t.Error("Expected to find network with deprecated GetNetworkByAlias")
    }
}
