import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { applyEnvVars } from "../env.js";

describe("applyEnvVars", () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = process.env;
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test("should return original URL if no env vars needed", () => {
    const url = "https://api.example.com/v1";
    expect(applyEnvVars(url)).toBe(url);
  });

  test("should replace single environment variable", () => {
    process.env.API_KEY = "secret123";
    const url = "https://api.example.com/v1?key={API_KEY}";
    expect(applyEnvVars(url)).toBe("https://api.example.com/v1?key=secret123");
  });

  test("should replace multiple environment variables", () => {
    process.env.API_KEY = "secret123";
    process.env.API_VERSION = "v2";
    const url = "https://{API_VERSION}.example.com/api?key={API_KEY}";
    expect(applyEnvVars(url)).toBe("https://v2.example.com/api?key=secret123");
  });

  test("should return empty string if any env var is missing", () => {
    process.env.API_KEY = "secret123";
    // API_VERSION is not set
    const url = "https://{API_VERSION}.example.com/api?key={API_KEY}";
    expect(applyEnvVars(url)).toBe("");
  });

  test("should handle env vars with special characters in URL", () => {
    process.env.API_KEY = "secret/123+456";
    const url = "https://api.example.com/v1?key={API_KEY}";
    expect(applyEnvVars(url)).toBe("https://api.example.com/v1?key=secret/123+456");
  });

  test("should handle multiple occurrences of same env var", () => {
    process.env.API_KEY = "secret123";
    const url = "https://api.example.com/{API_KEY}/endpoint?key={API_KEY}";
    expect(applyEnvVars(url)).toBe("https://api.example.com/secret123/endpoint?key=secret123");
  });

  test("should handle empty environment variable", () => {
    process.env.API_KEY = "";
    const url = "https://api.example.com/v1?key={API_KEY}";
    expect(applyEnvVars(url)).toBe("");
  });

  test("should handle URLs with partial matches", () => {
    process.env.KEY = "secret123";
    const url = "https://api.example.com/v1?prefix{KEY}suffix";
    expect(applyEnvVars(url)).toBe("https://api.example.com/v1?prefixsecret123suffix");
  });

  test("should handle malformed placeholders", () => {
    process.env.API_KEY = "secret123";
    // Missing closing brace
    const url = "https://api.example.com/v1?key={API_KEY";
    expect(applyEnvVars(url)).toBe(url);
  });
});
