import type {
  LinterConfig,
  PerfectionistOptions,
} from '../types'

import {
  getPerfectionistImportGroups,
} from '../constants'
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
  const importSortOptions = getRuleOptions(
    recommendedRules['perfectionist/sort-imports'],
  )
  const exportSortOptions = getRuleOptions(
    recommendedRules['perfectionist/sort-exports'],
  )

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
        'perfectionist/sort-exports': [
          'error',
          {
            ...exportSortOptions,
            newlinesBetween: 1,
          },
        ],
        'perfectionist/sort-imports': [
          'error',
          {
            ...importSortOptions,
            groups: getPerfectionistImportGroups(),
            internalPattern: ['^@/.+'],
          },
        ],
        ...options.overrides,
      },
    },
  ]
}

function getRuleOptions(rule: unknown): Record<string, unknown> {
  if (!Array.isArray(rule)) {
    return {}
  }

  const options = rule[1]
  return typeof options === 'object'
    && options !== null
    && !Array.isArray(options)
    ? options as Record<string, unknown>
    : {}
}
