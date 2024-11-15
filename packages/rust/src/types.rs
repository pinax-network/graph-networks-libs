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

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NetworksRegistry {
    /// Reference to this schema file
    #[serde(rename = "$schema")]
    pub schema: String,

    pub description: String,

    /// List of networks
    pub networks: Vec<NetworkElement>,

    pub title: String,

    /// Date and time of the last update
    pub updated_at: String,

    /// Version of the registry
    pub version: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NetworkElement {
    /// [optional] List of possible aliases for the chain id, i.e. ethereum, eth, mainnet,
    /// eth-mainnet
    pub aliases: Option<Vec<String>>,

    /// List of API URLs for the chain, i.e. https://api.etherscan.io/api. Use {CUSTOM_API_KEY}
    /// as a placeholder for a private API key
    pub api_urls: Option<Vec<ApiUrl>>,

    /// CAIP-2 Chain ID, i.e. eip155:1, bip122:000000000019d6689c085ae165831e93
    pub caip2_id: String,

    /// URL to the chain documentation
    pub docs_url: Option<String>,

    /// URLs for the block explorers
    pub explorer_urls: Option<Vec<String>>,

    /// Firehose block information
    pub firehose: Option<Firehose>,

    /// Display name of the network, i.e. Ethereum Mainnet, Bitcoin Testnet
    pub full_name: String,

    pub genesis: Option<Genesis>,

    pub graph_node: Option<GraphNode>,

    /// Icons for the chain
    pub icon: Option<Icon>,

    /// Established name of the chain on the Graph network, i.e. mainnet, btc, arweave-mainnet,
    /// near-testnet
    pub id: String,

    /// Documentation to run indexer components for the chain
    pub indexer_docs_urls: Option<Vec<IndexerDocsUrl>>,

    /// Issuance rewards on the Graph Network for this chain
    pub issuance_rewards: bool,

    /// Symbol of the native token
    pub native_token: Option<String>,

    /// Whether the chain is a mainnet/testnet/devnet
    pub network_type: NetworkType,

    pub relations: Option<Vec<Relation>>,

    /// List of RPC URLs for the chain. Use {CUSTOM_API_KEY} as a placeholder for a private API
    /// key
    pub rpc_urls: Option<Vec<String>>,

    /// Second display name of the network, i.e. Sepolia, Nova
    pub second_name: Option<String>,

    /// Providers support for the chain by providers
    pub services: Services,

    /// Short display name of the network, i.e. Ethereum, BNB
    pub short_name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ApiUrl {
    pub kind: ApiUrlKind,

    pub url: String,
}

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
    /// Block type, i.e. sf.ethereum.type.v2.Block
    pub block_type: String,

    /// Protobuf definitions on buf.build, i.e. https://buf.build/streamingfast/firehose-ethereum
    pub buf_url: String,

    /// Bytes encoding, i.e. hex, 0xhex, base58
    pub bytes_encoding: BytesEncoding,

    /// [optional] Whether supports extended block model if EVM chain
    pub evm_extended_model: Option<bool>,
}

/// Bytes encoding, i.e. hex, 0xhex, base58
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum BytesEncoding {
    Base58,

    Hex,

    #[serde(rename = "0xhex")]
    The0Xhex,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Genesis {
    /// Hash of the genesis block either in 0x-prefixed hex or base58
    pub hash: String,

    /// Block height of the genesis or the first available block
    pub height: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GraphNode {
    /// [optional] Protocol name in graph-node, i.e. ethereum, near, arweave
    pub protocol: Option<Protocol>,
}

/// [optional] Protocol name in graph-node, i.e. ethereum, near, arweave
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum Protocol {
    Arweave,

    Cosmos,

    Ethereum,

    Near,

    Starknet,
}

/// Icons for the chain
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Icon {
    /// Web3Icons icon - see https://github.com/0xa3k5/web3icons
    pub web3_icons: Option<Web3Icons>,
}

/// Web3Icons icon - see https://github.com/0xa3k5/web3icons
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Web3Icons {
    pub name: String,

    /// Variants of the icon, if none specified - all are available
    pub variants: Option<Vec<String>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IndexerDocsUrl {
    pub hint: Option<String>,

    pub kind: IndexerDocsUrlKind,

    pub url: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum IndexerDocsUrlKind {
    Firehose,

    Other,

    Rpc,
}

/// Whether the chain is a mainnet/testnet/devnet
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum NetworkType {
    Devnet,

    Mainnet,

    Testnet,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Relation {
    /// Kind of relation
    pub kind: RelationKind,

    /// Id of the related network, i.e. mainnet, near-mainnet
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

    #[serde(rename = "testnetOf")]
    TestnetOf,
}

/// Providers support for the chain by providers
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Services {
    pub firehose: Option<Vec<FirehoseElement>>,

    pub sps: Option<Vec<FirehoseElement>>,

    pub subgraphs: Option<Vec<FirehoseElement>>,

    pub substreams: Option<Vec<FirehoseElement>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FirehoseElement {
    pub provider: Provider,

    pub url: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum Provider {
    #[serde(rename = "e&n")]
    EN,

    Graphops,

    Messari,

    Pinax,

    Semiotic,

    Streamingfast,
}
