import type { LinterConfig } from './types'
import type { ESLint, Linter } from 'eslint'

import { importPeer } from './internal/peer'

interface TailwindcssPlugin extends ESLint.Plugin {
  configs: {
    recommended: LinterConfig
  }
}

interface TypeScriptModule {
  parser: Linter.Parser
  plugin: ESLint.Plugin
}

export function importGitignoreSeek() {
  return importDefault(
    'eslint-config-flat-gitignore',
    'Gitignore support',
    () => import('eslint-config-flat-gitignore'),
  )
}

export function importImportXPlugin() {
  return importDefault(
    'eslint-plugin-import-x',
    'Import validation',
    () => import('eslint-plugin-import-x'),
  )
}

export function importJsoncParser() {
  return importPeer(
    'jsonc-eslint-parser',
    'JSON/JSONC support',
    () => import('jsonc-eslint-parser'),
  )
}

export function importJsoncPlugin() {
  return importDefaultAs(
    'eslint-plugin-jsonc',
    'JSON/JSONC support',
    () => import('eslint-plugin-jsonc'),
    d => d as ESLint.Plugin,
  )
}

export function importPerfectionistPlugin() {
  return importDefault(
    'eslint-plugin-perfectionist',
    'Perfectionist support',
    () => import('eslint-plugin-perfectionist'),
  )
}

export function importReactDebugPlugin() {
  return importDefaultAs(
    'eslint-plugin-react-debug',
    'React support',
    () => import('eslint-plugin-react-debug'),
    d => d as ESLint.Plugin,
  )
}

export function importReactDomPlugin() {
  return importDefaultAs(
    'eslint-plugin-react-dom',
    'React support',
    () => import('eslint-plugin-react-dom'),
    d => d as ESLint.Plugin,
  )
}

export function importReactHookExtraPlugin() {
  return importDefaultAs(
    'eslint-plugin-react-hooks-extra',
    'React support',
    () => import('eslint-plugin-react-hooks-extra'),
    d => d as ESLint.Plugin,
  )
}

export function importReactNamingConventionPlugin() {
  return importDefaultAs(
    'eslint-plugin-react-naming-convention',
    'React support',
    () => import('eslint-plugin-react-naming-convention'),
    d => d as ESLint.Plugin,
  )
}

export function importReactPlugin() {
  return importDefaultAs(
    'eslint-plugin-react-x',
    'React support',
    () => import('eslint-plugin-react-x'),
    d => d as ESLint.Plugin,
  )
}

export function importReactWebApiPlugin() {
  return importDefaultAs(
    'eslint-plugin-react-web-api',
    'React support',
    () => import('eslint-plugin-react-web-api'),
    d => d as ESLint.Plugin,
  )
}

export function importStylisticPlugin() {
  return importDefault(
    '@stylistic/eslint-plugin',
    'Stylistic rules',
    () => import('@stylistic/eslint-plugin'),
  )
}

export function importTailwindcssPlugin() {
  return importDefaultAs(
    'eslint-plugin-tailwindcss',
    'Tailwind CSS support',
    () => import('eslint-plugin-tailwindcss'),
    d => d as TailwindcssPlugin,
  )
}

export function importTypeScriptParser() {
  return importDefaultAs(
    'typescript-eslint',
    'TypeScript support',
    () => import('typescript-eslint'),
    d => (d as TypeScriptModule).parser,
  )
}

export function importTypeScriptPlugin() {
  return importDefaultAs(
    'typescript-eslint',
    'TypeScript support',
    () => import('typescript-eslint'),
    d => (d as TypeScriptModule).plugin,
  )
}

export function importTypeScriptRecommendedRules() {
  return importPeer(
    'typescript-eslint',
    'TypeScript support',
    () => import('typescript-eslint').then(({ configs }) =>
      Object.assign(
        {},
        ...configs.recommended.map(config => config.rules ?? {}),
      ),
    ),
  )
}

export function importVitestPlugin() {
  return importPeer(
    '@vitest/eslint-plugin',
    'Vitest support',
    () => import('@vitest/eslint-plugin').then(module => module.default),
  )
}

function importDefault<T>(
  moduleName: string,
  featureName: string,
  importer: () => Promise<{ default: T }>,
): Promise<T> {
  return importPeer(moduleName, featureName, () =>
    importer().then(m => m.default),
  )
}

function importDefaultAs<T>(
  moduleName: string,
  featureName: string,
  importer: () => Promise<{ default: unknown }>,
  cast: (d: unknown) => T,
): Promise<T> {
  return importPeer(moduleName, featureName, () =>
    importer().then(m => cast(m.default)),
  )
}
