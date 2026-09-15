import { expect, test } from 'vitest'

import waltz from '../src'
import {
  VITEST_JS_FILES,
  VITEST_TS_FILES,
} from '../src/constants'

import { configByName } from './helpers'

test('Vitest rules can be enabled for test files', async () => {
  const defaults = await waltz()
  expect(configByName(defaults, 'waltz/vitest/setup')).toBeUndefined()

  const configs = await waltz({ vitest: true })
  const setup = configByName(configs, 'waltz/vitest/setup')
  const rules = configByName(configs, 'waltz/vitest/rules')

  expect(setup?.files).toEqual([VITEST_JS_FILES])
  expect(setup?.plugins?.vitest).toBeDefined()
  expect(setup?.languageOptions?.globals).toMatchObject({ describe: 'writable' })
  expect(rules?.rules?.['vitest/no-focused-tests']).toBe('error')

  const withTypeScript = await waltz({ ts: true, vitest: true })
  expect(configByName(withTypeScript, 'waltz/vitest/setup')?.files).toEqual([
    VITEST_JS_FILES,
    VITEST_TS_FILES,
  ])
})
