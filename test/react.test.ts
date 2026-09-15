import { expect, test } from 'vitest'

import waltz from '../src'
import { TS_FILES } from '../src/constants'

import { configByName } from './helpers'

test('React TypeScript exceptions do not disable rules for JavaScript', async () => {
  const configs = await waltz({ react: true, ts: true })
  const reactRules = configByName(configs, 'waltz/react/rules')
  const reactTypeScriptRules = configByName(
    configs,
    'waltz/react/typescript-rules',
  )

  expect(
    reactRules?.rules?.['@eslint-react/dom/no-unknown-property'],
  ).toBe('warn')
  expect(reactTypeScriptRules?.files).toEqual([TS_FILES])
  expect(
    reactTypeScriptRules?.rules?.['@eslint-react/dom/no-unknown-property'],
  ).toBe('off')
})

test('React settings can be configured', async () => {
  const configs = await waltz({
    react: {
      settings: {
        'react-x': { importSource: 'preact' },
      },
    },
  })
  const rules = configByName(configs, 'waltz/react/rules')

  expect(rules?.settings?.['react-x']).toMatchObject({
    importSource: 'preact',
    skipImportCheck: true,
  })
})
