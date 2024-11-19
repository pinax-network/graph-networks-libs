//! Networks Registry for managing blockchain network configurations
//!
//! # Main Types
//!
//! - [`NetworksRegistry`] - The main struct for managing network configurations
//!
//! # Example
//!
//! ```
//! use graph_networks_registry::NetworksRegistry;
//!
//! # async fn example() -> Result<(), Box<dyn std::error::Error>> {
//! // Load the latest registry from online source
//! let registry = NetworksRegistry::from_latest_version().await?;
//!
//! // Look up a network by ID
//! let mainnet = registry.get_network_by_id("mainnet");
//! # Ok(())
//! # }
//! ```
//!
//! # Additional Types
//!
//! - [`Network`] - Individual network configuration

mod client;
mod error;
mod types;
mod version;

pub use error::Error;
pub use types::*;
