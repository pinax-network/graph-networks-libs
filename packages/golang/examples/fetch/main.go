package main

import (
	"fmt"
	"log"

	registry "github.com/YaroShkvorets/graph-networks-libs/packages/golang/lib"
)

func main() {
    fmt.Printf("Fetching registry from %s\n", registry.GetLatestVersionUrl())

    reg, err := registry.FromLatestVersion()
    if err != nil {
        log.Fatalf("Failed to fetch registry: %v", err)
    }

    fmt.Printf("Successfully loaded %d networks\n", len(reg.Networks))

    // Get network by ID
    if mainnet := reg.GetNetworkById("mainnet"); mainnet != nil {
        fmt.Printf("Found mainnet: %s\n", mainnet.FullName)
    }
}
