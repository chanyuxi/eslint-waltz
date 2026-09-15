import { expect, test } from 'vitest'

import waltz from '../src'

import { configByName } from './helpers'

test('json can be disabled and configured', async () => {
  const defaults = await waltz()
  expect(configByName(defaults, 'waltz/jsonc/setup')).toBeDefined()

  const disabled = await waltz({ json: false })
  expect(configByName(disabled, 'waltz/jsonc/setup')).toBeUndefined()

  const configured = await waltz({
    json: {
      files: ['config/**/*.json'],
      overrides: {
        'jsonc/quotes': 'off',
      },
    },
  })
  const jsonRules = configByName(configured, 'waltz/jsonc/rules')

  expect(jsonRules?.files).toEqual(['config/**/*.json'])
  expect(jsonRules?.rules?.['jsonc/quotes']).toBe('off')

  const jsonSetup = configByName(configured, 'waltz/jsonc/setup')
  expect(jsonSetup?.files).toEqual([
    'config/**/*.json',
    '**/package.json',
    '**/[jt]sconfig.json',
    '**/[jt]sconfig.*.json',
  ])
  expect(
    configByName(configured, 'waltz/jsonc/sort/package-json')?.files,
  ).toEqual(['**/package.json'])
  expect(
    configByName(configured, 'waltz/jsonc/sort/tsconfig-json')?.files,
  ).toEqual(['**/[jt]sconfig.json', '**/[jt]sconfig.*.json'])
})
