import globals from 'globals'

import type { RuleOptions } from './typegen'
import type { Linter } from 'eslint'
import type { FlatGitignoreOptions } from 'eslint-config-flat-gitignore'

type Rules = Record<string, Linter.RuleEntry | undefined> & RuleOptions

export interface LinterConfig extends Omit<Linter.Config, 'rules'> {
  rules?: Rules
}

type Arraiable<T> = T | Array<T>

export type UnresolvedLinterConfig
  = Arraiable<LinterConfig> | Promise<Arraiable<LinterConfig>>

export interface SharedOptions {
  /**
   * Restrict this module's configuration to the specified files.
   *
   * Each module has its own default file pattern. Providing this option
   * replaces that pattern; it does not add another pattern to the default.
   */
  files?: Linter.Config['files']
  /**
   * Override rules within this module's file scope.
   *
   * Rule names are not restricted to the plugin used by this module, so core
   * ESLint rules and rules from other configured plugins can also be set here.
   */
  overrides?: LinterConfig['rules']
}

export interface JsOptions extends SharedOptions {
  /**
   * Add predefined global variables to JavaScript files.
   *
   * Values must be names exported by the `globals` package, such as `browser`
   * or `node`.
   */
  globals?: (keyof typeof globals)[]
}

export type TsOptions = SharedOptions
export type StylisticOptions = SharedOptions
export type JsoncOptions = SharedOptions
export type ImportsOptions = SharedOptions
export type ReactOptions = SharedOptions

export interface WaltzOptions {
  /**
   * Treat patterns from `.gitignore` as global ESLint ignores.
   *
   * Pass an options object to customize `eslint-config-flat-gitignore`, or
   * use `true` to enable its strict mode with the default options.
   *
   * @default false
   * @see https://github.com/antfu/eslint-config-flat-gitignore
   */
  gitignore?: boolean | FlatGitignoreOptions
  /**
   * Configure the core ESLint rules for JavaScript files.
   *
   * The JavaScript configuration is always included. It targets JavaScript
   * files, including JSX files, by default. Use `files`, `globals`, and
   * `overrides` to adjust its scope and rules.
   *
   * @default {}
   * @see https://github.com/eslint/eslint.git
   */
  js?: JsOptions
  /**
   * Enable TypeScript support for TypeScript files.
   *
   * `true` enables the TypeScript parser and the recommended
   * `typescript-eslint` rules. By default, this applies to `.ts`, `.tsx`,
   * `.mts`, and `.cts` files, including their JSX variants. Passing an
   * options object additionally allows the TypeScript file scope and rules to
   * be customized with `files` and `overrides`.
   *
   * When enabled, the default stylistic, import, and React configurations also
   * include TypeScript files when those configurations are enabled.
   *
   * @default false
   * @see https://typescript-eslint.io/linting/configs/#recommended-config
   */
  ts?: boolean | TsOptions
  /**
   * Configure stylistic rules for script files.
   *
   * This configuration is always enabled and uses `@stylistic/eslint-plugin`.
   * It targets JavaScript files by default, and also targets TypeScript files
   * when `ts` is enabled. The JSX prop-sorting rule is enabled in addition to
   * the plugin's customized rules.
   *
   * @default {}
   * @see https://eslint.style/
   */
  stylistic?: StylisticOptions
  /**
   * Enable linting for JSON, JSON5, and JSONC files.
   *
   * The default configuration also sorts keys in `package.json` and
   * TypeScript configuration files. Pass an options object to change the file
   * scope or override rules.
   *
   * @default true
   * @see https://github.com/ota-meshi/eslint-plugin-jsonc
   */
  json?: boolean | JsoncOptions
  /**
   * Enable rules for validating and ordering imports and exports.
   *
   * This configuration is enabled by default. JavaScript files are included
   * by default, and the scope also includes TypeScript files when `ts` is
   * enabled. Set this option to `false` to disable it, or pass an options
   * object to change the file scope or override rules.
   *
   * @default true
   * @see https://github.com/import-js/eslint-plugin-import
   */
  imports?: boolean | ImportsOptions
  /**
   * Enable React-specific lint rules.
   *
   * JavaScript and JSX files are included by default. When `ts` is enabled,
   * TypeScript and TSX files are included as well. Pass an options object to
   * change the file scope or override rules.
   *
   * @default false
   * @see https://github.com/Rel1cx/eslint-react
   */
  react?: boolean | ReactOptions
}
