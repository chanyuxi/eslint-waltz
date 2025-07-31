import { JS_FILES, TS_FILES } from '../constants'
import { importStylisticPlugin } from '../packages'
import { LinterConfig, StylisticOptions } from '../types'

export default async function stylisticConfig(options: StylisticOptions = {}): Promise<LinterConfig> {
  const eslintStylistic = await importStylisticPlugin()

  const configs = eslintStylistic.configs.customize()

  return {
    name: 'waltz/stylistic/setup',
    files: options.files ?? [JS_FILES, TS_FILES],
    plugins: {
      '@stylistic': eslintStylistic,
    },
    rules: {
      ...configs.rules,
      ...options.overrides,
    },
  }
}
