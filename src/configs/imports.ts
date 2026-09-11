import { ALL_SCRIPTS_FILES, JS_FILES } from '../constants'
import { importImportXPlugin } from '../packages'

import type { ImportsOptions, LinterConfig } from '../types'

export default async function importsConfig(
  isEnableTypeScript = false,
  options: ImportsOptions = {},
): Promise<LinterConfig[]> {
  const importsPlugin = await importImportXPlugin()
  const scriptFiles = isEnableTypeScript ? ALL_SCRIPTS_FILES : [JS_FILES]
  const files = options.files ?? scriptFiles

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

        'imports/order': [
          'error',
          {
            'groups': [
              'builtin',
              'external',
              'parent',
              'sibling',
              'index',
              'type',
              ['object', 'unknown'],
            ],
            'pathGroups': [
              {
                pattern: '@/**',
                group: 'internal',
                position: 'before',
              },
              {
                pattern: '*.{css,scss,less}',
                group: 'unknown',
                patternOptions: { matchBase: true },
                position: 'after',
              },
              {
                pattern: '*.{svg,png,jpg,gif,webp}',
                group: 'unknown',
                patternOptions: { matchBase: true },
                position: 'after',
              },
            ],
            'pathGroupsExcludedImportTypes': ['builtin'],
            'newlines-between': 'always',
            'alphabetize': {
              order: 'asc',
              caseInsensitive: true,
              orderImportKind: 'asc',
            },
            'named': true,
            'warnOnUnassignedImports': true,
            'distinctGroup': false,
          },
        ],

        ...options.overrides,
      },
    },
  ]
}
