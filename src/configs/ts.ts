import { TS_FILES } from '../constants'
import {
  importTypeScriptParser,
  importTypeScriptPlugin,
  importTypeScriptRecommendedRules,
} from '../packages'

import type { LinterConfig, TsOptions } from '../types'

export default async function tsConfig(
  options: boolean | TsOptions = {},
): Promise<LinterConfig[]> {
  const [typeScriptPlugin, typeScriptParser, recommendedRules]
    = await Promise.all([
      importTypeScriptPlugin(),
      importTypeScriptParser(),
      importTypeScriptRecommendedRules(),
    ] as const)

  const resolvedConfig: TsOptions = typeof options === 'boolean' ? {} : options

  return [
    {
      files: [TS_FILES],
      languageOptions: {
        parser: typeScriptParser,
      },
      name: 'waltz/ts/setup',
      plugins: {
        '@typescript-eslint': typeScriptPlugin,
      },
    },
    {
      files: resolvedConfig.files ?? [TS_FILES],
      name: 'waltz/ts/rules',
      rules: {
        ...recommendedRules,
        ...resolvedConfig.overrides,
      },
    },
  ]
}
