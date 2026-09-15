import type { LinterConfig, VitestOptions } from '../types'

import {
  getVitestScope,
  resolveFiles,
  type ScriptScope,
} from '../internal/files'
import { importVitestPlugin } from '../packages'

export default async function vitestConfig(
  options: VitestOptions = {},
  scriptScope: ScriptScope,
): Promise<LinterConfig[]> {
  const vitest = await importVitestPlugin()
  const testScope = options.files
    ? { files: options.files }
    : getVitestScope(scriptScope)
  const files = resolveFiles(options.files, testScope.files)

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
