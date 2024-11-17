#!/bin/bash

set -e  # Exit on any error

# 1. Pull latest registry
echo "Fetching latest registry..."
curl -s https://registry.thegraph.com/TheGraphNetworksRegistry.json > registry/TheGraphNetworksRegistry.json

# 2. Extract and fetch schema URL
SCHEMA_URL=$(jq -r '."$schema"' registry/TheGraphNetworksRegistry.json)
echo "Fetching schema from $SCHEMA_URL..."
curl -s "$SCHEMA_URL" > "registry/TheGraphNetworksRegistrySchema.json"

# 3. Extract schema version from filename (e.g., TheGraphNetworksRegistrySchema_v0_5.json)
SCHEMA_VERSION=$(echo "$SCHEMA_URL" | grep -o 'v[0-9]\+_[0-9]\+' | tr '_' '.')
MAJOR_MINOR_VERSION=${SCHEMA_VERSION#v}  # Remove the 'v' prefix
echo "Detected schema version: $MAJOR_MINOR_VERSION"

# Update TypeScript package.json
echo "Updating TypeScript package version..."
jq ".version = \"$MAJOR_MINOR_VERSION.0\"" packages/typescript/package.json > temp.json && mv temp.json packages/typescript/package.json

# Update Rust Cargo.toml
echo "Updating Rust package version..."
sed -i.bak "s/^version = \".*\"/version = \"$MAJOR_MINOR_VERSION.0\"/" packages/rust/Cargo.toml
rm packages/rust/Cargo.toml.bak

# Create/Update Go version file
echo "Updating Go version..."
cat > packages/golang/pkg/version.go << EOF
package registry
const Version = "$MAJOR_MINOR_VERSION.0"
EOF

# 4. Generate types for each language
echo "Generating TypeScript types..."
npx quicktype -s schema registry/TheGraphNetworksRegistrySchema.json --lang typescript --top-level NetworksRegistryElement --out packages/typescript/src/types.ts

echo "Generating Rust types..."
npx quicktype -s schema registry/TheGraphNetworksRegistrySchema.json --lang rust --top-level NetworksRegistry --density normal --visibility public --derive-debug --derive-clone --out packages/rust/src/types.rs

echo "Generating Go types..."
npx quicktype -s schema registry/TheGraphNetworksRegistrySchema.json --lang go --top-level NetworksRegistry --package registry --out packages/golang/pkg/types.go

# 5. Run tests for each package
echo "Running TypeScript tests..."
cd packages/typescript && npm test
cd ../..

echo "Running Rust tests..."
cd packages/rust && cargo test
cd ../..

echo "Running Go tests..."
cd packages/golang/pkg && go test ./...
cd ../..

echo "Schema update completed successfully!"
