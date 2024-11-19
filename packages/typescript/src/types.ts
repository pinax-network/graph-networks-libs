// To parse this data:
//
//   import { Convert, NetworksRegistryElement } from "./file";
//
//   const networksRegistryElement = Convert.toNetworksRegistryElement(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface NetworksRegistryElement {
    /**
     * Reference to this schema file
     */
    $schema:     string;
    description: string;
    /**
     * List of networks
     */
    networks: Network[];
    title:    string;
    /**
     * Date and time of the last update
     */
    updatedAt: Date;
    /**
     * Version of the registry
     */
    version: string;
}

export interface Network {
    /**
     * [optional] List of possible aliases for the network id, e.g. ethereum, eth, mainnet,
     * eth-mainnet
     */
    aliases?: string[];
    /**
     * List of API URLs for the network, i.e. Etherescan-like API to get ABI. Use
     * {CUSTOM_API_KEY} as a placeholder for a private API key
     */
    apiUrls?: APIURL[];
    /**
     * CAIP-2 Chain ID, e.g. eip155:1, bip122:000000000019d6689c085ae165831e93
     */
    caip2Id: string;
    /**
     * URL to the chain documentation
     */
    docsUrl?: string;
    /**
     * URLs for the block explorers
     */
    explorerUrls?: string[];
    /**
     * Firehose block information
     */
    firehose?: Firehose;
    /**
     * Display name of the network, e.g. Ethereum Mainnet, Bitcoin Testnet
     */
    fullName: string;
    /**
     * Genesis block information
     */
    genesis?: Genesis;
    /**
     * Graph Node specific configuration information
     */
    graphNode?: GraphNode;
    /**
     * Icons for the network
     */
    icon?: Icon;
    /**
     * Established name of the network in The Graph ecosystem, e.g. mainnet, btc,
     * arweave-mainnet, near-testnet
     */
    id: string;
    /**
     * Documentation to run indexer components for this network
     */
    indexerDocsUrls?: IndexerDocsURL[];
    /**
     * Issuance rewards on the Graph Network for this chain
     */
    issuanceRewards: boolean;
    /**
     * Symbol of the native token
     */
    nativeToken?: string;
    /**
     * Whether the network is a mainnet/testnet/devnet
     */
    networkType: NetworkType;
    /**
     * Relations to other networks in the registry
     */
    relations?: Relation[];
    /**
     * List of RPC URLs for the chain. Use {CUSTOM_API_KEY} as a placeholder for a private API
     * key
     */
    rpcUrls?: string[];
    /**
     * Second display name of the network, e.g. Sepolia, Nova
     */
    secondName?: string;
    /**
     * Services available for the network in the ecosystem
     */
    services: Services;
    /**
     * Short display name of the network, e.g. Ethereum, BNB
     */
    shortName: string;
}

export interface APIURL {
    /**
     * Kind of API
     */
    kind: APIURLKind;
    url:  string;
}

/**
 * Kind of API
 */
export enum APIURLKind {
    Blockscout = "blockscout",
    Etherscan = "etherscan",
    Ethplorer = "ethplorer",
    Other = "other",
    Subscan = "subscan",
}

/**
 * Firehose block information
 */
export interface Firehose {
    /**
     * Block type, e.g. sf.ethereum.type.v2.Block
     */
    blockType: string;
    /**
     * Protobuf definitions on buf.build, e.g. https://buf.build/streamingfast/firehose-ethereum
     */
    bufUrl: string;
    /**
     * Bytes encoding, e.g. hex, 0xhex, base58
     */
    bytesEncoding: BytesEncoding;
    /**
     * [optional] Whether there is support for extended EVM block model
     */
    evmExtendedModel?: boolean;
}

/**
 * Bytes encoding, e.g. hex, 0xhex, base58
 */
export enum BytesEncoding {
    Base58 = "base58",
    Base64 = "base64",
    Hex = "hex",
    Other = "other",
    The0Xhex = "0xhex",
}

/**
 * Genesis block information
 */
export interface Genesis {
    /**
     * Hash of the genesis block either in 0x-prefixed hex or base58
     */
    hash: string;
    /**
     * Block height of the genesis or the first available block
     */
    height: number;
}

/**
 * Graph Node specific configuration information
 */
export interface GraphNode {
    /**
     * [optional] Protocol name in graph-node, e.g. ethereum, near, arweave
     */
    protocol?: Protocol;
}

/**
 * [optional] Protocol name in graph-node, e.g. ethereum, near, arweave
 */
export enum Protocol {
    Arweave = "arweave",
    Cosmos = "cosmos",
    Ethereum = "ethereum",
    Near = "near",
    Other = "other",
    Starknet = "starknet",
}

/**
 * Icons for the network
 */
export interface Icon {
    /**
     * Web3Icons icon - see https://github.com/0xa3k5/web3icons
     */
    web3Icons?: Web3Icons;
}

/**
 * Web3Icons icon - see https://github.com/0xa3k5/web3icons
 */
export interface Web3Icons {
    /**
     * Web3Icons icon ID
     */
    name: string;
    /**
     * Variants of the icon, if none specified - all are available
     */
    variants?: string[];
}

export interface IndexerDocsURL {
    /**
     * Docs description, e.g. Arbitrum 101
     */
    description?: string;
    /**
     * URL to the documentation, e.g. https://docs.infradao.com/archive-nodes-101/arbitrum
     */
    url: string;
}

/**
 * Whether the network is a mainnet/testnet/devnet
 */
export enum NetworkType {
    Devnet = "devnet",
    Mainnet = "mainnet",
    Testnet = "testnet",
}

export interface Relation {
    /**
     * Kind of relation
     */
    kind: RelationKind;
    /**
     * ID of the related network, e.g. mainnet, near-mainnet
     */
    network: string;
}

/**
 * Kind of relation
 */
export enum RelationKind {
    BeaconOf = "beaconOf",
    EvmOf = "evmOf",
    ForkedFrom = "forkedFrom",
    L2Of = "l2Of",
    Other = "other",
    ShardOf = "shardOf",
    TestnetOf = "testnetOf",
}

/**
 * Services available for the network in the ecosystem
 */
export interface Services {
    /**
     * Firehose gRPC URLs, e.g. eth.firehose.pinax.network:443
     */
    firehose?: string[];
    /**
     * Substreams-based subgraphs studio deployment URLs, e.g. https://api.thegraph.com/deploy
     */
    sps?: string[];
    /**
     * Subgraph studio deployment URLs, e.g. https://api.thegraph.com/deploy
     */
    subgraphs?: string[];
    /**
     * Substreams gRPC URLs, e.g. eth.substreams.pinax.network:443
     */
    substreams?: string[];
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toNetworksRegistryElement(json: string): NetworksRegistryElement {
        return cast(JSON.parse(json), r("NetworksRegistryElement"));
    }

    public static networksRegistryElementToJson(value: NetworksRegistryElement): string {
        return JSON.stringify(uncast(value, r("NetworksRegistryElement")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "NetworksRegistryElement": o([
        { json: "$schema", js: "$schema", typ: "" },
        { json: "description", js: "description", typ: "" },
        { json: "networks", js: "networks", typ: a(r("Network")) },
        { json: "title", js: "title", typ: "" },
        { json: "updatedAt", js: "updatedAt", typ: Date },
        { json: "version", js: "version", typ: "" },
    ], false),
    "Network": o([
        { json: "aliases", js: "aliases", typ: u(undefined, a("")) },
        { json: "apiUrls", js: "apiUrls", typ: u(undefined, a(r("APIURL"))) },
        { json: "caip2Id", js: "caip2Id", typ: "" },
        { json: "docsUrl", js: "docsUrl", typ: u(undefined, "") },
        { json: "explorerUrls", js: "explorerUrls", typ: u(undefined, a("")) },
        { json: "firehose", js: "firehose", typ: u(undefined, r("Firehose")) },
        { json: "fullName", js: "fullName", typ: "" },
        { json: "genesis", js: "genesis", typ: u(undefined, r("Genesis")) },
        { json: "graphNode", js: "graphNode", typ: u(undefined, r("GraphNode")) },
        { json: "icon", js: "icon", typ: u(undefined, r("Icon")) },
        { json: "id", js: "id", typ: "" },
        { json: "indexerDocsUrls", js: "indexerDocsUrls", typ: u(undefined, a(r("IndexerDocsURL"))) },
        { json: "issuanceRewards", js: "issuanceRewards", typ: true },
        { json: "nativeToken", js: "nativeToken", typ: u(undefined, "") },
        { json: "networkType", js: "networkType", typ: r("NetworkType") },
        { json: "relations", js: "relations", typ: u(undefined, a(r("Relation"))) },
        { json: "rpcUrls", js: "rpcUrls", typ: u(undefined, a("")) },
        { json: "secondName", js: "secondName", typ: u(undefined, "") },
        { json: "services", js: "services", typ: r("Services") },
        { json: "shortName", js: "shortName", typ: "" },
    ], false),
    "APIURL": o([
        { json: "kind", js: "kind", typ: r("APIURLKind") },
        { json: "url", js: "url", typ: "" },
    ], false),
    "Firehose": o([
        { json: "blockType", js: "blockType", typ: "" },
        { json: "bufUrl", js: "bufUrl", typ: "" },
        { json: "bytesEncoding", js: "bytesEncoding", typ: r("BytesEncoding") },
        { json: "evmExtendedModel", js: "evmExtendedModel", typ: u(undefined, true) },
    ], false),
    "Genesis": o([
        { json: "hash", js: "hash", typ: "" },
        { json: "height", js: "height", typ: 0 },
    ], false),
    "GraphNode": o([
        { json: "protocol", js: "protocol", typ: u(undefined, r("Protocol")) },
    ], false),
    "Icon": o([
        { json: "web3Icons", js: "web3Icons", typ: u(undefined, r("Web3Icons")) },
    ], false),
    "Web3Icons": o([
        { json: "name", js: "name", typ: "" },
        { json: "variants", js: "variants", typ: u(undefined, a("")) },
    ], false),
    "IndexerDocsURL": o([
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "url", js: "url", typ: "" },
    ], false),
    "Relation": o([
        { json: "kind", js: "kind", typ: r("RelationKind") },
        { json: "network", js: "network", typ: "" },
    ], false),
    "Services": o([
        { json: "firehose", js: "firehose", typ: u(undefined, a("")) },
        { json: "sps", js: "sps", typ: u(undefined, a("")) },
        { json: "subgraphs", js: "subgraphs", typ: u(undefined, a("")) },
        { json: "substreams", js: "substreams", typ: u(undefined, a("")) },
    ], false),
    "APIURLKind": [
        "blockscout",
        "etherscan",
        "ethplorer",
        "other",
        "subscan",
    ],
    "BytesEncoding": [
        "base58",
        "base64",
        "hex",
        "other",
        "0xhex",
    ],
    "Protocol": [
        "arweave",
        "cosmos",
        "ethereum",
        "near",
        "other",
        "starknet",
    ],
    "NetworkType": [
        "devnet",
        "mainnet",
        "testnet",
    ],
    "RelationKind": [
        "beaconOf",
        "evmOf",
        "forkedFrom",
        "l2Of",
        "other",
        "shardOf",
        "testnetOf",
    ],
};
