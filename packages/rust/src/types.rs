// Example code that deserializes and serializes the model.
// extern crate serde;
// #[macro_use]
// extern crate serde_derive;
// extern crate serde_json;
//
// use generated_module::NetworksRegistry;
//
// fn main() {
//     let json = r#"{"answer": 42}"#;
//     let model: NetworksRegistry = serde_json::from_str(&json).unwrap();
// }

use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NetworksRegistry {
    /// Reference to this schema file
    #[serde(rename = "$schema")]
    pub schema: String,

    pub description: String,

    /// List of networks
    pub networks: Vec<Network>,

    pub title: String,

    /// Date and time of the last update
    pub updated_at: String,

    /// Version of the registry
    pub version: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Network {
    /// [optional] List of possible aliases for the network id, e.g. ethereum, eth, mainnet,
    /// eth-mainnet
    pub aliases: Option<Vec<String>>,

    /// List of API URLs for the network, i.e. Etherescan-like API to get ABI. Use
    /// {CUSTOM_API_KEY} as a placeholder for a private API key
    pub api_urls: Option<Vec<ApiUrl>>,

    /// CAIP-2 Chain ID, e.g. eip155:1, bip122:000000000019d6689c085ae165831e93
    pub caip2_id: String,

    /// URL to the chain documentation
    pub docs_url: Option<String>,

    /// URLs for the block explorers
    pub explorer_urls: Option<Vec<String>>,

    /// Firehose block information
    pub firehose: Option<Firehose>,

    /// Display name of the network, e.g. Ethereum Mainnet, Bitcoin Testnet
    pub full_name: String,

    /// Graph Node specific configuration information
    pub graph_node: Option<GraphNode>,

    /// Icons for the network
    pub icon: Option<Icon>,

    /// Established name of the network in The Graph ecosystem, e.g. mainnet, btc,
    /// arweave-mainnet, near-testnet
    pub id: String,

    /// Documentation to run indexer components for this network
    pub indexer_docs_urls: Option<Vec<IndexerDocsUrl>>,

    /// Issuance rewards on the Graph Network for this chain
    pub issuance_rewards: bool,

    /// Symbol of the native token
    pub native_token: Option<String>,

    /// Whether the network is a mainnet/testnet/devnet
    pub network_type: NetworkType,

    /// Relations to other networks in the registry
    pub relations: Option<Vec<Relation>>,

    /// List of RPC URLs for the chain. Use {CUSTOM_API_KEY} as a placeholder for a private API
    /// key
    pub rpc_urls: Option<Vec<String>>,

    /// Second display name of the network, e.g. Sepolia, Nova
    pub second_name: Option<String>,

    /// Services available for the network in the ecosystem
    pub services: Services,

    /// Short display name of the network, e.g. Ethereum, BNB
    pub short_name: String,

    /// Token API specific configuration information
    pub token_api: Option<TokenApi>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ApiUrl {
    /// Kind of API
    pub kind: ApiUrlKind,

    pub url: String,
}

/// Kind of API
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ApiUrlKind {
    Blockscout,

    Etherscan,

    Ethplorer,

    Other,

    Subscan,
}

/// Firehose block information
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Firehose {
    /// Block features supported by the network
    pub block_features: Option<Vec<String>>,

    /// Block type, e.g. sf.ethereum.type.v2.Block
    pub block_type: String,

    /// Protobuf definitions on buf.build, e.g. https://buf.build/streamingfast/firehose-ethereum
    pub buf_url: String,

    /// Bytes encoding, e.g. hex, 0xhex, base58
    pub bytes_encoding: BytesEncoding,

    /// [optional] Timestamp when the network was deprecated in Firehose software
    pub deprecated_at: Option<String>,

    /// [optional] Whether there is support for extended EVM block model
    pub evm_extended_model: Option<bool>,

    /// First available block information
    pub first_streamable_block: Option<FirstStreamableBlock>,
}

/// Bytes encoding, e.g. hex, 0xhex, base58
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum BytesEncoding {
    Base58,

    Base64,

    Hex,

    Other,

    #[serde(rename = "0xhex")]
    The0Xhex,
}

/// First available block information
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FirstStreamableBlock {
    /// Block height of the first streamable block. Can be different from genesis
    pub height: i64,

    /// Id of the first streamable block either in 0x-prefixed hex or base58
    pub id: String,
}

/// Graph Node specific configuration information
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GraphNode {
    /// [optional] Timestamp when the network was deprecated in Graph Node software
    pub deprecated_at: Option<String>,

    /// [optional] Protocol name in graph-node, e.g. ethereum, near, arweave
    pub protocol: Option<Protocol>,
}

/// [optional] Protocol name in graph-node, e.g. ethereum, near, arweave
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum Protocol {
    Arweave,

    Cosmos,

    Ethereum,

    Near,

    Other,

    Starknet,
}

/// Icons for the network
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Icon {
    /// Web3Icons icon - see https://github.com/0xa3k5/web3icons
    pub web3_icons: Option<Web3Icons>,
}

/// Web3Icons icon - see https://github.com/0xa3k5/web3icons
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Web3Icons {
    /// Web3Icons icon ID
    pub name: String,

    /// Variants of the icon, if none specified - all are available
    pub variants: Option<Vec<String>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IndexerDocsUrl {
    /// Docs description, e.g. Arbitrum 101
    pub description: Option<String>,

    /// URL to the documentation, e.g. https://docs.infradao.com/archive-nodes-101/arbitrum
    pub url: String,
}

/// Whether the network is a mainnet/testnet/devnet
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum NetworkType {
    Beacon,

    Devnet,

    Mainnet,

    Testnet,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Relation {
    /// Kind of relation
    pub kind: RelationKind,

    /// ID of the related network, e.g. mainnet, near-mainnet
    pub network: String,
}

/// Kind of relation
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum RelationKind {
    #[serde(rename = "beaconOf")]
    BeaconOf,

    #[serde(rename = "evmOf")]
    EvmOf,

    #[serde(rename = "forkedFrom")]
    ForkedFrom,

    #[serde(rename = "l2Of")]
    L2Of,

    Other,

    #[serde(rename = "shardOf")]
    ShardOf,

    #[serde(rename = "svmOf")]
    SvmOf,

    #[serde(rename = "testnetOf")]
    TestnetOf,
}

/// Services available for the network in the ecosystem
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Services {
    /// Firehose gRPC URLs, e.g. eth.firehose.pinax.network:443
    pub firehose: Option<Vec<String>>,

    /// Substreams-based subgraphs studio deployment URLs, e.g. https://api.thegraph.com/deploy
    pub sps: Option<Vec<String>>,

    /// Subgraph studio deployment URLs, e.g. https://api.thegraph.com/deploy
    pub subgraphs: Option<Vec<String>>,

    /// Substreams gRPC URLs, e.g. eth.substreams.pinax.network:443
    pub substreams: Option<Vec<String>>,

    /// Token API URLs, e.g. https://token-api.thegraph.com
    pub token_api: Option<Vec<String>>,
}

/// Token API specific configuration information
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TokenApi {
    /// [optional] Timestamp when the network was deprecated in Token API software
    pub deprecated_at: Option<String>,

    pub features: Option<Vec<Feature>>,

    /// Network ID in Token API, has to be an ID or alias of an existing network
    pub network_id: Option<String>,
}

/// List of Token API features supported
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum Feature {
    Dexes,

    Nfts,

    Other,

    Tokens,
}
