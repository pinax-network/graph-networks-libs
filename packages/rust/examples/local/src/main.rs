use graph_networks_registry::NetworksRegistry;

fn main() {
    let registry: NetworksRegistry =
        NetworksRegistry::from_file("../../../../registry/TheGraphNetworksRegistry.json").expect("Failed to load registry");

    println!("Successfully loaded {} networks", registry.networks.len());
}
