# The Graph Networks Registry Typescript Library

[![npm version](https://badge.fury.io/js/%40pinax%2Fgraph-networks-registry.svg)](https://www.npmjs.com/package/@pinax/graph-networks-registry) [![Documentation](https://img.shields.io/badge/docs-TypeDoc-blue)](https://pinax-network.github.io/graph-networks-libs/) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

TypeScript types and helpers for [The Graph Networks Registry](https://github.com/graphprotocol/networks-registry).

Documentation available [here](https://pinax-network.github.io/graph-networks-libs/).

## Installation

```bash
npm install @pinax/graph-networks-registry
```

## Usage

### Loading the Registry

```typescript
import { NetworksRegistry } from '@pinax/graph-networks-registry';

// Load from the latest compatible registry JSON at networks-registry.thegraph.com
const registry = await NetworksRegistry.fromLatestVersion();

// Load from specific version tag at networks-registry.thegraph.com
const registry = await NetworksRegistry.fromExactVersion('0.7.0');
const registry = await NetworksRegistry.fromExactVersion('0.7.x');

// Load from URL
const registry = await NetworksRegistry.fromUrl('https://networks-registry.thegraph.com/TheGraphNetworksRegistry.json');

// Load from local file
const registry = NetworksRegistry.fromFile('./TheGraphNetworksRegistry.json');

// Load from JSON string
const registry = NetworksRegistry.fromJson(jsonString);
```

### Working with Networks

```typescript
// Find network by graph ID (works with both network ID and alias)
const mainnet = registry.getNetworkByGraphId('mainnet');
if (mainnet) {
    console.log(mainnet.fullName); // "Ethereum Mainnet"
    console.log(mainnet.caip2Id); // "eip155:1"
}

// You can also use an alias with getNetworkByGraphId
const ethereum = registry.getNetworkByGraphId('eth');
if (ethereum) {
    console.log(ethereum.fullName); // "Ethereum Mainnet"
}

// Find network by CAIP-2 chain ID
const ethereumByChainId = registry.getNetworkByCaip2Id('eip155:1');
if (ethereumByChainId) {
    console.log(ethereumByChainId.fullName); // "Ethereum Mainnet"
    console.log(ethereumByChainId.id); // "mainnet"
}

// Invalid format will produce a warning and return undefined
const invalidNetwork = registry.getNetworkByCaip2Id('invalid-format');
// Warning: CAIP-2 Chain ID should be in the format '[namespace]:[reference]', e.g., 'eip155:1'

// Deprecated methods (will be removed in future versions)
// Find network by ID
// @deprecated Use getNetworkByGraphId instead
const mainnetById = registry.getNetworkById('mainnet');

// Find network by alias
// @deprecated Use getNetworkByGraphId instead
const mainnetByAlias = registry.getNetworkByAlias('eth');
```
