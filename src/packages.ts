import { ESLint, Linter } from 'eslint'

export function importGitignoreSeek() {
  return import('eslint-config-flat-gitignore').then(m => m.default)
}

export function importGlobals() {
  return import('globals').then(m => m.default)
}

export function importTypeScriptPlugin() {
  return import('typescript-eslint').then(m => m.default.plugin as ESLint.Plugin)
}

export function importTypeScriptParser() {
  return import('typescript-eslint').then(m => m.default.parser as Linter.Parser)
}

export function importStylisticPlugin() {
  return import('@stylistic/eslint-plugin').then(m => m.default)
}

export function importJsoncPlugin() {
  return import('eslint-plugin-jsonc').then(m => m.default as unknown as ESLint.Plugin)
}

export function importJsoncParser() {
  return (import('jsonc-eslint-parser'))
}

export function importImportsPlugin() {
  return import('eslint-plugin-import')
}
