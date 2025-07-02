# The Graph Networks Registry Rust Library
[![Crates.io](https://img.shields.io/crates/v/graph-networks-registry.svg?label=crates.io%20crate)](https://crates.io/crates/graph-networks-registry) [![Docs.rs](https://docs.rs/graph-networks-registry/badge.svg)](https://docs.rs/graph-networks-registry) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Rust types and helpers for working with [The Graph Networks Registry](https://github.com/graphprotocol/networks-registry).

Documentation available [here](https://docs.rs/graph-networks-registry).

## Usage
If you want to always get up-to-date registry, make sure to use the latest version of the crate.

`Cargo.toml`:
```toml
[dependencies]
graph-networks-registry = "0.7.0"
```

### Reading from a local file

To read the registry from a local file

```rust
use graph_networks_registry::NetworksRegistry;
fn main() {
    // Parse registry from JSON file
    let registry = NetworksRegistry::from_file("TheGraphNetworksRegistry_v0_7_0.json")
        .expect("Failed to parse registry");

    if let Some(network) = registry.get_network_by_graph_id("mainnet") {
        println!("Found mainnet: {:?}", network);
    }

    // You can also use an alias with get_network_by_graph_id
    if let Some(network) = registry.get_network_by_graph_id("eth") {
        println!("Found ethereum by alias: {:?}", network);
    }
}

```


### Fetching the latest registry

To fetch the latest compatible registry version from networks-registry.thegraph.com


```rust
use graph_networks_registry::NetworksRegistry;

#[tokio::main]
async fn main() {
    let registry = NetworksRegistry::from_latest_version()
        .await
        .expect("Failed to fetch registry");
    println!("Loaded {} networks", registry.networks.len());
}
```

## Features

- `fetch` - Enables remote registry fetching functionality using reqwest (enabled by default)

If you don't need to fetch the registry from the network, you can turn off the `fetch` feature in your `Cargo.toml`:

```toml
[dependencies]
graph-networks-registry = { version = "0.7.0", default-features = false }
```
