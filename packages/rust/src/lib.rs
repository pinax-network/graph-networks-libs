mod types;
mod version;
mod error;

pub use error::Error;
pub use types::*;
pub use version::*;

impl std::str::FromStr for NetworksRegistry {
    type Err = Error;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let registry = serde_json::from_str(s)?;
        Ok(registry)
    }
}

impl NetworksRegistry {

    pub fn from_file<P: AsRef<std::path::Path>>(path: P) -> Result<Self, Error> {
        let contents = std::fs::read_to_string(path)?;
        let registry = contents.parse()?;
        Ok(registry)
    }

    #[cfg(feature = "fetch")]
    pub async fn from_version(version: RegistryVersion<'_>) -> Result<Self, Error> {
        let url = get_registry_url(version);
        let response = reqwest::get(&url).await?;
        let registry = response.json().await?;
        Ok(registry)
    }

    pub fn get_network_by_id<'a>(&'a self, id: &str) -> Option<&'a NetworkElement> {
        self.networks.iter().find(|network| network.id == id)
    }

    pub fn get_network_by_alias<'a>(&'a self, alias: &str) -> Option<&'a NetworkElement> {
        self.networks
            .iter()
            .find(|network| network
                .aliases
                .as_ref()
                .map_or(false, |aliases| aliases.contains(&alias.to_string()))
            )
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_get_network() {
        let registry_json = r#"{
            "$schema": "https://registry.thegraph.com/TheGraphNetworksRegistrySchema_v0_5.json",
            "version": "0.5.0",
            "title": "Test Registry",
            "description": "Test Registry",
            "updatedAt": "2025-01-01T00:00:00Z",
            "networks": [
                {
                    "id": "mainnet",
                    "fullName": "Ethereum Mainnet",
                    "shortName": "Ethereum",
                    "caip2Id": "eip155:1",
                    "networkType": "mainnet",
                    "aliases": ["ethereum", "eth"],
                    "issuanceRewards": true,
                    "services": {}
                }
            ]
        }"#;

        let registry: NetworksRegistry = serde_json::from_str(registry_json).unwrap();

        let network = registry.get_network_by_alias("eth");
        assert!(network.is_some());
        assert_eq!(network.unwrap().id, "mainnet");

        let network = registry.get_network_by_alias("ethereum");
        assert!(network.is_some());
        assert_eq!(network.unwrap().id, "mainnet");

        let network = registry.get_network_by_alias("nonexistent");
        assert!(network.is_none());

        let network = registry.get_network_by_id("mainnet");
        assert!(network.is_some());
        assert_eq!(network.unwrap().id, "mainnet");
    }

    #[cfg(feature = "fetch")]
    #[tokio::test]
    async fn test_fetch_registry() {
        let result = NetworksRegistry::from_version(RegistryVersion::Latest).await;
        assert!(result.is_ok());

        let registry = result.unwrap();
        assert!(!registry.networks.is_empty());
    }

    #[cfg(feature = "fetch")]
    #[tokio::test]
    async fn test_fetch_registry_exact_version() {
        let result = NetworksRegistry::from_version(RegistryVersion::Exact("v0.5.0")).await;
        assert!(result.is_ok());

        let registry = result.unwrap();
        assert!(!registry.networks.is_empty());
    }
}
