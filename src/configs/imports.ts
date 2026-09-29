import type { ImportsOptions, LinterConfig } from '../types'

import { INTERNAL_IMPORT_GLOB } from '../constants'
import {
  getScriptFiles,
  resolveFiles,
  type ScriptScope,
} from '../internal/files'
import { importImportXPlugin } from '../packages'

export default async function importsConfig(
  scriptScope: ScriptScope,
  options: ImportsOptions = {},
): Promise<LinterConfig[]> {
  const importsPlugin = await importImportXPlugin()

  const files = resolveFiles(options.files, getScriptFiles(scriptScope))
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
          'type',
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
          'unknown',
        ],
        'named': true,
        'newlines-between': 'always',
        'pathGroups': [
          {
            group: 'internal',
            pattern: INTERNAL_IMPORT_GLOB,
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
        'pathGroupsExcludedImportTypes': ['builtin', 'type'],
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

        'imports/no-duplicates': 'warn',
        'imports/no-named-as-default': 'warn',
        'imports/no-named-as-default-member': 'warn',

        ...overrides,
      },
    },
    {
      files,
      name: 'waltz/imports/order',
      rules: orderRules,
    },
  ]
}
