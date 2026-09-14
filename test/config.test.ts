import { ESLint } from 'eslint'
import assert from 'node:assert/strict'
import test from 'node:test'

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

  const jsonSetup = configByName(configured, 'waltz/jsonc/setup')
  assert.deepEqual(jsonSetup?.files, [
    'config/**/*.json',
    '**/package.json',
    '**/[jt]sconfig.json',
    '**/[jt]sconfig.*.json',
  ])
  assert.deepEqual(
    configByName(configured, 'waltz/jsonc/sort/package-json')?.files,
    ['**/package.json'],
  )
  assert.deepEqual(
    configByName(configured, 'waltz/jsonc/sort/tsconfig-json')?.files,
    ['**/[jt]sconfig.json', '**/[jt]sconfig.*.json'],
  )
})

test('script-only features do not match TypeScript unless enabled', async () => {
  const javascriptOnly = await waltz()
  const javascriptImportRules = configByName(
    javascriptOnly,
    'waltz/imports/rules',
  )
  assert.deepEqual(javascriptImportRules?.files, [JS_FILES])

  const withTypeScript = await waltz({ ts: true })
  const typescriptImportRules = configByName(
    withTypeScript,
    'waltz/imports/rules',
  )
  assert.deepEqual(typescriptImportRules?.files, [JS_FILES, TS_FILES])
})

test('imports are enabled by default and can be disabled', async () => {
  const defaults = await waltz()
  const setup = configByName(defaults, 'waltz/imports/setup')
  const defaultRules = configByName(defaults, 'waltz/imports/rules')

  assert.equal(setup?.plugins?.imports !== undefined, true)
  assert.notEqual(setup, undefined)
  assert.equal(defaultRules?.rules?.['imports/order'], undefined)

  const defaultEslint = new ESLint({
    overrideConfig: defaults,
    overrideConfigFile: true,
  })
  const defaultFileConfig = await defaultEslint.calculateConfigForFile(
    'src/example.js',
  )
  assert.equal(defaultFileConfig?.rules?.['imports/order'], undefined)

  const disabled = await waltz({ imports: false })
  assert.equal(configByName(disabled, 'waltz/imports/setup'), undefined)

  const withoutPerfectionist = await waltz({ perfectionist: false })
  const withoutPerfectionistEslint = new ESLint({
    overrideConfig: withoutPerfectionist,
    overrideConfigFile: true,
  })
  const withoutPerfectionistFileConfig
    = await withoutPerfectionistEslint.calculateConfigForFile(
      'src/example.js',
    )
  assert.notEqual(
    withoutPerfectionistFileConfig?.rules?.['imports/order'],
    undefined,
  )
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

  assert.notEqual(sourceConfig?.rules?.['perfectionist/sort-imports'], undefined)
  assert.equal(sourceConfig?.rules?.['imports/order'], undefined)
  assert.notEqual(scriptConfig?.rules?.['imports/order'], undefined)
  assert.equal(scriptConfig?.rules?.['perfectionist/sort-imports'], undefined)
})

test('Perfectionist uses recommended-alphabetical by default', async () => {
  const configs = await waltz()
  const setup = configByName(configs, 'waltz/perfectionist/setup')
  const rules = configByName(configs, 'waltz/perfectionist/rules')

  assert.equal(setup?.plugins?.perfectionist !== undefined, true)
  assert.notEqual(rules?.rules?.['perfectionist/sort-objects'], undefined)
  assert.notEqual(rules?.rules?.['perfectionist/sort-jsx-props'], undefined)
  assert.equal(rules?.rules?.['@stylistic/jsx-sort-props'], undefined)
})

test('Perfectionist recommended presets can be selected', async () => {
  const configs = await waltz({
    perfectionist: { preset: 'recommended-alphabetical' },
  })
  const rules = configByName(configs, 'waltz/perfectionist/rules')

  assert.notEqual(rules?.rules?.['perfectionist/sort-objects'], undefined)
  assert.notEqual(rules?.rules?.['perfectionist/sort-jsx-props'], undefined)
})

test('Perfectionist can be disabled', async () => {
  const configs = await waltz({ perfectionist: false })

  assert.equal(configByName(configs, 'waltz/perfectionist/setup'), undefined)
})

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

  assert.deepEqual(setup?.files, [JS_FILES])
  assert.equal(setup?.plugins?.tailwindcss !== undefined, true)
  assert.equal(rules?.rules?.['tailwindcss/classnames-order'], 'warn')
  assert.deepEqual(rules?.settings, {
    tailwindcss: { cssConfigPath: './src/styles.css' },
  })
})

test('Tailwind CSS is disabled by default', async () => {
  const configs = await waltz()

  assert.equal(configByName(configs, 'waltz/tailwindcss/setup'), undefined)
})

test('Tailwind CSS extends to TypeScript files when enabled', async () => {
  const configs = await waltz({ tailwindcss: true, ts: true })
  const setup = configByName(configs, 'waltz/tailwindcss/setup')

  assert.deepEqual(setup?.files, [JS_FILES, TS_FILES])
})

test('React TypeScript exceptions do not disable rules for JavaScript', async () => {
  const configs = await waltz({ react: true, ts: true })
  const reactRules = configByName(configs, 'waltz/react/rules')
  const reactTypeScriptRules = configByName(
    configs,
    'waltz/react/typescript-rules',
  )

  assert.equal(
    reactRules?.rules?.['@eslint-react/dom/no-unknown-property'],
    'warn',
  )
  assert.deepEqual(reactTypeScriptRules?.files, [TS_FILES])
  assert.equal(
    reactTypeScriptRules?.rules?.['@eslint-react/dom/no-unknown-property'],
    'off',
  )
})

test('TypeScript configuration parses TypeScript files', async () => {
  const eslint = new ESLint({
    overrideConfig: await waltz({ json: false, ts: true }),
    overrideConfigFile: true,
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
