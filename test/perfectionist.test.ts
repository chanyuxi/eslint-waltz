import { ESLint } from 'eslint'
import { expect, test } from 'vitest'

import waltz from '../src'

import { configByName, ruleSeverity } from './helpers'

test('Perfectionist disables imports ordering in its scope', async () => {
  const configs = await waltz({
    perfectionist: {
      files: [['src/**/*.ts', '**/*.test.ts']],
    },
    ts: true,
  })
  const eslint = new ESLint({
    overrideConfig: configs,
    overrideConfigFile: true,
  })
  const fileConfig = await eslint.calculateConfigForFile('src/example.test.ts')

  expect(ruleSeverity(fileConfig?.rules?.['imports/order'])).toBe(0)
  expect(fileConfig?.rules?.['perfectionist/sort-imports']).toBeDefined()
})

test('Perfectionist uses recommended-alphabetical by default', async () => {
  const configs = await waltz()
  const setup = configByName(configs, 'waltz/perfectionist/setup')
  const rules = configByName(configs, 'waltz/perfectionist/rules')

  expect(setup?.plugins?.perfectionist).toBeDefined()
  expect(rules?.rules?.['perfectionist/sort-objects']).toBeDefined()
  expect(rules?.rules?.['perfectionist/sort-jsx-props']).toBeDefined()
  expect(rules?.rules?.['@stylistic/jsx-sort-props']).toBeUndefined()
})

test('Perfectionist recommended presets can be selected', async () => {
  const configs = await waltz({
    perfectionist: { preset: 'recommended-alphabetical' },
  })
  const rules = configByName(configs, 'waltz/perfectionist/rules')

  expect(rules?.rules?.['perfectionist/sort-objects']).toBeDefined()
  expect(rules?.rules?.['perfectionist/sort-jsx-props']).toBeDefined()
})

test('Perfectionist can be disabled', async () => {
  const configs = await waltz({ perfectionist: false })

  expect(configByName(configs, 'waltz/perfectionist/setup')).toBeUndefined()
})
