import type { Linter } from 'eslint'
import type { FlatGitignoreOptions } from 'eslint-config-flat-gitignore'
import type { PluginSettings } from 'eslint-plugin-tailwindcss'

import globals from 'globals'

import type { RuleOptions } from './typegen'

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
   * Without a preset, the `recommended-alphabetical` preset is enabled by
   * default. A preset selects one of the plugin's recommended presets.
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

export interface ReactOptions extends SharedOptions {
  /**
   * Configure the settings consumed by the React ESLint plugins.
   *
   * Settings are merged with the defaults used by this module.
   */
  settings?: Linter.Config['settings']
}
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

export interface VitestOptions extends SharedOptions {
  /**
   * Configure shared Vitest settings, such as `typecheck` or custom fixtures.
   */
  settings?: Linter.Config['settings']
}

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
   * Enable rules for validating imports and exports. Import ordering is
   * provided by Perfectionist when enabled, and by `imports/order` otherwise.
   *
   * This configuration is enabled by default. JavaScript files are included
   * by default, and the scope also includes TypeScript files when `ts` is
   * enabled. Set this option to `false` to disable it, or pass an options
   * object to change the file scope or override rules.
   *
   * The module-resolution rules `imports/named` and `imports/namespace` are
   * disabled by default because they can be expensive. Enable them explicitly
   * through `overrides` when needed.
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
   * TypeScript configuration files. Passing `files` changes the scope of the
   * general JSON rules; the specialized file sorting remains targeted to
   * those file names.
   *
   * @default true
   * @see https://github.com/ota-meshi/eslint-plugin-jsonc
   */
  json?: boolean | JsoncOptions
  /**
   * Configure Perfectionist sorting rules.
   *
   * This configuration is enabled by default with the
   * `recommended-alphabetical` preset. Set it to `false` to disable it, or
   * pass a `preset` to select one of the recommended configurations.
   *
   * @default true
   * @see https://perfectionist.dev/configs
   */
  perfectionist?: boolean | PerfectionistOptions
  /**
   * Enable React-specific lint rules.
   *
   * JavaScript and JSX files are included by default. When `ts` is enabled,
   * TypeScript and TSX files are included as well. Pass an options object to
   * change the file scope or override rules. If custom React files include
   * TypeScript files outside `ts.files`, they receive the TypeScript parser;
   * TypeScript-specific rule exceptions remain limited to `ts.files`.
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
   * when `ts` is enabled. Configure Perfectionist sorting separately with the
   * `perfectionist` option.
   *
   * @default {}
   * @see https://eslint.style/
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
   * When enabled, the default stylistic, import, React, Perfectionist,
   * Tailwind CSS, and Vitest configurations also include TypeScript files when
   * those configurations are enabled. If `files` is provided, it becomes the
   * maximum TypeScript scope for those modules. Their own `files` options can
   * still override that scope. For Vitest, the default test-file patterns are
   * intersected with this scope.
   *
   * @default false
   * @see https://typescript-eslint.io/linting/configs/#recommended-config
   */
  ts?: boolean | TsOptions
  /**
   * Enable Vitest-specific rules for test files.
   *
   * By default, JavaScript test files matching `*.test.*` or `*.spec.*` are
   * included. TypeScript test files are included when `ts` is enabled.
   * When `ts.files` is customized, TypeScript test files are limited to that
   * scope unless this module's own `files` option is provided.
   *
   * @default false
   * @see https://github.com/vitest-dev/eslint-plugin-vitest
   */
  vitest?: boolean | VitestOptions
}

type Arraiable<T> = Array<T> | T

type Rules = Record<string, Linter.RuleEntry | undefined> & RuleOptions
