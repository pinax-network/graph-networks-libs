mod types;

pub use types::*;

const REGISTRY_BASE_URL: &str = "https://registry.thegraph.com";
const SCHEMA_VERSION: &str = env!("CARGO_PKG_VERSION_MAJOR_MINOR");

/// Registry URL variants for different versioning needs
#[derive(Debug, Clone, Copy)]
pub enum RegistryVersion<'a> {
    /// Latest compatible version (v{major}.{minor}.x)
    Latest,
    /// Specific version (e.g., v0.5.3)
    Exact(&'a str),
}

impl<'a> RegistryVersion<'a> {
    fn to_url(&self) -> String {
        match self {
            RegistryVersion::Latest => {
                format!("{}/TheGraphNetworksRegistry_v{}_x.json", REGISTRY_BASE_URL, SCHEMA_VERSION)
            }
            RegistryVersion::Exact(version) => {
                let is_valid = version.starts_with('v')
                    && version[1..].chars().filter(|&c| c != '.').all(|c| c.is_ascii_digit())
                    && version.matches('.').count() == 2;
                if !is_valid {
                    panic!("Version must match pattern 'v0.1.2', got: {}", version);
                }
                format!("{}/TheGraphNetworksRegistry_{}.json", REGISTRY_BASE_URL, version.replace('.', "_"))
            }
        }
    }
}

/// Helper function to get the registry URL based on version requirements
pub fn get_registry_url(version: RegistryVersion) -> String {
    version.to_url()
}

/// Helper function to get a network by its ID
pub fn get_network_by_id<'a>(registry: &'a NetworksRegistry, id: &str) -> Option<&'a NetworkElement> {
    registry.networks.iter().find(|network| network.id == id)
}

#[cfg(feature = "fetch")]
/// Fetch the registry from a specific version
///
/// This function is only available when the "fetch" feature is enabled
pub async fn fetch_registry(version: RegistryVersion<'_>) -> Result<NetworksRegistry, reqwest::Error> {
    let url = version.to_url();
    let client = reqwest::Client::new();
    client.get(url).send().await?.json().await
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_registry_urls() {
        assert_eq!(
            get_registry_url(RegistryVersion::Latest),
            format!("{}/TheGraphNetworksRegistry_v{}_x.json", REGISTRY_BASE_URL, SCHEMA_VERSION)
        );

        assert_eq!(
            get_registry_url(RegistryVersion::Exact("v0.5.3")),
            format!("{}/TheGraphNetworksRegistry_v0_5_3.json", REGISTRY_BASE_URL)
        );
    }

    #[cfg(feature = "fetch")]
    #[tokio::test]
    async fn test_fetch_registry() {
        let result = fetch_registry(RegistryVersion::Latest).await;
        assert!(result.is_ok());

        let registry = result.unwrap();
        assert!(!registry.networks.is_empty());
    }
}
