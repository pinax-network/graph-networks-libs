import { defineConfig } from 'tsup'
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

export default defineConfig([
  // CommonJS build
  {
    entry: ['src/index.ts'],
    format: ['cjs'],
    dts: true,
    outDir: 'dist/cjs',
    sourcemap: true,
    clean: true,
    onSuccess: async () => {
      // Create package.json for CommonJS
      const cjsPackageJson = { type: "commonjs" }
      writeFileSync(
        join(process.cwd(), 'dist/cjs/package.json'),
        JSON.stringify(cjsPackageJson, null, 2)
      )
    }
  },
  // ES Module build  
  {
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: true,
    outDir: 'dist/esm',
    sourcemap: true,
    outExtension() {
      return { js: '.js' } // Force .js extension for ESM
    },
    onSuccess: async () => {
      // Create package.json for ESM
      const esmPackageJson = { type: "module" }
      writeFileSync(
        join(process.cwd(), 'dist/esm/package.json'),
        JSON.stringify(esmPackageJson, null, 2)
      )
    }
  }
])
