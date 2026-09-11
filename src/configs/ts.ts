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
        ...recommendedRules,
        ...resolvedConfig.overrides,
      },
    },
  ]
}
