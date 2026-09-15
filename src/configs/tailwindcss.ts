import type { LinterConfig, TailwindcssOptions } from '../types'

import {
  getScriptFiles,
  resolveFiles,
  type ScriptScope,
} from '../internal/files'
import { importTailwindcssPlugin } from '../packages'

export default async function tailwindcssConfig(
  options: TailwindcssOptions = {},
  scriptScope: ScriptScope,
): Promise<LinterConfig[]> {
  const tailwindcss = await importTailwindcssPlugin()

  const recommended = tailwindcss.configs.recommended
  const files = resolveFiles(
    options.files,
    getScriptFiles(scriptScope),
  )

  return [
    {
      files,
      languageOptions: recommended.languageOptions,
      name: 'waltz/tailwindcss/setup',
      plugins: {
        tailwindcss,
      },
    },
    {
      files,
      name: 'waltz/tailwindcss/rules',
      rules: {
        ...recommended.rules,
        ...options.overrides,
      },
      settings: {
        ...recommended.settings,
        ...options.settings,
      },
    },
  ]
}
