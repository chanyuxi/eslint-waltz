import { JS_FILES, TS_FILES } from '../constants'
import { importImportsPlugin } from '../packages'

import type { LinterConfig } from '../types'

export default async function importsConfig(): Promise<LinterConfig> {
  const importsPlugin = await importImportsPlugin()

  return {
    files: [JS_FILES, TS_FILES],
    plugins: {
      imports: importsPlugin,
    },
    rules: {
      // 'imports/no-unresolved': 'error',
      'imports/named': 'error',
      'imports/namespace': 'error',
      'imports/default': 'error',
      'imports/export': 'error',

      'imports/no-named-as-default': 'warn',
      'imports/no-named-as-default-member': 'warn',
      'imports/no-duplicates': 'warn',

      'imports/order': ['error', {
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
      }],
    },
  }
}
