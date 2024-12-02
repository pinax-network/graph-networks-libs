const REGISTRY_BASE_URL: &str = "https://registry.thegraph.com";
const FALLBACK_BASE_URL: &str = "https://raw.githubusercontent.com/graphprotocol/networks-registry/refs/heads/main/public";
const SCHEMA_VERSION: &str = env!("CARGO_PKG_VERSION_MAJOR_MINOR");

#[derive(Debug, Clone, Copy)]
pub enum RegistryVersion<'a> {
    /// Latest compatible version (v{major}.{minor}.x)
    Latest,
    /// Specific version (e.g., v0.5.3)
    Exact(&'a str),
}

impl<'a> RegistryVersion<'a> {
    pub fn get_url(&self) -> String {
        self.get_primary_url()
    }

    pub fn get_primary_url(&self) -> String {
        match self {
            RegistryVersion::Latest => {
                format!("{}/TheGraphNetworksRegistry_v{}_x.json", REGISTRY_BASE_URL, SCHEMA_VERSION)
            }
            RegistryVersion::Exact(version) => {
                format!("{}/TheGraphNetworksRegistry_{}.json", REGISTRY_BASE_URL, version.replace('.', "_"))
            }
        }
    }

    pub fn get_fallback_url(&self) -> String {
        match self {
            RegistryVersion::Latest => {
                format!("{}/TheGraphNetworksRegistry_v{}_x.json", FALLBACK_BASE_URL, SCHEMA_VERSION)
            }
            RegistryVersion::Exact(version) => {
                format!("{}/TheGraphNetworksRegistry_{}.json", FALLBACK_BASE_URL, version.replace('.', "_"))
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_registry_urls() {
        // Test primary URL
        assert_eq!(
            RegistryVersion::Latest.get_primary_url(),
            format!("{}/TheGraphNetworksRegistry_v{}_x.json", REGISTRY_BASE_URL, SCHEMA_VERSION)
        );

        // Test fallback URL
        assert_eq!(
            RegistryVersion::Latest.get_fallback_url(),
            format!("{}/TheGraphNetworksRegistry_v{}_x.json", FALLBACK_BASE_URL, SCHEMA_VERSION)
        );

        // Test exact version URLs
        let version = "v0.5.0";
        assert_eq!(
            RegistryVersion::Exact(version).get_primary_url(),
            format!("{}/TheGraphNetworksRegistry_v0_5_0.json", REGISTRY_BASE_URL)
        );
        assert_eq!(
            RegistryVersion::Exact(version).get_fallback_url(),
            format!("{}/TheGraphNetworksRegistry_v0_5_0.json", FALLBACK_BASE_URL)
        );
    }
}
