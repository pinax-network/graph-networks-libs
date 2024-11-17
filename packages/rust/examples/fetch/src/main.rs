use graph_networks_registry::NetworksRegistry;

#[tokio::main]
async fn main() {
    println!("Fetching registry from {}", NetworksRegistry::get_latest_version_url());

    let registry = NetworksRegistry::from_latest_version().await.expect("Failed to fetch registry");

    println!("Successfully loaded {} networks", registry.networks.len());

    let network = registry.get_network_by_id("mainnet");
    println!("Found mainnet by id: {}", network.expect("Failed to find mainnet").full_name);

    // by alias
    let network = registry.get_network_by_alias("ethereum");
    println!("Found ethereum by alias: {}", network.expect("Failed to find ethereum").full_name);
}
