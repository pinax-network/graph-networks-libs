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
    pub fn get_url(&self) -> String {
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_registry_urls() {
        assert_eq!(
            RegistryVersion::Latest.get_url(),
            format!("{}/TheGraphNetworksRegistry_v{}_x.json", REGISTRY_BASE_URL, SCHEMA_VERSION)
        );
    }
}
