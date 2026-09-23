# The Graph Networks Registry Go Library

[![Go Module](https://img.shields.io/github/v/tag/pinax-network/graph-networks-libs?filter=packages/golang/*&label=go%20module&sort=semver)](https://pkg.go.dev/github.com/pinax-network/graph-networks-libs/packages/golang/lib) [![Go Package](https://pkg.go.dev/badge/github.com/pinax-network/graph-networks-libs/packages/golang.svg)](https://pkg.go.dev/github.com/pinax-network/graph-networks-libs/packages/golang) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Go types and helpers for working with [The Graph Networks Registry](https://github.com/graphprotocol/networks-registry).

Documentation available [here](https://pkg.go.dev/github.com/pinax-network/graph-networks-libs/packages/golang/lib).

## Usage

```bash
$ go get github.com/pinax-network/graph-networks-libs/packages/golang@latest
```

### Fetching the latest registry
```go
package main
import (
    "fmt"
    "log"
    registry "github.com/pinax-network/graph-networks-libs/packages/golang/lib"
)

func main() {
    // Fetch the latest compatible version of the registry from networks-registry.thegraph.com
    reg, err := registry.FromLatestVersion()
    if err != nil {
        log.Fatalf("Failed to fetch registry: %v", err)
    }

    fmt.Printf("Successfully loaded %d networks\n", len(reg.Networks))

    // Get network by graph ID (works with both network ID and alias)
    if mainnet := reg.GetNetworkByGraphId("mainnet"); mainnet != nil {
        fmt.Printf("Found mainnet: %s\n", mainnet.FullName)
    }

    // You can also use it to find networks by alias
    if ethereum := reg.GetNetworkByGraphId("eth"); ethereum != nil {
        fmt.Printf("Found ethereum by alias: %s\n", ethereum.FullName)
    }
}
```

### Fetching from a local file
```go
package main
import (
    "fmt"
    "log"
    registry "github.com/pinax-network/graph-networks-libs/packages/golang/lib"
)

func main() {
    reg, err := registry.FromFile("TheGraphNetworksRegistry_v0_8_0.json")
    if err != nil {
        log.Fatalf("Failed to load registry: %v", err)
    }
    fmt.Printf("Successfully loaded %d networks\n", len(reg.Networks))
}
```

## API Reference

See reference on [pkg.go.dev](https://pkg.go.dev/github.com/pinax-network/graph-networks-libs/packages/golang/lib)

### Constructors

- `FromLatestVersion() (*NetworksRegistry, error)` - Fetches the latest compatible version of the registry (recommended)
- `FromExactVersion(version string) (*NetworksRegistry, error)` - Fetches a specific version
- `FromFile(path string) (*NetworksRegistry, error)` - Loads from a local JSON file
- `FromJSON(data []byte) (*NetworksRegistry, error)` - Parses from JSON bytes
- `FromURL(url string) (*NetworksRegistry, error)` - Loads from a URL

### Methods

- `GetNetworkByGraphId(id string) *Network` - Finds a network by ID or alias (recommended)
- `GetNetworkById(id string) *Network` - Finds a network by ID (deprecated)
- `GetNetworkByAlias(alias string) *Network` - Finds a network by ID or alias (deprecated)

### Enums

Enum types (`NetworkType`, `Protocol`, `RelationKind`, `SubgraphKind`, `BytesEncoding`, `APIURLKind`, `Feature`) are generated with [go-enum](https://github.com/abice/go-enum):

- Type-prefixed constants, e.g. `NetworkTypeMainnet`, `RelationKindTestnetOf`
- `Parse<Type>(s string) (<Type>, error)` - Parses and validates a value, returns `ErrInvalid<Type>` on unknown values
- `(<Type>).IsValid() bool` - Checks that a value is known
- `<Type>Values() []<Type>` / `<Type>Names() []string` - Lists all known values

```go
nt, err := registry.ParseNetworkType("mainnet") // registry.NetworkTypeMainnet
```

Unmarshalling JSON does not validate enum values, so a registry with values added in a newer schema still loads. Use `IsValid()` to check them.
The short constants generated previously (e.g. `Mainnet`, `PurpleOther`) are deprecated in favor of the type-prefixed ones.
