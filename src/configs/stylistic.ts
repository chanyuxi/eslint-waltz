import { ALL_SCRIPTS_FILES, JS_FILES, TS_FILES } from '../constants'
import { importStylisticPlugin } from '../packages'

import type { LinterConfig, StylisticOptions } from '../types'

export default async function stylisticConfig(options: StylisticOptions = {}): Promise<LinterConfig[]> {
  const eslintStylistic = await importStylisticPlugin()

  // Directly use the generated recommendation rules
  const configs = eslintStylistic.configs.customize()

  return [
    {
      name: 'waltz/stylistic/setup',
      files: ALL_SCRIPTS_FILES,
      plugins: {
        '@stylistic': eslintStylistic,
      },
    },
    {
      name: 'waltz/stylistic/rules',
      files: options.files ?? [JS_FILES, TS_FILES],
      rules: {
        ...configs.rules,
        ...options.overrides,
      },
    },
  ]
}
