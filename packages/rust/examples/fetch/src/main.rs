use graph_networks::NetworksRegistry;

#[tokio::main]
async fn main() {
    println!(
        "Fetching registry from {}",
        NetworksRegistry::get_latest_version_url()
    );

    let registry = NetworksRegistry::from_latest_version()
        .await
        .expect("Failed to fetch registry");

    println!("Successfully loaded {} networks", registry.networks.len());
}
