# @pinax/graph-networks-ts

TypeScript types and helpers for working with [The Graph Networks Registry](https://github.com/graphprotocol/networks-registry).

## Installation

```bash
npm install @pinax/graph-networks-ts
```

## Features

- Type-safe interfaces for The Graph Networks Registry
- Helper methods to load registry data from various sources
- Network lookup by ID and alias

## Usage

### Loading the Registry

```typescript
import { NetworksRegistry } from '@pinax/graph-networks-ts';
// Load from latest version
const registry = await NetworksRegistry.fromLatestVersion();
// Load from specific version
const registry = await NetworksRegistry.fromExactVersion('0.5.0');
// Load from URL
const registry = await NetworksRegistry.fromUrl('https://example.com/registry.json');
// Load from local file
const registry = NetworksRegistry.fromFile('./registry.json');
// Load from JSON string
const registry = NetworksRegistry.fromJson(jsonString);
```

### Working with Networks

```typescript
// Get all networks
const networks = registry.networks;
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


For complete type definitions, see the [types.ts](https://github.com/YaroShkvorets/graph-networks-libs/blob/main/packages/typescript/src/types.ts) file.

### Basic Example

```typescript
import { NetworksRegistry } from '@pinax/graph-networks-ts';
const registry = await NetworksRegistry.fromLatestVersion();
// Get network information
const mainnet = registry.getNetworkById('mainnet');
if (mainnet) {
    console.log(`Network: ${mainnet.fullName}`);
    console.log(`CAIP-2 ID: ${mainnet.caip2Id}`);
    console.log(`RPC URLs: ${mainnet.rpcUrls?.join(', ')}`);
}
```
