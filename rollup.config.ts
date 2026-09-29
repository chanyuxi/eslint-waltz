import commonjs from '@rollup/plugin-commonjs'
import nodeResolver from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { defineConfig } from 'rollup'
import dtsPlugin from 'rollup-plugin-dts'

const external = [
  '@eslint/js',
  'eslint-config-flat-gitignore',
  'typescript-eslint',
  '@stylistic/eslint-plugin',
  'eslint-plugin-jsonc',
  'jsonc-eslint-parser',
  'eslint-plugin-import-x',
  'eslint-plugin-perfectionist',
  'eslint-plugin-react-x',
  'eslint-plugin-react-debug',
  'eslint-plugin-react-dom',
  'eslint-plugin-react-hooks-extra',
  'eslint-plugin-react-naming-convention',
  'eslint-plugin-react-web-api',
  'eslint-plugin-tailwindcss',
  '@vitest/eslint-plugin',
  'globals',
]

export default defineConfig([
  {
    external,
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'esm',
    },
    plugins: [nodeResolver(), commonjs(), typescript()],
  },
  {
    external: [/^node:/, '@clack/prompts'],
    input: 'src/cli/index.ts',
    output: {
      file: 'dist/cli.js',
      format: 'esm',
    },
    plugins: [nodeResolver(), commonjs(), typescript()],
  },
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist',
      format: 'esm',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
    plugins: [dtsPlugin(), markGeneratedTypesNoCheck()],
  },
])

function markGeneratedTypesNoCheck() {
  return {
    // eslint-typegen can emit pattern index signatures that TypeScript rejects
    // even though the generated rule option types are valid at runtime.
    generateBundle(_options, bundle) {
      for (const output of Object.values(bundle)) {
        if (
          output.type === 'chunk'
          && output.fileName.endsWith('typegen.d.ts')
          && output.code
        ) {
          output.code = `// @ts-nocheck\n${output.code}`
        }
      }
    },
    name: 'mark-generated-types-no-check',
  }
}
