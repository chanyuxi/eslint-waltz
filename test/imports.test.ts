import { ESLint } from 'eslint'
import { expect, test } from 'vitest'

import waltz from '../src'

import { configByName, ruleSeverity } from './helpers'

test('imports are enabled by default and can be disabled', async () => {
  const defaults = await waltz()
  const setup = configByName(defaults, 'waltz/imports/setup')
  const defaultRules = configByName(defaults, 'waltz/imports/rules')

  expect(setup?.plugins?.imports).toBeDefined()
  expect(setup).toBeDefined()
  expect(defaultRules?.rules?.['imports/named']).toBeUndefined()
  expect(defaultRules?.rules?.['imports/namespace']).toBeUndefined()
  expect(defaultRules?.rules?.['imports/order']).toBeUndefined()

  const explicitlyEnabled = await waltz({
    imports: {
      overrides: {
        'imports/named': 'error',
        'imports/namespace': 'error',
      },
    },
  })
  const explicitlyEnabledRules = configByName(
    explicitlyEnabled,
    'waltz/imports/rules',
  )
  expect(explicitlyEnabledRules?.rules?.['imports/named']).toBe('error')
  expect(explicitlyEnabledRules?.rules?.['imports/namespace']).toBe('error')

  const defaultEslint = new ESLint({
    overrideConfig: defaults,
    overrideConfigFile: true,
  })
  const defaultFileConfig = await defaultEslint.calculateConfigForFile(
    'src/example.js',
  )
  expect(ruleSeverity(defaultFileConfig?.rules?.['imports/order'])).toBe(0)

  const disabled = await waltz({ imports: false })
  expect(configByName(disabled, 'waltz/imports/setup')).toBeUndefined()

  const withoutPerfectionist = await waltz({ perfectionist: false })
  const withoutPerfectionistEslint = new ESLint({
    overrideConfig: withoutPerfectionist,
    overrideConfigFile: true,
  })
  const withoutPerfectionistFileConfig
    = await withoutPerfectionistEslint.calculateConfigForFile(
      'src/example.js',
    )
  expect(
    withoutPerfectionistFileConfig?.rules?.['imports/order'],
  ).toBeDefined()
})

test('sorting rules respect custom file scopes', async () => {
  const configs = await waltz({
    imports: { files: ['scripts/**/*.ts'] },
    perfectionist: { files: ['src/**/*.ts'] },
    ts: true,
  })
  const eslint = new ESLint({
    overrideConfig: configs,
    overrideConfigFile: true,
  })
  const sourceConfig = await eslint.calculateConfigForFile('src/example.ts')
  const scriptConfig = await eslint.calculateConfigForFile(
    'scripts/example.ts',
  )

  expect(sourceConfig?.rules?.['perfectionist/sort-imports']).toBeDefined()
  expect(ruleSeverity(sourceConfig?.rules?.['imports/order'])).toBe(0)
  expect(scriptConfig?.rules?.['imports/order']).toBeDefined()
  expect(scriptConfig?.rules?.['perfectionist/sort-imports']).toBeUndefined()
})

test('internal imports are ordered before relative imports', async () => {
  const eslint = new ESLint({
    overrideConfig: await waltz({
      json: false,
      perfectionist: false,
    }),
    overrideConfigFile: true,
  })
  const [result] = await eslint.lintText(
    `import { local } from '../local'\nimport { internal } from '@/internal'\n`,
    { filePath: 'src/example.js' },
  )

  expect(result.messages).toContainEqual(
    expect.objectContaining({
      message: '`@/internal` import should occur before import of `../local`',
      ruleId: 'imports/order',
    }),
  )
})

test('import/order and Perfectionist use the same import groups', async () => {
  const source = `import { local } from '../local'
import { internal } from '@/internal'
import { external } from 'react'
import { builtin } from 'node:path'
import type { TypeOnly } from '@/types'
`
  const options = [
    { json: false, perfectionist: false, ts: true },
    { imports: false, json: false, ts: true },
  ] as const

  const outputs = await Promise.all(
    options.map(async (config) => {
      const eslint = new ESLint({
        fix: true,
        overrideConfig: await waltz(config),
        overrideConfigFile: true,
      })
      const [result] = await eslint.lintText(source, {
        filePath: 'src/example.ts',
      })
      return result.output
    }),
  )

  const expected = `import type { TypeOnly } from '@/types'

import { builtin } from 'node:path'

import { external } from 'react'

import { internal } from '@/internal'

import { local } from '../local'
`
  expect(outputs).toEqual([expected, expected])
})
