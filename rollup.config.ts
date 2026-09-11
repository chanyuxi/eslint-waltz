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
    external: [/^node:/],
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
      file: 'dist/index.d.ts',
      format: 'esm',
    },
    plugins: [dtsPlugin()],
  },
])
