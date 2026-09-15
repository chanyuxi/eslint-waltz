import type {
  LinterConfig,
  PerfectionistOptions,
} from '../types'

import {
  getScriptFiles,
  resolveFiles,
  type ScriptScope,
} from '../internal/files'
import { importPerfectionistPlugin } from '../packages'

export default async function perfectionistConfig(
  options: PerfectionistOptions = {},
  scriptScope: ScriptScope,
): Promise<LinterConfig[]> {
  const perfectionist = await importPerfectionistPlugin()

  const ruleFiles = resolveFiles(
    options.files,
    getScriptFiles(scriptScope),
  )
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
      name: 'waltz/perfectionist/disable-imports-order',
      rules: {
        // Since both the `import` plugin and `perfectionist` support import/export sorting
        // configurations, we need to know the scope of the latter so that the former can
        // serve as a fallback for other files.
        'imports/order': 'off',
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
