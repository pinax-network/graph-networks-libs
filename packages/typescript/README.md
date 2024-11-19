# The Graph Networks Registry Typescript Library

[![npm version](https://badge.fury.io/js/%40pinax%2Fgraph-networks-registry.svg)](https://www.npmjs.com/package/@pinax/graph-networks-registry) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

TypeScript types and helpers for working with [The Graph Networks Registry](https://github.com/graphprotocol/networks-registry).

## Installation

```bash
npm install @pinax/graph-networks-registry
```

## Features

- Type-safe interfaces for The Graph Networks Registry
- Helper methods to load registry data from various sources
- Network lookup by ID and alias

## Usage

### Loading the Registry

```typescript
import { NetworksRegistry } from '@pinax/graph-networks-registry';
// Load from latest version. Always compatible. Make sure you update the package to get the latest data.
const registry = await NetworksRegistry.fromLatestVersion();
// Load from specific version. Might throw if schema is not compatible.
const registry = await NetworksRegistry.fromExactVersion('0.6.0');
// Load from URL. Might throw if schema is not compatible.
const registry = await NetworksRegistry.fromUrl('https://registry.thegraph.com/TheGraphNetworksRegistry.json');
// Load from local file. Might throw if file is not found or schema is not compatible.
const registry = NetworksRegistry.fromFile('./TheGraphNetworksRegistry.json');
// Load from JSON string. Might throw if schema is not compatible.
const registry = NetworksRegistry.fromJson(jsonString);
```

### Working with Networks

```typescript
// Find network by ID
const mainnet = registry.getNetworkById('mainnet');
if (mainnet) {
    console.log(mainnet.fullName); // "Ethereum Mainnet"
    console.log(mainnet.caip2Id); // "eip155:1"
}
// Find network by alias
const ethereum = registry.getNetworkByAlias('eth');
if (ethereum) {
    console.log(ethereum.fullName); // "Ethereum Mainnet"
}
```

For complete type definitions, see the [types.ts](https://github.com/pinax-network/graph-networks-libs/blob/main/packages/typescript/src/types.ts) file.
