import type { LinterConfig, TailwindcssOptions } from '../types'

import { ALL_SCRIPTS_FILES, JS_FILES } from '../constants'
import { importTailwindcssPlugin } from '../packages'

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
