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

Publish a GitHub release tagged `vX.Y.Z` from `main`. The [Publish](./.github/workflows/publish.yml) workflow runs the CI checks, then releases every package whose version is exactly `X.Y.Z` and is not released yet:

- TypeScript to npm
- Rust to crates.io
- Go by pushing the tag `packages/golang/vX.Y.Z`

A package at a different version, or one already released, is skipped. One release can therefore publish all three libraries or just one.

npm and crates.io trust this workflow by its filename (trusted publishing), so the repository holds no registry tokens. Renaming `publish.yml` breaks publishing until both registries are updated.

### Releasing a schema update

1. Run `./generate.sh` (see [Updating the schema](#updating-the-schema)). It sets all three packages to `X.Y.0`.
2. Update the hand-written version references: the three package READMEs, the two Go example `go.mod` files, and the TypeScript and Go test fixtures.
3. Merge the pull request, then publish a release tagged `vX.Y.0`.

### Releasing a fix for one library

1. Make the fix and bump only that library's version to the next patch:
   - TypeScript: `version` in `packages/typescript/package.json`
   - Rust: `version` in `packages/rust/Cargo.toml`
   - Go: `Version` in `packages/golang/lib/version.go`
2. Do not run `./generate.sh`: it resets every package to `X.Y.0`.
3. Merge the pull request, then publish a release tagged with that version. The other two libraries are skipped.

Release tags are shared by the three libraries, and a tag can only be used once. Take the next patch number above the latest release tag, whichever library that release was for: if TypeScript released `v0.9.1`, a later Rust-only fix is `0.9.2`. Per-library versions can therefore have gaps.

A released Go version cannot be replaced. Once the Go module proxy has served it, moving the tag does not change what users get, so fix a bad release with the next patch.

### Publishing by hand

The manual route still works, for example when GitHub Actions is unavailable. Run each command in that package's directory:

- TypeScript: `npm publish --force` (`--force` because `package.json` requires Bun)
- Rust: `cargo publish`
- Go: `./release.sh`

The workflow skips versions that are already released, so publishing a GitHub release afterwards is safe. Publishing to crates.io by hand needs "Require trusted publishing for all new versions" to stay off in the crate's settings.
