# Networks Registry

Rust types and helpers for working with The Graph Networks Registry.

## Usage

Add this to your `Cargo.toml`:

```toml
toml
[dependencies]
networks-registry = "0.1.0"
```

### Basic Usage

```rust
use networks_registry::NetworksRegistry;
fn main() {
    // Parse registry from JSON
    let registry: NetworksRegistry = serde_json::from_str(json_str).unwrap();
    // Get a specific network
    if let Some(network) = registry.get_network_by_id("mainnet") {
        println!("Found network: {}", network.name);
    }
}
```

### Fetching Registry (requires "fetch" feature)

```rust
use networks_registry::fetch_registry;

#[tokio::main]
async fn main() {
    let registry = fetch_registry().await.unwrap();
    println!("Loaded {} networks", registry.networks.len());
}
```

## Features

- `fetch` - Enables the `fetch_registry()` function using reqwest (enabled by default)

## License

MIT
