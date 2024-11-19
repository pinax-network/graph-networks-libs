# Networks Registry

Go types and helpers for working with [The Graph Networks Registry](https://github.com/graphprotocol/networks-registry).

## Installation

```bash
go get github.com/pinax-network/graph-networks-libs@v0.6.0
```


## Usage

```go
package main
import (
    "fmt"
    "log"
    registry "github.com/pinax-network/graph-networks-libs/packages/golang/lib"
)

func main() {
    // Fetch the latest compatible version of the registry
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
```

## API Reference

### Functions

- `FromLatestVersion() (*NetworksRegistry, error)` - Fetches the latest version of the registry
- `FromExactVersion(version string) (*NetworksRegistry, error)` - Fetches a specific version
- `FromFile(path string) (*NetworksRegistry, error)` - Loads from a local JSON file
- `FromJSON(data []byte) (*NetworksRegistry, error)` - Parses from JSON bytes
- `FromURL(url string) (*NetworksRegistry, error)` - Loads from a URL

### Methods

- `GetNetworkById(id string) *Network` - Finds a network by ID
- `GetNetworkByAlias(alias string) *Network` - Finds a network by ID or alias
