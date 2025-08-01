import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import nodeResolver from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { defineConfig } from 'rollup'
import dts from 'rollup-plugin-dts'

const external = [
  'eslint-config-flat-gitignore',
  'typescript-eslint',
  '@stylistic/eslint-plugin',
  'eslint-plugin-jsonc',
  'jsonc-eslint-parser',
  'eslint-plugin-import-lite',
  'eslint-plugin-import',
  'eslint-plugin-react-x',
  'eslint-plugin-react-debug',
  'eslint-plugin-react-dom',
  'eslint-plugin-react-hooks-extra',
  'eslint-plugin-react-naming-convention',
  'eslint-plugin-react-web-api',
]

export default defineConfig([
  {
    input: 'src/index.ts',
    external,
    output: {
      file: 'dist/index.js',
      format: 'esm',
    },
    plugins: [
      nodeResolver(),
      commonjs(),
      typescript(),
      json(),
    ],
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'esm',
    },
    plugins: [dts()],
  },
])
