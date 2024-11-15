# Networks Registry

Rust types and helpers for working with [The Graph Networks Registry](https://github.com/graphprotocol/networks-registry).

## Usage
If you want to always get up-to-date registry, make sure to use the latest version of the crate.

`Cargo.toml`:
```toml
[dependencies]
graph-networks = "0.5.0"
```

### Reading from a local file

To read the registry from a local file

```rust
use graph_networks::NetworksRegistry;
fn main() {
    // Parse registry from JSON file
    let registry = NetworksRegistry::from_file("TheGraphNetworksRegistry_v0_5_3.json")
        .expect("Failed to parse registry");

    if let Some(network) = registry.get_network_by_id("mainnet") {
        println!("Found mainnet: {:?}", network);
    }
}

```


### Fetching the latest registry

To fetch the latest registry version from the official source


```rust
use graph_networks::NetworksRegistry;

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
graph-networks = { version = "0.5.0", default-features = false }
```
