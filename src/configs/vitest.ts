import type { LinterConfig, VitestOptions } from '../types'

import { VITEST_JS_FILES, VITEST_TS_FILES } from '../constants'
import { importVitestPlugin } from '../packages'

interface RelativeOptions {
  isEnableTypeScript: boolean
}

export default async function vitestConfig(
  options: VitestOptions = {},
  relative: RelativeOptions,
): Promise<LinterConfig[]> {
  const vitest = await importVitestPlugin()
  const testFiles = relative.isEnableTypeScript
    ? [VITEST_JS_FILES, VITEST_TS_FILES]
    : [VITEST_JS_FILES]
  const files = options.files ?? testFiles

  return [
    {
      files,
      languageOptions: vitest.configs.env.languageOptions,
      name: 'waltz/vitest/setup',
      plugins: {
        vitest,
      },
    },
    {
      files,
      name: 'waltz/vitest/rules',
      ...(options.settings ? { settings: options.settings } : {}),
      rules: {
        ...vitest.configs.recommended.rules,
        ...options.overrides,
      },
    },
  ]
}
