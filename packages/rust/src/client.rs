use crate::error::Error;
use crate::types::*;
use crate::version::*;

impl std::str::FromStr for NetworksRegistry {
    type Err = Error;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let registry = serde_json::from_str(s)?;
        Ok(registry)
    }
}

impl NetworksRegistry {
    /// Returns the URL for the latest version of the networks registry
    pub fn get_latest_version_url() -> String {
        RegistryVersion::Latest.get_url()
    }

    /// Returns the URL for a specific version of the networks registry
    ///
    /// # Arguments
    ///
    /// * `version` - The version string to fetch (e.g., "v0.5.0")
    pub fn get_exact_version_url(version: &str) -> String {
        RegistryVersion::Exact(version).get_url()
    }

    /// Creates a new NetworksRegistry from a JSON string
    ///
    /// # Arguments
    ///
    /// * `json` - A JSON string containing the networks registry data
    ///
    /// # Errors
    ///
    /// Returns an error if the JSON is invalid or doesn't match the expected format
    pub fn from_json(json: &str) -> Result<Self, Error> {
        Ok(json.parse()?)
    }

    /// Creates a new NetworksRegistry by reading from a file
    ///
    /// # Arguments
    ///
    /// * `path` - Path to the JSON file containing the networks registry data
    ///
    /// # Errors
    ///
    /// Returns an error if the file cannot be read or contains invalid data
    pub fn from_file<P: AsRef<std::path::Path>>(path: P) -> Result<Self, Error> {
        let contents = std::fs::read_to_string(path)?;
        Self::from_json(&contents)
    }

    /// Fetches and creates a NetworksRegistry from the latest compatible version available online
    /// Library version 0.5.x will use the latest registry version 0.5.y even if 0.6.z is available
    ///
    /// # Errors
    ///
    /// Returns an error if the network request fails or the response contains invalid data
    #[cfg(feature = "fetch")]
    pub async fn from_latest_version() -> Result<Self, Error> {
        Self::from_version(RegistryVersion::Latest).await
    }

    /// Fetches and creates a NetworksRegistry from a specific version available online
    ///
    /// # Arguments
    ///
    /// * `version` - The version string to fetch (e.g., "v0.5.0")
    ///
    /// # Errors
    ///
    /// Returns an error if the network request fails or the response contains invalid data
    #[cfg(feature = "fetch")]
    pub async fn from_exact_version(version: &str) -> Result<Self, Error> {
        Self::from_version(RegistryVersion::Exact(version)).await
    }

    /// Looks up a network by its ID
    ///
    /// # Arguments
    ///
    /// * `id` - The unique identifier of the network
    ///
    /// # Returns
    ///
    /// Returns `Some(&Network)` if found, `None` otherwise
    pub fn get_network_by_id<'a>(&'a self, id: &str) -> Option<&'a Network> {
        self.networks.iter().find(|network| network.id == id)
    }

    /// Looks up a network by one of its aliases
    ///
    /// # Arguments
    ///
    /// * `alias` - An alias name for the network
    ///
    /// # Returns
    ///
    /// Returns `Some(&Network)` if found, `None` otherwise
    pub fn get_network_by_alias<'a>(&'a self, alias: &str) -> Option<&'a Network> {
        self.networks.iter().find(|network| {
            network
                .aliases
                .as_ref()
                .map_or(false, |aliases| aliases.contains(&alias.to_string()))
        })
    }

    #[cfg(feature = "fetch")]
    async fn fetch_registry(url: &str) -> Result<Self, Error> {
        let response = reqwest::get(url).await?;
        if !response.status().is_success() {
            return Err(Error::Http(response.error_for_status().unwrap_err()));
        }
        let text = response.text().await?;
        Ok(Self::from_json(&text)?)
    }

    #[cfg(feature = "fetch")]
    async fn from_version<'a>(version: RegistryVersion<'a>) -> Result<Self, Error> {
        match Self::fetch_registry(&version.get_primary_url()).await {
            Ok(registry) => Ok(registry),
            Err(primary_err) => {
                let fallback_url = version.get_fallback_url();
                Self::fetch_registry(&fallback_url).await.map_err(|_| primary_err)
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    const REGISTRY_JSON: &str = r#"{
        "$schema": "https://networks-registry.thegraph.com/TheGraphNetworksRegistrySchema_vx_x.json",
        "version": "x.x.x",
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

    #[test]
    fn test_get_network() {
        let registry = NetworksRegistry::from_json(REGISTRY_JSON).expect("Failed to parse registry");

        assert_eq!(registry.networks.len(), 1);

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
    mod fetch_tests {
        use super::*;
        use crate::version::{set_base_urls, SCHEMA_VERSION};
        use mockito::Server;

        #[tokio::test]
        async fn test_fallback_with_mock_server() {
            let registry_path = format!("/TheGraphNetworksRegistry_v{}_x.json", SCHEMA_VERSION);

            // Create two mock servers for primary and fallback URLs
            let mut primary_server = Server::new_async().await;
            let mut fallback_server = Server::new_async().await;

            // Set up the mock servers
            set_base_urls(&primary_server.url(), &fallback_server.url());

            // Test Case 1: Primary succeeds
            let primary_mock = primary_server
                .mock("GET", registry_path.as_str())
                .with_status(200)
                .with_body(REGISTRY_JSON)
                .create_async()
                .await;

            let fallback_mock = fallback_server
                .mock("GET", registry_path.as_str())
                .with_status(200)
                .expect(0)
                .with_body(REGISTRY_JSON)
                .create_async()
                .await;

            let result = NetworksRegistry::from_latest_version().await;
            assert!(result.is_ok(), "Should succeed with primary URL");
            let registry = result.unwrap();
            assert!(registry.get_network_by_id("mainnet").is_some());
            primary_mock.assert();
            fallback_mock.assert();

            // Test Case 2: Primary fails, fallback succeeds
            let primary_mock = primary_server
                .mock("GET", registry_path.as_str())
                .with_status(500)
                .create_async()
                .await;

            let fallback_mock = fallback_server
                .mock("GET", registry_path.as_str())
                .with_status(200)
                .with_body(REGISTRY_JSON)
                .create_async()
                .await;

            let result = NetworksRegistry::from_latest_version().await;
            assert!(result.is_ok(), "Should succeed using fallback URL");
            let registry = result.unwrap();
            assert!(registry.get_network_by_id("mainnet").is_some());
            primary_mock.assert();
            fallback_mock.assert();

            // Test Case 3: Both primary and fallback fail
            let primary_mock = primary_server
                .mock("GET", registry_path.as_str())
                .with_status(200)
                .with_body("bye")
                .create_async()
                .await;

            let fallback_mock = fallback_server
                .mock("GET", registry_path.as_str())
                .with_status(404)
                .create_async()
                .await;

            let result = NetworksRegistry::from_latest_version().await;
            assert!(result.is_err(), "Should fail when both URLs fail");
            primary_mock.assert();
            fallback_mock.assert();
        }

        #[tokio::test]
        async fn test_http_errors() {
            let mut primary_server = Server::new_async().await;
            let mut fallback_server = Server::new_async().await;
            let registry_path = format!("/TheGraphNetworksRegistry_v{}_x.json", SCHEMA_VERSION);

            // Setup mock servers
            set_base_urls(&primary_server.url(), &fallback_server.url());

            // Test Case 1: Invalid JSON response
            let primary_mock = primary_server
                .mock("GET", registry_path.as_str())
                .with_status(200)
                .with_body("{invalid_json")
                .create_async()
                .await;

            let result = NetworksRegistry::from_latest_version().await;
            assert!(matches!(result, Err(Error::Parse(_))));
            primary_mock.assert();

            // Test Case 2: HTTP 404 on both servers
            let primary_mock = primary_server
                .mock("GET", registry_path.as_str())
                .with_status(404)
                .create_async()
                .await;

            let fallback_mock = fallback_server
                .mock("GET", registry_path.as_str())
                .with_status(404)
                .create_async()
                .await;

            let result = NetworksRegistry::from_latest_version().await;
            assert!(matches!(result, Err(Error::Http(_))));
            primary_mock.assert();
            fallback_mock.assert();

            // Test Case 3: Empty response
            let primary_mock = primary_server
                .mock("GET", registry_path.as_str())
                .with_status(200)
                .with_body("")
                .create_async()
                .await;

            let result = NetworksRegistry::from_latest_version().await;
            assert!(matches!(result, Err(Error::Parse(_))));
            primary_mock.assert();

            // Test Case 4: Valid JSON but invalid schema
            let invalid_schema_json = r#"{
                "$schema": "https://networks-registry.thegraph.com/TheGraphNetworksRegistrySchema_vx_x.json",
                "version": "x.x.x",
                "title": "Test Registry",
                "description": "Test Registry",
                "updatedAt": "2025-01-01T00:00:00Z",
                "networks": "not_an_array"
            }"#;

            let primary_mock = primary_server
                .mock("GET", registry_path.as_str())
                .with_status(200)
                .with_body(invalid_schema_json)
                .create_async()
                .await;

            let result = NetworksRegistry::from_latest_version().await;
            assert!(matches!(result, Err(Error::Parse(_))));
            primary_mock.assert();

            // Test Case 5: Connection refused (HTTP IO error)
            set_base_urls("http://localhost:1", "invalid_url");

            let result = NetworksRegistry::from_latest_version().await;
            assert!(matches!(result, Err(Error::Http(_))));
        }

        #[test]
        fn test_io_errors() {
            // Test non-existent file
            let result = NetworksRegistry::from_file("/non/existent/path.json");
            assert!(matches!(result, Err(Error::Io(_))));

            // Test directory instead of file
            let result = NetworksRegistry::from_file("/tmp");
            assert!(matches!(result, Err(Error::Io(_))));
        }
    }
}
