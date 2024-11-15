use graph_networks::NetworksRegistry;

fn main() {
    let registry: NetworksRegistry = NetworksRegistry::from_file("TheGraphNetworksRegistry.json")
        .expect("Failed to parse registry");

    println!("Successfully loaded {} networks", registry.networks.len());

}