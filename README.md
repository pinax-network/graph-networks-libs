# The Graph Networks Registry Libraries

[![CI](https://github.com/pinax-network/graph-networks-libs/actions/workflows/ci.yml/badge.svg)](https://github.com/pinax-network/graph-networks-libs/actions/workflows/ci.yml) [![npm version](https://badge.fury.io/js/%40pinax%2Fgraph-networks-registry.svg)](https://www.npmjs.com/package/@pinax/graph-networks-registry) [![Crates.io](https://img.shields.io/crates/v/graph-networks-registry.svg?label=crates.io%20crate)](https://crates.io/crates/graph-networks-registry) [![Go Module](https://img.shields.io/github/v/tag/pinax-network/graph-networks-libs?filter=packages/golang/*&label=go%20module&sort=semver)](https://pkg.go.dev/github.com/pinax-network/graph-networks-libs/packages/golang/lib)

Libraries to work with [The Graph Networks Registry](https://github.com/graphprotocol/networks-registry).

- [TypeScript](./packages/typescript)
- [Rust](./packages/rust)
- [Go](./packages/golang)


## Updating the schema

To update the types to match new schema version, run [./generate.sh](./generate.sh).
This will:
- pull the latest schema from [networks-registry.thegraph.com](https://networks-registry.thegraph.com),
- inject new version into libraries
- generate the types for all libraries using [quicktype](https://quicktype.io)
- run tests and examples with the new schema

If there are errors when running the script, find and fix them manually.

## Versioning

- Libraries are using semantic versioning `Major.Minor.Patch`
- Major and minor versions should match the schema version
- Patch version can be incremented independently with bug fixes
- Patch version is reset to 0 when schema version is changed


## Publishing new versions

- `npm publish` for TypeScript
- `cargo publish` for Rust
- `./release.sh` for Go
