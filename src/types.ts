import globals from 'globals'

import type { RuleOptions } from './typegen'
import type { Linter } from 'eslint'
import type { FlatGitignoreOptions } from 'eslint-config-flat-gitignore'

type Rules = Record<string, Linter.RuleEntry | undefined> & RuleOptions

export interface LinterConfig extends Omit<Linter.Config, 'rules'> {
  rules?: Rules
}

interface SharedOptions {
  /**
   * Each configuration automatically lints all corresponding files, this option is used to override
   */
  files?: Linter.Config['files']
  /**
   * Rewrite rules
  */
  overrides?: LinterConfig['rules']
}

export interface JsOptions extends SharedOptions {
  globals?: (keyof typeof globals)[]
}

export type TsOptions = SharedOptions
export type StylisticOptions = SharedOptions
export type JsoncOptions = SharedOptions

export interface WaltzOptions {
  /**
   * Treat the .gitignore file as a global ignore
   *
   * @default false
   * @see https://github.com/antfu/eslint-config-flat-gitignore
   */
  gitignore?: boolean | FlatGitignoreOptions
  /**
   * Set lint configs and default to the recommended configuration of `@eslint/js`
   *
   * @default {}
   * @see https://github.com/eslint/eslint.git
   */
  js?: JsOptions
  /**
   * Enable TypeScript support and default to the recommended configuration of `typescript-eslint`
   *
   * @default false
   * @see https://typescript-eslint.io/linting/configs/#recommended-config
   */
  ts?: boolean | TsOptions
  /**
   * Set lint configs
   *
   * @default {}
   */
  stylistic?: StylisticOptions
  /**
   *
   */
  json?: boolean | JsoncOptions
  /**
   *
   */
  imports?: boolean
}
