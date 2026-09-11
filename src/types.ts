import globals from 'globals'

import type { RuleOptions } from './typegen'
import type { Linter } from 'eslint'
import type { FlatGitignoreOptions } from 'eslint-config-flat-gitignore'
import type { PluginSettings } from 'eslint-plugin-tailwindcss'

export type ImportsOptions = SharedOptions

export type JsoncOptions = SharedOptions

export interface JsOptions extends SharedOptions {
  /**
   * Add predefined global variables to JavaScript files.
   *
   * Values must be names exported by the `globals` package, such as `browser`
   * or `node`.
   */
  globals?: (keyof typeof globals)[]
}

export interface LinterConfig extends Omit<Linter.Config, 'rules'> {
  rules?: Rules
}

export interface PerfectionistOptions extends SharedOptions {
  /**
   * Select one of Perfectionist's full recommended presets.
   *
   * Without a preset, only `perfectionist/sort-jsx-props` is enabled by
   * default. A preset enables all of the plugin's sorting rules.
   */
  preset?: PerfectionistPreset
  /**
   * Configure shared Perfectionist settings.
   *
   * Settings are passed through under the `perfectionist` key, for example
   * `{ perfectionist: { type: 'natural', order: 'asc' } }`.
   */
  settings?: Linter.Config['settings']
}

export type PerfectionistPreset
  = 'recommended-alphabetical'
    | 'recommended-custom'
    | 'recommended-line-length'
    | 'recommended-natural'

export type ReactOptions = SharedOptions
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
export type StylisticOptions = SharedOptions
export interface TailwindcssOptions extends SharedOptions {
  /**
   * Configure the shared settings used by `eslint-plugin-tailwindcss`.
   *
   * Tailwind CSS v4 projects should provide `cssConfigPath` under the
   * `tailwindcss` settings key when the default path is not appropriate.
   */
  settings?: {
    tailwindcss?: PluginSettings
  }
}
export type TsOptions = SharedOptions

export type UnresolvedLinterConfig
  = Arraiable<LinterConfig> | Promise<Arraiable<LinterConfig>>

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
   * Enable rules for validating and ordering imports and exports.
   *
   * This configuration is enabled by default. JavaScript files are included
   * by default, and the scope also includes TypeScript files when `ts` is
   * enabled. Set this option to `false` to disable it, or pass an options
   * object to change the file scope or override rules.
   *
   * @default true
   * @see https://github.com/un-ts/eslint-plugin-import-x
   */
  imports?: boolean | ImportsOptions
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
   * Configure Perfectionist sorting rules.
   *
   * This configuration is enabled by default with
   * `perfectionist/sort-jsx-props`. Set it to `false` to disable it, or pass
   * a `preset` to enable one of the full recommended configurations.
   *
   * @default true
   * @see https://perfectionist.dev/configs
   * @see https://perfectionist.dev/rules/sort-jsx-props
   */
  perfectionist?: boolean | PerfectionistOptions
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
  /**
   * Configure stylistic rules for script files.
   *
   * This configuration is always enabled and uses `@stylistic/eslint-plugin`.
   * It targets JavaScript files by default, and also targets TypeScript files
   * when `ts` is enabled. Perfectionist is provided as a separate default
   * configuration through the `perfectionist` option.
   *
   * @default {}
   * @see https://eslint.style/
   * @see https://perfectionist.dev/rules/sort-jsx-props
   */
  stylistic?: StylisticOptions
  /**
   * Enable Tailwind CSS class name linting.
   *
   * The module is disabled by default because it requires a Tailwind CSS v4
   * project, `eslint-plugin-tailwindcss`, and Node.js `>=20.19.0` when
   * enabled. When enabled, JavaScript files are included by default;
   * TypeScript files are included as well when `ts` is enabled. Pass an
   * options object to change the file scope, configure the Tailwind CSS
   * settings, or override rules.
   *
   * @default false
   * @see https://github.com/francoismassart/eslint-plugin-tailwindcss
   */
  tailwindcss?: boolean | TailwindcssOptions
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
}

type Arraiable<T> = Array<T> | T

type Rules = Record<string, Linter.RuleEntry | undefined> & RuleOptions
