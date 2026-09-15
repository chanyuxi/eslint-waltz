import { ESLint, Linter } from 'eslint'

import { importPeer } from './internal/peer'

export function importGitignoreSeek() {
  return importDefault(
    'eslint-config-flat-gitignore',
    'Gitignore support',
  )
}

export function importImportXPlugin() {
  return importDefault('eslint-plugin-import-x', 'Import validation')
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
    d => d as unknown as ESLint.Plugin,
    'JSON/JSONC support',
  )
}

export function importPerfectionistPlugin() {
  return importDefault('eslint-plugin-perfectionist', 'Perfectionist support')
}

export function importReactDebugPlugin() {
  return importDefaultAs(
    'eslint-plugin-react-debug',
    d => d as unknown as ESLint.Plugin,
    'React support',
  )
}

export function importReactDomPlugin() {
  return importDefaultAs(
    'eslint-plugin-react-dom',
    d => d as unknown as ESLint.Plugin,
    'React support',
  )
}

export function importReactHookExtraPlugin() {
  return importDefaultAs(
    'eslint-plugin-react-hooks-extra',
    d => d as unknown as ESLint.Plugin,
    'React support',
  )
}

export function importReactNamingConventionPlugin() {
  return importDefaultAs(
    'eslint-plugin-react-naming-convention',
    d => d as unknown as ESLint.Plugin,
    'React support',
  )
}

export function importReactPlugin() {
  return importDefaultAs(
    'eslint-plugin-react-x',
    d => d as unknown as ESLint.Plugin,
    'React support',
  )
}

export function importReactWebApiPlugin() {
  return importDefaultAs(
    'eslint-plugin-react-web-api',
    d => d as unknown as ESLint.Plugin,
    'React support',
  )
}

export function importStylisticPlugin() {
  return importDefault('@stylistic/eslint-plugin', 'Stylistic rules')
}

export function importTailwindcssPlugin() {
  return importDefault('eslint-plugin-tailwindcss', 'Tailwind CSS support')
}

export function importTypeScriptParser() {
  return importDefaultAs(
    'typescript-eslint',
    d => d.parser as Linter.Parser,
    'TypeScript support',
  )
}

export function importTypeScriptPlugin() {
  return importDefaultAs(
    'typescript-eslint',
    d => d.plugin as ESLint.Plugin,
    'TypeScript support',
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function importDefault<T = any>(moduleName: string, featureName: string): Promise<T> {
  return importPeer(moduleName, featureName, () =>
    import(moduleName).then(m => m.default),
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function importDefaultAs<T = any>(
  moduleName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cast: (d: any) => T,
  featureName: string,
): Promise<T> {
  return importPeer(moduleName, featureName, () =>
    import(moduleName).then(m => cast(m.default)),
  )
}
