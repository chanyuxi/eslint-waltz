import { ALL_SCRIPTS_FILES, JS_FILES } from '../constants'
import { importPerfectionistPlugin } from '../packages'

import type {
  LinterConfig,
  PerfectionistOptions,
} from '../types'

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
  const recommendedRules = options.preset
    ? perfectionist.configs[options.preset].rules ?? {}
    : {
        'perfectionist/sort-jsx-props': 'error',
      }

  return [
    {
      name: 'waltz/perfectionist/setup',
      files: scriptFiles,
      plugins: {
        perfectionist,
      },
    },
    {
      name: 'waltz/perfectionist/rules',
      files: options.files ?? scriptFiles,
      ...(options.settings ? { settings: options.settings } : {}),
      rules: {
        ...recommendedRules,
        ...options.overrides,
      },
    },
  ]
}
