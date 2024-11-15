
const REGISTRY_BASE_URL: &str = "https://registry.thegraph.com";
const SCHEMA_VERSION: &str = env!("CARGO_PKG_VERSION_MAJOR_MINOR");

#[derive(Debug, Clone, Copy)]
pub enum RegistryVersion<'a> {
    /// Latest compatible version (v{major}.{minor}.x)
    Latest,
    /// Specific version (e.g., v0.5.3)
    Exact(&'a str),
}

impl<'a> RegistryVersion<'a> {
    pub fn to_url(&self) -> String {
        match self {
            RegistryVersion::Latest => {
                format!("{}/TheGraphNetworksRegistry_v{}_x.json", REGISTRY_BASE_URL, SCHEMA_VERSION)
            }
            RegistryVersion::Exact(version) => {
                format!("{}/TheGraphNetworksRegistry_{}.json", REGISTRY_BASE_URL, version.replace('.', "_"))
            }
        }
    }
}

/// Helper function to get the registry URL based on version requirements
pub fn get_registry_url(version: RegistryVersion) -> String {
    version.to_url()
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
}
