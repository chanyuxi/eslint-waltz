import { ESLint } from 'eslint'
import { expect, test } from 'vitest'

import waltz from '../src'
import {
  JS_FILES,
  TS_FILES,
  VITEST_JS_FILES,
  VITEST_TS_FILES,
} from '../src/constants'

function configByName(
  configs: Awaited<ReturnType<typeof waltz>>,
  name: string,
) {
  return configs.find(config => config.name === name)
}

test('json can be disabled and configured', async () => {
  const defaults = await waltz()
  expect(configByName(defaults, 'waltz/jsonc/setup')).not.toBeUndefined()

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

test('imports are enabled by default and can be disabled', async () => {
  const defaults = await waltz()
  const setup = configByName(defaults, 'waltz/imports/setup')
  const defaultRules = configByName(defaults, 'waltz/imports/rules')

  expect(setup?.plugins?.imports).toBeDefined()
  expect(setup).toBeDefined()
  expect(defaultRules?.rules?.['imports/order']).toBeUndefined()

  const defaultEslint = new ESLint({
    overrideConfig: defaults,
    overrideConfigFile: true,
  })
  const defaultFileConfig = await defaultEslint.calculateConfigForFile(
    'src/example.js',
  )
  expect(defaultFileConfig?.rules?.['imports/order']).toBeUndefined()

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
  expect(sourceConfig?.rules?.['imports/order']).toBeUndefined()
  expect(scriptConfig?.rules?.['imports/order']).toBeDefined()
  expect(scriptConfig?.rules?.['perfectionist/sort-imports']).toBeUndefined()
})

test('Vitest rules can be enabled for test files', async () => {
  const defaults = await waltz()
  expect(configByName(defaults, 'waltz/vitest/setup')).toBeUndefined()

  const configs = await waltz({ vitest: true })
  const setup = configByName(configs, 'waltz/vitest/setup')
  const rules = configByName(configs, 'waltz/vitest/rules')

  expect(setup?.files).toEqual([VITEST_JS_FILES])
  expect(setup?.plugins?.vitest).toBeDefined()
  expect(setup?.languageOptions?.globals?.describe).toBe('writable')
  expect(rules?.rules?.['vitest/no-focused-tests']).toBe('error')

  const withTypeScript = await waltz({ ts: true, vitest: true })
  expect(configByName(withTypeScript, 'waltz/vitest/setup')?.files).toEqual([
    VITEST_JS_FILES,
    VITEST_TS_FILES,
  ])
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
