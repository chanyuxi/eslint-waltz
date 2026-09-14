import type { LinterConfig, TsOptions } from '../types'

import { TS_FILES } from '../constants'
import {
  importTypeScriptParser,
  importTypeScriptPlugin,
  importTypeScriptRecommendedRules,
} from '../packages'

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
  const ruleFiles = resolvedConfig.files ?? [TS_FILES]

  return [
    {
      files: ruleFiles,
      languageOptions: {
        parser: typeScriptParser,
      },
      name: 'waltz/ts/setup',
      plugins: {
        '@typescript-eslint': typeScriptPlugin,
      },
    },
    {
      files: ruleFiles,
      name: 'waltz/ts/rules',
      rules: {
        ...recommendedRules,
        ...resolvedConfig.overrides,
      },
    },
  ]
}
