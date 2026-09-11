import { ALL_SCRIPTS_FILES, JS_FILES } from '../constants'
import { importTailwindcssPlugin } from '../packages'

import type { LinterConfig, TailwindcssOptions } from '../types'

interface RelativeOptions {
  isEnableTypeScript: boolean
}

export default async function tailwindcssConfig(
  options: TailwindcssOptions = {},
  relative: RelativeOptions,
): Promise<LinterConfig[]> {
  const tailwindcss = await importTailwindcssPlugin()
  const recommended = tailwindcss.configs.recommended
  const scriptFiles = relative.isEnableTypeScript
    ? ALL_SCRIPTS_FILES
    : [JS_FILES]
  const files = options.files ?? scriptFiles

  return [
    {
      name: 'waltz/tailwindcss/setup',
      files,
      plugins: {
        tailwindcss,
      },
      languageOptions: recommended.languageOptions,
    },
    {
      name: 'waltz/tailwindcss/rules',
      files,
      settings: {
        ...recommended.settings,
        ...options.settings,
      },
      rules: {
        ...recommended.rules,
        ...options.overrides,
      },
    },
  ]
}
