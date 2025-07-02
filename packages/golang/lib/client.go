package registry

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
)

const registryBaseURL = "https://networks-registry.thegraph.com"

// GetLatestVersionUrl returns the URL for the latest compatible version of the networks registry.
// It constructs the URL using the major and minor version numbers from the current package version.
// The URL follows the pattern: https://networks-registry.thegraph.comNetworksRegistry_v{major}_{minor}_x.json
func GetLatestVersionUrl() string {
	major, minor := getMajorMinor()
	return fmt.Sprintf("%s/TheGraphNetworksRegistry_v%s_%s_x.json", registryBaseURL, major, minor)
}

// GetExactVersionUrl returns the URL for a specific version of the networks registry.
// It takes a version string (e.g. "0.5.0") and constructs the URL
// The URL follows the pattern: https://registry.networks-registry.thegraph.comNetworksRegistry_v{version}.json
func GetExactVersionUrl(version string) string {
	versionPath := strings.ReplaceAll(version, ".", "_")
	return fmt.Sprintf("%s/TheGraphNetworksRegistry_v%s.json", registryBaseURL, versionPath)
}

// FromLatestVersion fetches and loads the latest compatibversion of the networks registry.
// Library version 0.5.x will use the latest registry version 0.5.y even if 0.6.z is available
// Returns a pointer to NetworksRegistry and any error encountered during fetching or parsing.
func FromLatestVersion() (*NetworksRegistry, error) {
	url := GetLatestVersionUrl()
	return FromURL(url)
}

// FromExactVersion fetches and loads a specific version of the networks registry.
// It takes a version string (e.g. "0.5.0") and loads the registry for that exact version.
// Returns a pointer to NetworksRegistry and any error encountered during fetching or parsing.
func FromExactVersion(version string) (*NetworksRegistry, error) {
	url := GetExactVersionUrl(version)
	return FromURL(url)
}

// FromURL loads the networks registry from a URL.
// Returns a pointer to NetworksRegistry and any error encountered during the HTTP request or parsing.
// The function will return an error if the HTTP status code is not 200 OK.
func FromURL(url string) (*NetworksRegistry, error) {
	resp, err := http.Get(url)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch registry: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to fetch registry: HTTP %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	return FromJSON(body)
}

// FromJSON creates a new registry instance from JSON bytes.
// It takes a byte slice containing JSON data and unmarshals it into a NetworksRegistry struct.
// Returns a pointer to NetworksRegistry and any error encountered during unmarshaling.
func FromJSON(data []byte) (*NetworksRegistry, error) {
	registry, err := UnmarshalNetworksRegistry(data)
	return &registry, err
}

// FromFile loads the networks registry from a local JSON file.
// It takes a file path, reads the contents, and parses them as a registry.
// Returns a pointer to NetworksRegistry and any error encountered during file reading or parsing.
func FromFile(path string) (*NetworksRegistry, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("failed to read file: %w", err)
	}
	return FromJSON(data)
}

// GetNetworkById finds a network by its unique identifier.
// It takes a network ID string and returns the matching Network if found.
// Returns nil if no network with the given ID exists in the registry.
//
// Deprecated: Use GetNetworkByGraphId instead, which handles both ID and alias lookup.
func (r *NetworksRegistry) GetNetworkById(id string) *Network {
	for i := range r.Networks {
		if r.Networks[i].ID == id {
			return &r.Networks[i]
		}
	}
	return nil
}

// GetNetworkByAlias finds a network by its ID or one of its aliases.
// It takes an alias string and checks both network IDs and alias lists.
// Returns the first matching Network or nil if no match is found.
//
// Deprecated: Use GetNetworkByGraphId instead, which handles both ID and alias lookup.
func (r *NetworksRegistry) GetNetworkByAlias(alias string) *Network {
	for i := range r.Networks {
		network := &r.Networks[i]
		if network.ID == alias {
			return network
		}
		if network.Aliases != nil {
			for _, a := range network.Aliases {
				if a == alias {
					return network
				}
			}
		}
	}
	return nil
}

// GetNetworkByGraphId finds a network by its unique identifier or one of its aliases.
// It unifies the functionality of GetNetworkById and GetNetworkByAlias.
// It takes a graph ID string (which can be either a network ID or an alias)
// and returns the matching Network if found.
// Returns nil if no network with the given ID or alias exists in the registry.
func (r *NetworksRegistry) GetNetworkByGraphId(id string) *Network {
	for i := range r.Networks {
		network := &r.Networks[i]
		if network.ID == id {
			return network
		}
		if network.Aliases != nil {
			for _, a := range network.Aliases {
				if a == id {
					return network
				}
			}
		}
	}
	return nil
}

func getMajorMinor() (string, string) {
	parts := strings.Split(Version, ".")
	if len(parts) < 2 {
		panic("invalid version format: version must include major and minor numbers (x.y.z)")
	}
	return parts[0], parts[1]
}
