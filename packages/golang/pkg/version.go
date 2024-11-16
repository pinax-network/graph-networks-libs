package registry

import "strings"

var (
	Version = "0.5.0"
)

func GetMajorMinor() (string, string) {
	parts := strings.Split(Version, ".")
	if len(parts) < 2 {
		panic("invalid version format: version must include major and minor numbers (x.y.z)")
	}
	return parts[0], parts[1]
}
