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
//	// By ID
//	if mainnet := reg.GetNetworkById("mainnet"); mainnet != nil {
//	    fmt.Printf("Found mainnet: %s\n", mainnet.FullName)
//	}
//
//	// By alias
//	if ethereum := reg.GetNetworkByAlias("eth"); ethereum != nil {
//	    fmt.Printf("Found ethereum by alias: %s\n", ethereum.FullName)
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
// For more information about The Graph Networks Registry, visit:
// https://github.com/graphprotocol/networks-registry
package registry
