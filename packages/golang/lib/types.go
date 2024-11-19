// This file was generated from JSON Schema using quicktype, do not modify it directly.
// To parse and unparse this JSON data, add this code to your project and do:
//
//    networksRegistry, err := UnmarshalNetworksRegistry(bytes)
//    bytes, err = networksRegistry.Marshal()

package registry

import "time"

import "encoding/json"

func UnmarshalNetworksRegistry(data []byte) (NetworksRegistry, error) {
	var r NetworksRegistry
	err := json.Unmarshal(data, &r)
	return r, err
}

func (r *NetworksRegistry) Marshal() ([]byte, error) {
	return json.Marshal(r)
}

type NetworksRegistry struct {
	// Reference to this schema file             
	Schema                             string    `json:"$schema"`
	Description                        string    `json:"description"`
	// List of networks                          
	Networks                           []Network `json:"networks"`
	Title                              string    `json:"title"`
	// Date and time of the last update          
	UpdatedAt                          time.Time `json:"updatedAt"`
	// Version of the registry                   
	Version                            string    `json:"version"`
}

type Network struct {
	// [optional] List of possible aliases for the network id, e.g. ethereum, eth, mainnet,                    
	// eth-mainnet                                                                                             
	Aliases                                                                                   []string         `json:"aliases,omitempty"`
	// List of API URLs for the network, i.e. Etherescan-like API to get ABI. Use                              
	// {CUSTOM_API_KEY} as a placeholder for a private API key                                                 
	APIUrls                                                                                   []APIURL         `json:"apiUrls,omitempty"`
	// CAIP-2 Chain ID, e.g. eip155:1, bip122:000000000019d6689c085ae165831e93                                 
	Caip2ID                                                                                   string           `json:"caip2Id"`
	// URL to the chain documentation                                                                          
	DocsURL                                                                                   *string          `json:"docsUrl,omitempty"`
	// URLs for the block explorers                                                                            
	ExplorerUrls                                                                              []string         `json:"explorerUrls,omitempty"`
	// Firehose block information                                                                              
	Firehose                                                                                  *Firehose        `json:"firehose,omitempty"`
	// Display name of the network, e.g. Ethereum Mainnet, Bitcoin Testnet                                     
	FullName                                                                                  string           `json:"fullName"`
	// Genesis block information                                                                               
	Genesis                                                                                   *Genesis         `json:"genesis,omitempty"`
	// Graph Node specific configuration information                                                           
	GraphNode                                                                                 *GraphNode       `json:"graphNode,omitempty"`
	// Icons for the network                                                                                   
	Icon                                                                                      *Icon            `json:"icon,omitempty"`
	// Established name of the network in The Graph ecosystem, e.g. mainnet, btc,                              
	// arweave-mainnet, near-testnet                                                                           
	ID                                                                                        string           `json:"id"`
	// Documentation to run indexer components for this network                                                
	IndexerDocsUrls                                                                           []IndexerDocsURL `json:"indexerDocsUrls,omitempty"`
	// Issuance rewards on the Graph Network for this chain                                                    
	IssuanceRewards                                                                           bool             `json:"issuanceRewards"`
	// Symbol of the native token                                                                              
	NativeToken                                                                               *string          `json:"nativeToken,omitempty"`
	// Whether the network is a mainnet/testnet/devnet                                                         
	NetworkType                                                                               NetworkType      `json:"networkType"`
	// Relations to other networks in the registry                                                             
	Relations                                                                                 []Relation       `json:"relations,omitempty"`
	// List of RPC URLs for the chain. Use {CUSTOM_API_KEY} as a placeholder for a private API                 
	// key                                                                                                     
	RPCUrls                                                                                   []string         `json:"rpcUrls,omitempty"`
	// Second display name of the network, e.g. Sepolia, Nova                                                  
	SecondName                                                                                *string          `json:"secondName,omitempty"`
	// Services available for the network in the ecosystem                                                     
	Services                                                                                  Services         `json:"services"`
	// Short display name of the network, e.g. Ethereum, BNB                                                   
	ShortName                                                                                 string           `json:"shortName"`
}

type APIURL struct {
	// Kind of API           
	Kind          APIURLKind `json:"kind"`
	URL           string     `json:"url"`
}

// Firehose block information
type Firehose struct {
	// Block type, e.g. sf.ethereum.type.v2.Block                                                             
	BlockType                                                                                   string        `json:"blockType"`
	// Protobuf definitions on buf.build, e.g. https://buf.build/streamingfast/firehose-ethereum              
	BufURL                                                                                      string        `json:"bufUrl"`
	// Bytes encoding, e.g. hex, 0xhex, base58                                                                
	BytesEncoding                                                                               BytesEncoding `json:"bytesEncoding"`
	// [optional] Whether there is support for extended EVM block model                                       
	EvmExtendedModel                                                                            *bool         `json:"evmExtendedModel,omitempty"`
}

// Genesis block information
type Genesis struct {
	// Hash of the genesis block either in 0x-prefixed hex or base58       
	Hash                                                            string `json:"hash"`
	// Block height of the genesis or the first available block            
	Height                                                          int64  `json:"height"`
}

// Graph Node specific configuration information
type GraphNode struct {
	// [optional] Protocol name in graph-node, e.g. ethereum, near, arweave          
	Protocol                                                               *Protocol `json:"protocol,omitempty"`
}

// Icons for the network
type Icon struct {
	// Web3Icons icon - see https://github.com/0xa3k5/web3icons           
	Web3Icons                                                  *Web3Icons `json:"web3Icons,omitempty"`
}

// Web3Icons icon - see https://github.com/0xa3k5/web3icons
type Web3Icons struct {
	// Web3Icons icon ID                                                   
	Name                                                          string   `json:"name"`
	// Variants of the icon, if none specified - all are available         
	Variants                                                      []string `json:"variants,omitempty"`
}

type IndexerDocsURL struct {
	// Docs description, e.g. Arbitrum 101                                                        
	Description                                                                           *string `json:"description,omitempty"`
	// URL to the documentation, e.g. https://docs.infradao.com/archive-nodes-101/arbitrum        
	URL                                                                                   string  `json:"url"`
}

type Relation struct {
	// Kind of relation                                                  
	Kind                                                    RelationKind `json:"kind"`
	// ID of the related network, e.g. mainnet, near-mainnet             
	Network                                                 string       `json:"network"`
}

// Services available for the network in the ecosystem
type Services struct {
	// Firehose gRPC URLs, e.g. eth.firehose.pinax.network:443                                         
	Firehose                                                                                  []string `json:"firehose,omitempty"`
	// Substreams-based subgraphs studio deployment URLs, e.g. https://api.thegraph.com/deploy         
	Sps                                                                                       []string `json:"sps,omitempty"`
	// Subgraph studio deployment URLs, e.g. https://api.thegraph.com/deploy                           
	Subgraphs                                                                                 []string `json:"subgraphs,omitempty"`
	// Substreams gRPC URLs, e.g. eth.substreams.pinax.network:443                                     
	Substreams                                                                                []string `json:"substreams,omitempty"`
}

// Kind of API
type APIURLKind string

const (
	Blockscout  APIURLKind = "blockscout"
	Etherscan   APIURLKind = "etherscan"
	Ethplorer   APIURLKind = "ethplorer"
	PurpleOther APIURLKind = "other"
	Subscan     APIURLKind = "subscan"
)

// Bytes encoding, e.g. hex, 0xhex, base58
type BytesEncoding string

const (
	Base58             BytesEncoding = "base58"
	Base64             BytesEncoding = "base64"
	BytesEncodingOther BytesEncoding = "other"
	Hex                BytesEncoding = "hex"
	The0Xhex           BytesEncoding = "0xhex"
)

// [optional] Protocol name in graph-node, e.g. ethereum, near, arweave
type Protocol string

const (
	Arweave       Protocol = "arweave"
	Cosmos        Protocol = "cosmos"
	Ethereum      Protocol = "ethereum"
	Near          Protocol = "near"
	ProtocolOther Protocol = "other"
	Starknet      Protocol = "starknet"
)

// Whether the network is a mainnet/testnet/devnet
type NetworkType string

const (
	Devnet  NetworkType = "devnet"
	Mainnet NetworkType = "mainnet"
	Testnet NetworkType = "testnet"
)

// Kind of relation
type RelationKind string

const (
	BeaconOf    RelationKind = "beaconOf"
	EvmOf       RelationKind = "evmOf"
	FluffyOther RelationKind = "other"
	ForkedFrom  RelationKind = "forkedFrom"
	L2Of        RelationKind = "l2Of"
	ShardOf     RelationKind = "shardOf"
	TestnetOf   RelationKind = "testnetOf"
)
