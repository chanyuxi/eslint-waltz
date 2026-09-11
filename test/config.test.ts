import assert from 'node:assert/strict'
import test from 'node:test'

import { ESLint } from 'eslint'

import waltz from '../src'
import { JS_FILES, TS_FILES } from '../src/constants'

function configByName(
  configs: Awaited<ReturnType<typeof waltz>>,
  name: string,
) {
  return configs.find(config => config.name === name)
}

test('json can be disabled and configured', async () => {
  const defaults = await waltz()
  assert.notEqual(configByName(defaults, 'waltz/jsonc/setup'), undefined)

  const disabled = await waltz({ json: false })
  assert.equal(configByName(disabled, 'waltz/jsonc/setup'), undefined)

  const configured = await waltz({
    json: {
      files: ['config/**/*.json'],
      overrides: {
        'jsonc/quotes': 'off',
      },
    },
  })
  const jsonRules = configByName(configured, 'waltz/jsonc/rules')

  assert.deepEqual(jsonRules?.files, ['config/**/*.json'])
  assert.equal(jsonRules?.rules?.['jsonc/quotes'], 'off')
})

test('script-only features do not match TypeScript unless enabled', async () => {
  const javascriptOnly = await waltz({ imports: true })
  const javascriptImportRules = configByName(
    javascriptOnly,
    'waltz/imports/rules',
  )
  assert.deepEqual(javascriptImportRules?.files, [JS_FILES])

  const withTypeScript = await waltz({ imports: true, ts: true })
  const typescriptImportRules = configByName(
    withTypeScript,
    'waltz/imports/rules',
  )
  assert.deepEqual(typescriptImportRules?.files, [JS_FILES, TS_FILES])
})

test('React TypeScript exceptions do not disable rules for JavaScript', async () => {
  const configs = await waltz({ react: true, ts: true })
  const reactRules = configByName(configs, 'waltz/react/rules')
  const reactTypeScriptRules = configByName(
    configs,
    'waltz/react/typescript-rules',
  )

  assert.equal(reactRules?.rules?.['@eslint-react/jsx-uses-vars'], 'warn')
  assert.deepEqual(reactTypeScriptRules?.files, [TS_FILES])
  assert.equal(
    reactTypeScriptRules?.rules?.['@eslint-react/jsx-uses-vars'],
    'off',
  )
})

test('TypeScript configuration parses TypeScript files', async () => {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: await waltz({ json: false, ts: true }),
  })
  const [result] = await eslint.lintText('var value: string = \'ok\'\n', {
    filePath: 'sample.ts',
  })

  assert.equal(
    result.messages.some(message =>
      message.message.startsWith('Parsing error:'),
    ),
    false,
  )
  assert.equal(result.messages.some(message => message.ruleId === 'no-var'), true)
})
