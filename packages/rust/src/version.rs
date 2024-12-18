use std::cell::RefCell;
use std::thread_local;

thread_local! {
    static REGISTRY_BASE_URL: RefCell<String> = RefCell::new("https://networks-registry.thegraph.com".to_string());
    static FALLBACK_BASE_URL: RefCell<String> = RefCell::new("https://raw.githubusercontent.com/graphprotocol/networks-registry/refs/heads/main/public".to_string());
}

fn get_registry_base_url() -> String {
    REGISTRY_BASE_URL.with(|url| url.borrow().clone())
}

fn get_fallback_base_url() -> String {
    FALLBACK_BASE_URL.with(|url| url.borrow().clone())
}

#[cfg(test)]
pub fn set_base_urls(base_url: &str, fallback_url: &str) {
    REGISTRY_BASE_URL.with(|cell| cell.replace(base_url.to_string()));
    FALLBACK_BASE_URL.with(|cell| cell.replace(fallback_url.to_string()));
}

pub(crate) const SCHEMA_VERSION: &str = env!("CARGO_PKG_VERSION_MAJOR_MINOR");

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
                format!("{}/TheGraphNetworksRegistry_v{}_x.json", get_registry_base_url(), SCHEMA_VERSION)
            }
            RegistryVersion::Exact(version) => {
                format!(
                    "{}/TheGraphNetworksRegistry_{}.json",
                    get_registry_base_url(),
                    version.replace('.', "_")
                )
            }
        }
    }

    pub fn get_fallback_url(&self) -> String {
        match self {
            RegistryVersion::Latest => {
                format!("{}/TheGraphNetworksRegistry_v{}_x.json", get_fallback_base_url(), SCHEMA_VERSION)
            }
            RegistryVersion::Exact(version) => {
                format!(
                    "{}/TheGraphNetworksRegistry_{}.json",
                    get_fallback_base_url(),
                    version.replace('.', "_")
                )
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
            format!("{}/TheGraphNetworksRegistry_v{}_x.json", get_registry_base_url(), SCHEMA_VERSION)
        );

        // Test fallback URL
        assert_eq!(
            RegistryVersion::Latest.get_fallback_url(),
            format!("{}/TheGraphNetworksRegistry_v{}_x.json", get_fallback_base_url(), SCHEMA_VERSION)
        );

        // Test exact version URLs
        let version = "v0.5.0";
        assert_eq!(
            RegistryVersion::Exact(version).get_primary_url(),
            format!("{}/TheGraphNetworksRegistry_v0_5_0.json", get_registry_base_url())
        );
        assert_eq!(
            RegistryVersion::Exact(version).get_fallback_url(),
            format!("{}/TheGraphNetworksRegistry_v0_5_0.json", get_fallback_base_url())
        );
    }
}
