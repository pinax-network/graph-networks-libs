use std::io;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error("IO error: {0}")]
    Io(#[from] io::Error),

    #[error("Parse error: {0}")]
    Parse(#[from] serde_json::Error),

    #[cfg(feature = "fetch")]
    #[error("HTTP error: {0}")]
    Http(#[from] reqwest::Error),
}
