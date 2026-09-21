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

  const files = resolveFiles(
    options.files,
    getScriptFiles(scriptScope),
  )

  return [
    {
      files,
      languageOptions: {
        parserOptions: {
          // Since Tailwind can be enabled independently—even without enabling
          // React—it ensures that JSX files are parsed correctly.
          ecmaFeatures: { jsx: true },
        },
      },
      name: 'waltz/tailwindcss/setup',
      plugins: {
        tailwindcss,
      },
    },
    {
      files,
      name: 'waltz/tailwindcss/rules',
      rules: {
        'tailwindcss/classnames-order': 'warn',
        'tailwindcss/enforces-canonical-classname': 'warn',
        'tailwindcss/enforces-negative-arbitrary-values': 'warn',
        'tailwindcss/enforces-shorthand': 'warn',
        'tailwindcss/important-modifier-suffix': 'warn',
        'tailwindcss/no-arbitrary-value': 'off',
        'tailwindcss/no-contradicting-classname': 'error',
        // Generally, custom class names are supported, so the recommended practice
        // is not followed here.
        'tailwindcss/no-custom-classname': 'off',
        'tailwindcss/no-unnecessary-arbitrary-value': 'warn',

        ...options.overrides,
      },
      settings: {
        tailwindcss: {},
        ...options.settings,
      },
    },
  ]
}
