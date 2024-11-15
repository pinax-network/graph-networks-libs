use std::env;

fn main() {
    let version = env::var("CARGO_PKG_VERSION").unwrap();
    let parts: Vec<&str> = version.split('.').collect();
    println!("cargo:rustc-env=CARGO_PKG_VERSION_MAJOR_MINOR={}_{}", parts[0], parts[1]);
}
