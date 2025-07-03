use graph_networks_registry::NetworksRegistry;

fn main() {
    let registry: NetworksRegistry =
        NetworksRegistry::from_file("../../../../sample/TheGraphNetworksRegistry.json").expect("Failed to load registry");

    println!("Successfully loaded {} networks", registry.networks.len());

    // Using new get_network_by_graph_id method which handles both id and alias lookups
    let network = registry.get_network_by_graph_id("mainnet");
    println!(
        "Querying registry for \"mainnet\" graph id: {}",
        network.expect("Failed to find mainnet").full_name
    );

    // Using get_network_by_graph_id with an alias
    let network = registry.get_network_by_graph_id("ethereum");
    println!(
        "Querying registry for \"ethereum\" graph id: {}",
        network.expect("Failed to find ethereum").full_name
    );
}
