// Module provides Go types and helpers for working with The Graph Networks Registry.
//
// # Main Type
//
// The primary type is NetworksRegistry, which represents the complete registry data structure.
// It contains the list of all networks in the Graph Ecosystem and provides methods for network lookups.
//
// # Loading the Registry
//
//	// Fetch the latest version from the official registry
//	reg, err := registry.FromLatestVersion()
//	if err != nil {
//	    log.Fatal(err)
//	}
//
//	// Or load from a local file
//	reg, err = registry.FromFile("TheGraphNetworksRegistry.json")
//	if err != nil {
//	    log.Fatal(err)
//	}
//
// # Looking Up Networks
//
//	// By ID or alias
//	if mainnet := reg.GetNetworkByGraphId("mainnet"); mainnet != nil {
//	    fmt.Printf("Found mainnet: %s\n", mainnet.FullName)
//	}
//
//	// By CAIP-2 ID
//	if ethereum := reg.GetNetworkByCaip2Id("eip155:1"); ethereum != nil {
//	    fmt.Printf("Found ethereum by CAIP-2 ID: %s\n", ethereum.FullName)
//	}
//
// # Loading Methods
//
//   - FromLatestVersion(): fetches the latest compatible version
//   - FromExactVersion(version): fetches a specific version
//   - FromFile(path): loads from a local JSON file
//   - FromJSON(data): parses from JSON bytes
//   - FromURL(url): fetches from any HTTP URL
//
// # Enums
//
// Enum types (NetworkType, Protocol, RelationKind, SubgraphKind, BytesEncoding, APIURLKind, Feature)
// have type-prefixed constants (e.g. NetworkTypeMainnet) and helpers to parse, validate and list values:
//
//	nt, err := registry.ParseNetworkType("mainnet") // registry.NetworkTypeMainnet, or ErrInvalidNetworkType
//	valid := registry.NetworkType("beacon").IsValid() // true
//	all := registry.NetworkTypeValues()
//
// Unmarshalling JSON does not validate enum values, so registries with values added in a newer schema
// still load. Use IsValid to check them.
//
// For more information about The Graph Networks Registry, visit:
// https://github.com/graphprotocol/networks-registry
package registry
