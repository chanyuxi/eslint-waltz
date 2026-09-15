import { ESLint } from 'eslint'
import { expect, test } from 'vitest'

import waltz from '../src'
import {
  JS_FILES,
  TS_FILES,
} from '../src/constants'

import { configByName } from './helpers'

test('script-only features do not match TypeScript unless enabled', async () => {
  const javascriptOnly = await waltz()
  const javascriptImportRules = configByName(
    javascriptOnly,
    'waltz/imports/rules',
  )
  expect(javascriptImportRules?.files).toEqual([JS_FILES])

  const withTypeScript = await waltz({ ts: true })
  const typescriptImportRules = configByName(
    withTypeScript,
    'waltz/imports/rules',
  )
  expect(typescriptImportRules?.files).toEqual([JS_FILES, TS_FILES])
})

test('custom TypeScript files limit dependent module scopes', async () => {
  const typeScriptFiles = ['src/**/*.ts']
  const configs = await waltz({
    react: true,
    tailwindcss: true,
    ts: { files: typeScriptFiles },
    vitest: true,
  })
  const scriptFiles = [JS_FILES, ...typeScriptFiles]

  expect(configByName(configs, 'waltz/react/rules')?.files).toEqual(scriptFiles)
  expect(
    configByName(configs, 'waltz/react/typescript-rules')?.files,
  ).toEqual(typeScriptFiles)

  const eslint = new ESLint({
    overrideConfig: configs,
    overrideConfigFile: true,
  })
  const inScope = await eslint.calculateConfigForFile('src/example.test.ts')
  const outOfScope = await eslint.calculateConfigForFile('tests/example.test.ts')

  expect(inScope?.rules?.['vitest/no-focused-tests']).toBeDefined()
  expect(outOfScope?.rules?.['vitest/no-focused-tests']).toBeUndefined()

  const reactEslint = new ESLint({
    overrideConfig: await waltz({
      react: { files: ['ui/**/*.tsx'] },
      ts: { files: typeScriptFiles },
    }),
    overrideConfigFile: true,
  })
  const [reactResult] = await reactEslint.lintText(
    'const Component: string = <div />\n',
    { filePath: 'ui/Component.tsx' },
  )

  expect(
    reactResult.messages.some(message => message.message.startsWith('Parsing error:')),
  ).toBe(false)
})

test('TypeScript configuration parses TypeScript files', async () => {
  const eslint = new ESLint({
    overrideConfig: await waltz({ json: false, ts: true }),
    overrideConfigFile: true,
  })
  const [result] = await eslint.lintText('var value: string = \'ok\'\n', {
    filePath: 'sample.ts',
  })

  expect(
    result.messages.some(message =>
      message.message.startsWith('Parsing error:'),
    ),
  ).toBe(false)
  expect(result.messages.some(message => message.ruleId === 'no-var')).toBe(true)
})
