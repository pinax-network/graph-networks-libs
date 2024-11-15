use graph_networks::{NetworksRegistry, RegistryVersion};

#[tokio::main]
async fn main() {
    // Fetch the latest registry
    let registry = NetworksRegistry::from_version(RegistryVersion::Latest)
        .await
        .expect("Failed to fetch registry");

    println!("Successfully loaded {} networks", registry.networks.len());

}
