use graph_networks::{NetworksRegistry, RegistryVersion};

#[tokio::main]
async fn main() {
    // Fetch the latest registry
    let registry = NetworksRegistry::from_version(RegistryVersion::Latest)
        .await
        .expect("Failed to fetch registry");

    println!("Successfully loaded {} networks:", registry.networks.len());

    // Print info about each network
    for network in registry.networks {
        println!("\n{}: {}", network.id, network.full_name);
        if let Some(aliases) = network.aliases {
            println!("  Aliases: {}", aliases.join(", "));
        }
        println!("  Type: {:?}", network.network_type);
        println!("  CAIP2 ID: {:?}", network.caip2_id);
    }
}
