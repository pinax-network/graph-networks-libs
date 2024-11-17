use graph_networks_registry::NetworksRegistry;

fn main() {
    let registry: NetworksRegistry =
        NetworksRegistry::from_file("../../../../registry/TheGraphNetworksRegistry.json").expect("Failed to load registry");

    println!("Successfully loaded {} networks", registry.networks.len());

    let network = registry.get_network_by_id("mainnet");
    println!("Found mainnet by id: {}", network.expect("Failed to find mainnet").full_name);

    // by alias
    let network = registry.get_network_by_alias("ethereum");
    println!("Found ethereum by alias: {}", network.expect("Failed to find ethereum").full_name);
}
