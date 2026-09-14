import type {
  LinterConfig,
  PerfectionistOptions,
} from '../types'

import { ALL_SCRIPTS_FILES, JS_FILES } from '../constants'
import { importPerfectionistPlugin } from '../packages'

interface RelativeOptions {
  isEnableTypeScript: boolean
}

export default async function perfectionistConfig(
  options: PerfectionistOptions = {},
  relative: RelativeOptions,
): Promise<LinterConfig[]> {
  const perfectionist = await importPerfectionistPlugin()
  const scriptFiles = relative.isEnableTypeScript
    ? ALL_SCRIPTS_FILES
    : [JS_FILES]
  const ruleFiles = options.files ?? scriptFiles
  const preset = options.preset ?? 'recommended-alphabetical'
  const recommendedRules = perfectionist.configs[preset].rules ?? {}

  return [
    {
      files: ruleFiles,
      name: 'waltz/perfectionist/setup',
      plugins: {
        perfectionist,
      },
    },
    {
      files: ruleFiles,
      name: 'waltz/perfectionist/rules',
      ...(options.settings ? { settings: options.settings } : {}),
      rules: {
        ...recommendedRules,
        ...options.overrides,
      },
    },
  ]
}
