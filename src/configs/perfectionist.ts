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
      files: scriptFiles,
      name: 'waltz/perfectionist/setup',
      plugins: {
        perfectionist,
      },
    },
    {
      files: options.files ?? scriptFiles,
      name: 'waltz/perfectionist/rules',
      ...(options.settings ? { settings: options.settings } : {}),
      rules: {
        ...recommendedRules,
        ...options.overrides,
      },
    },
  ]
}
