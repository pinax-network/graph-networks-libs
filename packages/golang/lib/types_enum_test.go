package registry

import (
	"encoding/json"
	"errors"
	"testing"
)

func TestParseEnum(t *testing.T) {
	nt, err := ParseNetworkType("mainnet")
	if err != nil || nt != NetworkTypeMainnet {
		t.Errorf("Expected NetworkTypeMainnet, got %q (err: %v)", nt, err)
	}

	if _, err := ParseNetworkType("nope"); !errors.Is(err, ErrInvalidNetworkType) {
		t.Errorf("Expected ErrInvalidNetworkType, got %v", err)
	}
}

func TestEnumIsValid(t *testing.T) {
	if !RelationKindTestnetOf.IsValid() {
		t.Error("Expected RelationKindTestnetOf to be valid")
	}
	if RelationKind("nope").IsValid() {
		t.Error("Expected unknown RelationKind to be invalid")
	}
}

func TestEnumValues(t *testing.T) {
	for _, kind := range SubgraphKindValues() {
		if !kind.IsValid() {
			t.Errorf("Expected %q to be valid", kind)
		}
	}
	if len(SubgraphKindNames()) != len(SubgraphKindValues()) {
		t.Error("Expected names and values to have the same length")
	}
}

func TestDeprecatedEnumConstants(t *testing.T) {
	if Mainnet != NetworkTypeMainnet || The0Xhex != BytesEncoding0Xhex || FluffyOther != RelationKindOther {
		t.Error("Expected deprecated constants to match go-enum constants")
	}
}

// Newer registry versions may add enum values: unmarshalling must not fail on them
func TestUnmarshalUnknownEnumValue(t *testing.T) {
	var relation Relation
	if err := json.Unmarshal([]byte(`{"kind": "futureKind", "network": "mainnet"}`), &relation); err != nil {
		t.Fatalf("Expected unknown enum value to unmarshal, got %v", err)
	}
	if relation.Kind.IsValid() {
		t.Error("Expected unknown enum value to be invalid")
	}
}
