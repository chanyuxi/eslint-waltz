import { ALL_SCRIPTS_FILES, JS_FILES } from '../constants'
import { importStylisticPlugin } from '../packages'

import type { LinterConfig, StylisticOptions } from '../types'

interface RelativeOptions {
  isEnableTypeScript: boolean
}

export default async function stylisticConfig(
  options: StylisticOptions = {},
  relative: RelativeOptions,
): Promise<LinterConfig[]> {
  const eslintStylistic = await importStylisticPlugin()
  const scriptFiles = relative.isEnableTypeScript
    ? ALL_SCRIPTS_FILES
    : [JS_FILES]

  // Directly use the generated recommendation rules
  const configs = eslintStylistic.configs.customize()

  return [
    {
      name: 'waltz/stylistic/setup',
      files: scriptFiles,
      plugins: {
        '@stylistic': eslintStylistic,
      },
    },
    {
      name: 'waltz/stylistic/rules',
      files: options.files ?? scriptFiles,
      rules: {
        ...configs.rules,
        ...options.overrides,
      },
    },
  ]
}
