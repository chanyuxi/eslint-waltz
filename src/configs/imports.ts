import type { ImportsOptions, LinterConfig } from '../types'

import { ALL_SCRIPTS_FILES, JS_FILES } from '../constants'
import { importImportXPlugin } from '../packages'

interface RelativeOptions {
  perfectionistFiles?: LinterConfig['ignores']
}

export default async function importsConfig(
  isEnableTypeScript = false,
  options: ImportsOptions = {},
  relative: RelativeOptions = {},
): Promise<LinterConfig[]> {
  const importsPlugin = await importImportXPlugin()
  const scriptFiles = isEnableTypeScript ? ALL_SCRIPTS_FILES : [JS_FILES]
  const files = options.files ?? scriptFiles
  const {
    'imports/order': orderOverride,
    ...overrides
  } = options.overrides ?? {}

  const orderRules: LinterConfig['rules'] = {
    'imports/order': orderOverride ?? [
      'error',
      {
        'alphabetize': {
          caseInsensitive: true,
          order: 'asc',
          orderImportKind: 'asc',
        },
        'distinctGroup': false,
        'groups': [
          'builtin',
          'external',
          'parent',
          'sibling',
          'index',
          'type',
          ['object', 'unknown'],
        ],
        'named': true,
        'newlines-between': 'always',
        'pathGroups': [
          {
            group: 'internal',
            pattern: '@/**',
            position: 'before',
          },
          {
            group: 'unknown',
            pattern: '*.{css,scss,less}',
            patternOptions: { matchBase: true },
            position: 'after',
          },
          {
            group: 'unknown',
            pattern: '*.{svg,png,jpg,gif,webp}',
            patternOptions: { matchBase: true },
            position: 'after',
          },
        ],
        'pathGroupsExcludedImportTypes': ['builtin'],
        'warnOnUnassignedImports': true,
      },
    ],
  }

  return [
    {
      files,
      name: 'waltz/imports/setup',
      plugins: {
        imports: importsPlugin,
      },
    },
    {
      files,
      name: 'waltz/imports/rules',
      rules: {
        'imports/default': 'error',
        'imports/export': 'error',

        'imports/named': 'error',
        'imports/namespace': 'error',

        'imports/no-duplicates': 'warn',
        'imports/no-named-as-default': 'warn',
        'imports/no-named-as-default-member': 'warn',

        ...overrides,
      },
    },
    {
      files,
      ...(relative.perfectionistFiles
        ? { ignores: relative.perfectionistFiles }
        : {}),
      name: 'waltz/imports/order',
      rules: orderRules,
    },
  ]
}
