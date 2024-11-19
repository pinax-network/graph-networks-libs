# The Graph Networks Registry Libraries

Libraries for working with [The Graph Networks Registry](https://github.com/graphprotocol/networks-registry).

- [TypeScript](./packages/typescript)
- [Rust](./packages/rust)
- [Go](./packages/golang)


## Updating the schema

To update the types to match new schema version, run [./generate.sh](./generate.sh).
This will:
- pull the latest schema from [registry.thegraph.com](https://registry.thegraph.com),
- inject new version into libraries
- generate the types for all libraries using [quicktype](https://quicktype.io)
- run tests and examples with the new schema

if there are errors when running the script, find and fix them manually.

## Versioning

- Libraries are using semantic versioning `Major.Minor.Patch`
- Major and minor versions should match the schema version
- Patch version can be incremented independently with bug fixes
- Patch version is reset to 0 when schema version is changed


## Publishing new versions

- `npm publish --access public` for TypeScript
- `cargo publish` for Rust
- `git tag vX.Y.Z && git push --tags` for Go
