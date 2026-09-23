#!/bin/bash

# this script is used to generate the types for the registry when the registry schema is updated

set -e

# return to the original directory on error or script exit
CWD=$(pwd)
trap '[ $? -ne 0 ] && echo "❌ Failed to update the schema"; cd "$CWD";' EXIT

# Pull latest registry
echo "Fetching latest registry..."
curl -s https://networks-registry.thegraph.com/TheGraphNetworksRegistry.json > sample/TheGraphNetworksRegistry.json

# Extract and fetch schema URL
SCHEMA_URL=$(jq -r '."$schema"' sample/TheGraphNetworksRegistry.json)
echo "Fetching schema from $SCHEMA_URL..."
# weird name for the schema file but it's the only way to make quicktype generate acceptable type name
curl -s "$SCHEMA_URL" > "sample/Network.json"
# quicktype names types after $defs only if they have a title, so set it to the def key to keep names stable
jq '."$defs" |= with_entries(.value.title //= .key)' sample/Network.json > temp.json
mv temp.json sample/Network.json

# Extract schema version from filename (e.g., TheGraphNetworksRegistrySchema_v0_5.json)
SCHEMA_VERSION=$(echo "$SCHEMA_URL" | grep -o 'v[0-9]\+_[0-9]\+' | tr '_' '.')
MAJOR_MINOR_VERSION=${SCHEMA_VERSION#v}  # Remove the 'v' prefix
echo "Detected schema version: $MAJOR_MINOR_VERSION"

# Update version in TypeScript lib
echo "Updating TypeScript package version..."
jq ".version = \"$MAJOR_MINOR_VERSION.0\"" packages/typescript/package.json > temp.json
mv temp.json packages/typescript/package.json
echo "export const schemaVersion = \"$MAJOR_MINOR_VERSION\";" > packages/typescript/src/version.ts

# Update Rust Cargo.toml
echo "Updating Rust package version..."
sed -i.bak "s/^version = \".*\"/version = \"$MAJOR_MINOR_VERSION.0\"/" packages/rust/Cargo.toml
rm packages/rust/Cargo.toml.bak

# Create/Update Go version file
echo "Updating Go version..."
cat > packages/golang/lib/version.go << EOF
package registry
const Version = "$MAJOR_MINOR_VERSION.0"
EOF

# Pin quicktype: newer versions change generated type names/enums (breaking API)
QUICKTYPE_VERSION=23.2.6
GO_ENUM_VERSION=v0.9.5

# Generate types for each language
echo "Generating TypeScript types..."
npx -y quicktype@$QUICKTYPE_VERSION -s schema sample/Network.json --lang typescript --top-level NetworksRegistryInner --out packages/typescript/src/types.ts

echo "Generating Rust types..."
npx -y quicktype@$QUICKTYPE_VERSION -s schema sample/Network.json --lang rust --top-level NetworksRegistry --density normal --visibility public --derive-debug --derive-clone --out packages/rust/src/types.rs
(cd packages/rust && cargo fmt)

echo "Generating Go types..."
npx -y quicktype@$QUICKTYPE_VERSION -s schema sample/Network.json --lang go --top-level NetworksRegistry --package registry --out packages/golang/lib/types.go
echo "Generating Go enums..."
awk -f scripts/annotate-go-enums.awk packages/golang/lib/types.go packages/golang/lib/types.go > temp.go
mv temp.go packages/golang/lib/types.go
gofmt -w packages/golang/lib/types.go packages/golang/lib/version.go
(cd packages/golang/lib && go run github.com/abice/go-enum@$GO_ENUM_VERSION -f types.go --names --values)

# Run tests for each package
echo "Running TypeScript tests..."
cd packages/typescript
npm install --no-audit --no-fund
npm run build
npm test
cd ../..

echo "Running Rust tests..."
cd packages/rust
cargo test
cd ../..

echo "Running Go tests..."
cd packages/golang/lib
go test
cd ../../..

echo "Cleaning up..."
rm sample/Network.json

# Run examples
cd packages/typescript/examples/local
npm install --no-audit --no-fund
npm start
cd ../../../..

cd packages/rust/examples/local
cargo run
cd ../../../..

cd packages/golang/examples/local
go run main.go

echo "✅ Schema update completed successfully!"
