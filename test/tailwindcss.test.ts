import { expect, test } from 'vitest'

import waltz from '../src'
import { JS_FILES, TS_FILES } from '../src/constants'

import { configByName } from './helpers'

test('Tailwind CSS can be enabled and configured', async () => {
  const configs = await waltz({
    tailwindcss: {
      settings: {
        tailwindcss: { cssConfigPath: './src/styles.css' },
      },
    },
  })
  const setup = configByName(configs, 'waltz/tailwindcss/setup')
  const rules = configByName(configs, 'waltz/tailwindcss/rules')

  expect(setup?.files).toEqual([JS_FILES])
  expect(setup?.plugins?.tailwindcss).toBeDefined()
  expect(rules?.rules?.['tailwindcss/classnames-order']).toBe('warn')
  expect(rules?.settings).toEqual({
    tailwindcss: { cssConfigPath: './src/styles.css' },
  })
})

test('Tailwind CSS is disabled by default', async () => {
  const configs = await waltz()

  expect(configByName(configs, 'waltz/tailwindcss/setup')).toBeUndefined()
})

test('Tailwind CSS extends to TypeScript files when enabled', async () => {
  const configs = await waltz({ tailwindcss: true, ts: true })
  const setup = configByName(configs, 'waltz/tailwindcss/setup')

  expect(setup?.files).toEqual([JS_FILES, TS_FILES])
})
