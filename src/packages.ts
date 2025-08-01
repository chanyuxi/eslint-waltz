import { ESLint, Linter } from 'eslint'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function importDefault<T = any>(moduleName: string): Promise<T> {
  return import(moduleName).then(m => m.default)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function importDefaultAs<T = any>(moduleName: string, cast: (d: any) => T): Promise<T> {
  return import(moduleName).then(m => cast(m.default))
}

export function importGitignoreSeek() {
  return importDefault('eslint-config-flat-gitignore')
}

export function importGlobals() {
  return importDefault('globals')
}

export function importTypeScriptPlugin() {
  return importDefaultAs('typescript-eslint', d => d.plugin as ESLint.Plugin)
}

export function importTypeScriptParser() {
  return importDefaultAs('typescript-eslint', d => d.parser as Linter.Parser)
}

export function importStylisticPlugin() {
  return importDefault('@stylistic/eslint-plugin')
}

export function importJsoncPlugin() {
  return importDefaultAs('eslint-plugin-jsonc', d => d as unknown as ESLint.Plugin)
}

export function importJsoncParser() {
  return import('jsonc-eslint-parser')
}

export function importImportsPlugin() {
  return import('eslint-plugin-import')
}

export function importReactPlugin() {
  return importDefaultAs('eslint-plugin-react-x', d => d as unknown as ESLint.Plugin)
}

export function importReactDebugPlugin() {
  return importDefaultAs('eslint-plugin-react-debug', d => d as unknown as ESLint.Plugin)
}

export function importReactDomPlugin() {
  return importDefaultAs('eslint-plugin-react-dom', d => d as unknown as ESLint.Plugin)
}

export function importReactHookExtraPlugin() {
  return importDefaultAs('eslint-plugin-react-hooks-extra', d => d as unknown as ESLint.Plugin)
}

export function importReactNamingConventionPlugin() {
  return importDefaultAs('eslint-plugin-react-naming-convention', d => d as unknown as ESLint.Plugin)
}

export function importReactWebApiPlugin() {
  return importDefaultAs('eslint-plugin-react-web-api', d => d as unknown as ESLint.Plugin)
}
