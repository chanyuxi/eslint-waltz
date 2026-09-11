import eslint from '@eslint/js'
import globals from 'globals'

import { JS_FILES } from '../constants'

import type { JsOptions, LinterConfig } from '../types'

interface relativeOptions {
  isEnableReact: boolean
}

export default function jsConfig(
  config: JsOptions = {},
  relative: relativeOptions,
): LinterConfig {
  return {
    files: config.files ?? [JS_FILES],
    languageOptions: {
      globals: {
        ...(config.globals
          ? config.globals
              .map(name => globals[name])
              .reduce((a, b) => ({ ...a, ...b }), {})
          : {}),
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: relative.isEnableReact,
        },
      },
    },
    name: 'waltz/js/rules',
    rules: {
      ...eslint.configs.recommended.rules,
      ...config.overrides,
    },
  }
}
