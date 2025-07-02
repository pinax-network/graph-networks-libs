package main

import (
	"fmt"
	"log"

	registry "github.com/pinax-network/graph-networks-libs/packages/golang/lib"
)

func main() {
    fmt.Printf("Fetching registry from %s\n", registry.GetLatestVersionUrl())

    reg, err := registry.FromLatestVersion()
    if err != nil {
        log.Fatalf("Failed to fetch registry: %v", err)
    }

    fmt.Printf("Successfully loaded %d networks\n", len(reg.Networks))

    // Get network by graph ID (works with both network ID and alias)
    if mainnet := reg.GetNetworkByGraphId("mainnet"); mainnet != nil {
        fmt.Printf("Found mainnet by ID: %s\n", mainnet.FullName)
    }

    // You can also use the same method to find networks by alias
    if ethereum := reg.GetNetworkByGraphId("eth"); ethereum != nil {
        fmt.Printf("Found ethereum by alias: %s\n", ethereum.FullName)
    }
}
