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
- generate Go enum helpers using [go-enum](https://github.com/abice/go-enum) (see [scripts/annotate-go-enums.awk](./scripts/annotate-go-enums.awk))
- run tests and examples with the new schema

If there are errors when running the script, find and fix them manually.

Requires `jq`, Bun >= 1.4.3 (`curl -fsSL https://bun.com/install | bash -s "bun-v1.4.3"`), Node.js, `cargo` and `go`. quicktype is pinned in the root `package.json` and installed from `bun.lock`, and go-enum in `generate.sh` (`GO_ENUM_VERSION`): newer quicktype versions change the generated type names and enums, which breaks the public API, so check the diff carefully before bumping them.

## Versioning

- Libraries are using semantic versioning `Major.Minor.Patch`
- Major and minor versions should match the schema version
- Patch version can be incremented independently with bug fixes
- Patch version is reset to 0 when schema version is changed


## Publishing new versions

Publish a GitHub release tagged `vX.Y.Z`. The [Publish](./.github/workflows/publish.yml) workflow runs the CI checks, then publishes every package whose version is `X.Y.Z` and is not released yet:

- TypeScript to npm
- Rust to crates.io
- Go by pushing the tag `packages/golang/vX.Y.Z`

A package at a different version is skipped, so a release can publish one library on its own after a patch bump.

npm and crates.io trust this workflow by its filename (trusted publishing), so the repository holds no registry tokens. Renaming `publish.yml` breaks publishing until both registries are updated.

To publish by hand instead:

- `npm publish --force` for TypeScript (`--force` because `package.json` requires Bun)
- `cargo publish` for Rust
- `./release.sh` for Go
