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
	Schema                             string           `json:"$schema"`
	Description                        string           `json:"description"`
	// List of networks                                 
	Networks                           []NetworkElement `json:"networks"`
	Title                              string           `json:"title"`
	// Date and time of the last update                 
	UpdatedAt                          time.Time        `json:"updatedAt"`
	// Version of the registry                          
	Version                            string           `json:"version"`
}

type NetworkElement struct {
	// [optional] List of possible aliases for the chain id, i.e. ethereum, eth, mainnet,                      
	// eth-mainnet                                                                                             
	Aliases                                                                                   []string         `json:"aliases,omitempty"`
	// List of API URLs for the chain, i.e. https://api.etherscan.io/api. Use {CUSTOM_API_KEY}                 
	// as a placeholder for a private API key                                                                  
	APIUrls                                                                                   []APIURL         `json:"apiUrls,omitempty"`
	// CAIP-2 Chain ID, i.e. eip155:1, bip122:000000000019d6689c085ae165831e93                                 
	Caip2ID                                                                                   string           `json:"caip2Id"`
	// URL to the chain documentation                                                                          
	DocsURL                                                                                   *string          `json:"docsUrl,omitempty"`
	// URLs for the block explorers                                                                            
	ExplorerUrls                                                                              []string         `json:"explorerUrls,omitempty"`
	// Firehose block information                                                                              
	Firehose                                                                                  *FirehoseClass   `json:"firehose,omitempty"`
	// Display name of the network, i.e. Ethereum Mainnet, Bitcoin Testnet                                     
	FullName                                                                                  string           `json:"fullName"`
	Genesis                                                                                   *Genesis         `json:"genesis,omitempty"`
	GraphNode                                                                                 *GraphNode       `json:"graphNode,omitempty"`
	// Icons for the chain                                                                                     
	Icon                                                                                      *Icon            `json:"icon,omitempty"`
	// Established name of the chain on the Graph network, i.e. mainnet, btc, arweave-mainnet,                 
	// near-testnet                                                                                            
	ID                                                                                        string           `json:"id"`
	// Documentation to run indexer components for the chain                                                   
	IndexerDocsUrls                                                                           []IndexerDocsURL `json:"indexerDocsUrls,omitempty"`
	// Issuance rewards on the Graph Network for this chain                                                    
	IssuanceRewards                                                                           bool             `json:"issuanceRewards"`
	// Symbol of the native token                                                                              
	NativeToken                                                                               *string          `json:"nativeToken,omitempty"`
	// Whether the chain is a mainnet/testnet/devnet                                                           
	NetworkType                                                                               NetworkType      `json:"networkType"`
	Relations                                                                                 []Relation       `json:"relations,omitempty"`
	// List of RPC URLs for the chain. Use {CUSTOM_API_KEY} as a placeholder for a private API                 
	// key                                                                                                     
	RPCUrls                                                                                   []string         `json:"rpcUrls,omitempty"`
	// Second display name of the network, i.e. Sepolia, Nova                                                  
	SecondName                                                                                *string          `json:"secondName,omitempty"`
	// Providers support for the chain by providers                                                            
	Services                                                                                  Services         `json:"services"`
	// Short display name of the network, i.e. Ethereum, BNB                                                   
	ShortName                                                                                 string           `json:"shortName"`
}

type APIURL struct {
	Kind APIURLKind `json:"kind"`
	URL  string     `json:"url"`
}

// Firehose block information
type FirehoseClass struct {
	// Block type, i.e. sf.ethereum.type.v2.Block                                                             
	BlockType                                                                                   string        `json:"blockType"`
	// Protobuf definitions on buf.build, i.e. https://buf.build/streamingfast/firehose-ethereum              
	BufURL                                                                                      string        `json:"bufUrl"`
	// Bytes encoding, i.e. hex, 0xhex, base58                                                                
	BytesEncoding                                                                               BytesEncoding `json:"bytesEncoding"`
	// [optional] Whether supports extended block model if EVM chain                                          
	EvmExtendedModel                                                                            *bool         `json:"evmExtendedModel,omitempty"`
}

type Genesis struct {
	// Hash of the genesis block either in 0x-prefixed hex or base58       
	Hash                                                            string `json:"hash"`
	// Block height of the genesis or the first available block            
	Height                                                          int64  `json:"height"`
}

type GraphNode struct {
	// [optional] Protocol name in graph-node, i.e. ethereum, near, arweave          
	Protocol                                                               *Protocol `json:"protocol,omitempty"`
}

// Icons for the chain
type Icon struct {
	// Web3Icons icon - see https://github.com/0xa3k5/web3icons           
	Web3Icons                                                  *Web3Icons `json:"web3Icons,omitempty"`
}

// Web3Icons icon - see https://github.com/0xa3k5/web3icons
type Web3Icons struct {
	Name                                                          string   `json:"name"`
	// Variants of the icon, if none specified - all are available         
	Variants                                                      []string `json:"variants,omitempty"`
}

type IndexerDocsURL struct {
	Hint *string            `json:"hint,omitempty"`
	Kind IndexerDocsURLKind `json:"kind"`
	URL  string             `json:"url"`
}

type Relation struct {
	// Kind of relation                                                  
	Kind                                                    RelationKind `json:"kind"`
	// Id of the related network, i.e. mainnet, near-mainnet             
	Network                                                 string       `json:"network"`
}

// Providers support for the chain by providers
type Services struct {
	Firehose   []FirehoseElement `json:"firehose,omitempty"`
	Sps        []FirehoseElement `json:"sps,omitempty"`
	Subgraphs  []FirehoseElement `json:"subgraphs,omitempty"`
	Substreams []FirehoseElement `json:"substreams,omitempty"`
}

type FirehoseElement struct {
	Provider Provider `json:"provider"`
	URL      *string  `json:"url,omitempty"`
}

type APIURLKind string

const (
	Blockscout  APIURLKind = "blockscout"
	Etherscan   APIURLKind = "etherscan"
	Ethplorer   APIURLKind = "ethplorer"
	PurpleOther APIURLKind = "other"
	Subscan     APIURLKind = "subscan"
)

// Bytes encoding, i.e. hex, 0xhex, base58
type BytesEncoding string

const (
	Base58   BytesEncoding = "base58"
	Hex      BytesEncoding = "hex"
	The0Xhex BytesEncoding = "0xhex"
)

// [optional] Protocol name in graph-node, i.e. ethereum, near, arweave
type Protocol string

const (
	Arweave  Protocol = "arweave"
	Cosmos   Protocol = "cosmos"
	Ethereum Protocol = "ethereum"
	Near     Protocol = "near"
	Starknet Protocol = "starknet"
)

type IndexerDocsURLKind string

const (
	Firehose    IndexerDocsURLKind = "firehose"
	FluffyOther IndexerDocsURLKind = "other"
	RPC         IndexerDocsURLKind = "rpc"
)

// Whether the chain is a mainnet/testnet/devnet
type NetworkType string

const (
	Devnet  NetworkType = "devnet"
	Mainnet NetworkType = "mainnet"
	Testnet NetworkType = "testnet"
)

// Kind of relation
type RelationKind string

const (
	BeaconOf       RelationKind = "beaconOf"
	EvmOf          RelationKind = "evmOf"
	ForkedFrom     RelationKind = "forkedFrom"
	L2Of           RelationKind = "l2Of"
	ShardOf        RelationKind = "shardOf"
	TentacledOther RelationKind = "other"
	TestnetOf      RelationKind = "testnetOf"
)

type Provider string

const (
	EN            Provider = "e&n"
	Graphops      Provider = "graphops"
	Messari       Provider = "messari"
	Pinax         Provider = "pinax"
	Semiotic      Provider = "semiotic"
	Streamingfast Provider = "streamingfast"
)
