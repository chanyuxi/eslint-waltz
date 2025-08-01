import { TS_FILES } from '../constants'
import { importTypeScriptParser, importTypeScriptPlugin } from '../packages'

import type { LinterConfig, TsOptions } from '../types'

export default async function tsConfig(
  options: boolean | TsOptions = {},
): Promise<LinterConfig[]> {
  const [
    typeScriptPlugin,
    typeScriptParser,
  ] = await Promise.all([
    importTypeScriptPlugin(),
    importTypeScriptParser(),
  ] as const)

  const resolvedConfig: TsOptions = typeof options === 'boolean' ? {} : options

  return [
    {
      name: 'waltz/ts/setup',
      files: [TS_FILES],
      plugins: {
        '@typescript-eslint': typeScriptPlugin,
      },
      languageOptions: {
        parser: typeScriptParser,
      },
    },
    {
      name: 'waltz/ts/rules',
      files: resolvedConfig.files ?? [TS_FILES],
      rules: {
        '@typescript-eslint/ban-ts-comment': 'error',
        'no-array-constructor': 'off',
        '@typescript-eslint/no-array-constructor': 'error',
        '@typescript-eslint/no-duplicate-enum-values': 'error',
        '@typescript-eslint/no-empty-object-type': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-extra-non-null-assertion': 'error',
        '@typescript-eslint/no-misused-new': 'error',
        '@typescript-eslint/no-namespace': 'error',
        '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
        '@typescript-eslint/no-require-imports': 'error',
        '@typescript-eslint/no-this-alias': 'error',
        '@typescript-eslint/no-unnecessary-type-constraint': 'error',
        '@typescript-eslint/no-unsafe-declaration-merging': 'error',
        '@typescript-eslint/no-unsafe-function-type': 'error',
        'no-unused-expressions': 'off',
        '@typescript-eslint/no-unused-expressions': 'error',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/no-wrapper-object-types': 'error',
        '@typescript-eslint/prefer-as-const': 'error',
        '@typescript-eslint/prefer-namespace-keyword': 'error',
        '@typescript-eslint/triple-slash-reference': 'error',

        ...resolvedConfig.overrides,
      },
    },
  ]
}
