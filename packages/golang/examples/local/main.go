package main

import (
	"fmt"
	"log"

	registry "github.com/pinax-network/graph-networks-libs/packages/golang/lib"
)

func main() {
    // Load from local file
    reg, err := registry.FromFile("../../../../sample/TheGraphNetworksRegistry.json")
    if err != nil {
        log.Fatalf("Failed to load registry: %v", err)
    }
    fmt.Printf("Successfully loaded %d networks\n", len(reg.Networks))

    // Get network by graph ID (works with both network ID and alias)
    if mainnet := reg.GetNetworkByGraphId("mainnet"); mainnet != nil {
        fmt.Printf("Found mainnet by ID: %s\n", mainnet.FullName)
    }

    // Get network by alias using the new unified method
    if ethereum := reg.GetNetworkByGraphId("eth"); ethereum != nil {
        fmt.Printf("Found ethereum by alias: %s\n", ethereum.FullName)
    }
}
