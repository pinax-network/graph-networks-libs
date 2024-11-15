use crate::{NetworksRegistry, RegistryVersion};
use std::error::Error;
use std::fmt;

#[derive(Debug)]
pub enum FetchError {
    Request(reqwest::Error),
    InvalidStatusCode(u16),
    InvalidVersionFormat(String),
}

impl fmt::Display for FetchError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            FetchError::Request(e) => write!(f, "Request failed: {}", e),
            FetchError::InvalidStatusCode(code) => write!(f, "Invalid status code: {}", code),
            FetchError::InvalidVersionFormat(v) => write!(f, "Invalid version format: {}", v),
        }
    }
}

impl Error for FetchError {
    fn source(&self) -> Option<&(dyn Error + 'static)> {
        match self {
            FetchError::Request(e) => Some(e),
            FetchError::InvalidStatusCode(_) => None,
            FetchError::InvalidVersionFormat(_) => None,
        }
    }
}

impl From<reqwest::Error> for FetchError {
    fn from(err: reqwest::Error) -> Self {
        FetchError::Request(err)
    }
}

fn validate_version(version: &str) -> Result<(), FetchError> {
    let parts: Vec<&str> = version.split('.').collect();
    if !(2..=3).contains(&parts.len()) ||
       !parts.iter().all(|p| !p.is_empty() && p.parse::<u32>().is_ok()) {
        return Err(FetchError::InvalidVersionFormat(
            "Version must be in format major.minor[.patch] with valid numbers".to_string()
        ));
    }
    Ok(())
}

/// Fetch the registry from a specific version
pub async fn fetch_registry(version: RegistryVersion<'_>) -> Result<NetworksRegistry, FetchError> {
    if let RegistryVersion::Exact(v) = version {
        validate_version(v)?;
    }

    let url = version.to_url();
    let client = reqwest::Client::new();
    let response = client.get(url).send().await?;

    if !response.status().is_success() {
        return Err(FetchError::InvalidStatusCode(response.status().as_u16()));
    }

    Ok(response.json().await?)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_fetch_registry() {
        let result = fetch_registry(RegistryVersion::Exact("0.5.0")).await;
        match &result {
            Ok(registry) => {
                assert!(!registry.networks.is_empty());
            }
            Err(e) => {
                println!("Failed to fetch registry: {}", e);
                if let FetchError::Request(req_err) = e {
                    println!("Request error details: {}", req_err);
                }
                panic!("Failed to fetch registry");
            }
        }
    }

    #[tokio::test]
    async fn test_fetch_invalid_version() {
        let result = fetch_registry(RegistryVersion::Exact("999.999.999")).await;
        assert!(matches!(result, Err(FetchError::InvalidStatusCode(404))));
    }

    #[test]
    fn test_validate_version() {
        // Valid versions
        assert!(validate_version("0.5.0").is_ok());
        assert!(validate_version("0.5").is_ok());
        assert!(validate_version("10.5.2").is_ok());

        // Invalid versions
        assert!(matches!(
            validate_version("0.5.0.1"),
            Err(FetchError::InvalidVersionFormat(_))
        ));
        assert!(matches!(
            validate_version("0.5-alpha"),
            Err(FetchError::InvalidVersionFormat(_))
        ));
        assert!(matches!(
            validate_version("v0.5.0"),
            Err(FetchError::InvalidVersionFormat(_))
        ));
        assert!(matches!(
            validate_version("0.5."),
            Err(FetchError::InvalidVersionFormat(_))
        ));
        assert!(matches!(
            validate_version(".5.0"),
            Err(FetchError::InvalidVersionFormat(_))
        ));
    }

    #[tokio::test]
    async fn test_fetch_malformed_version() {
        let result = fetch_registry(RegistryVersion::Exact("v0.5.0")).await;
        assert!(matches!(result, Err(FetchError::InvalidVersionFormat(_))));
    }
}
