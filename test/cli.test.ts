import type { InitPrompts } from '../src/cli/init'
import type { PackageMetadata } from '../src/cli/package'

import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Writable } from 'node:stream'

import { parse } from 'jsonc-parser'
import { expect, test, vi } from 'vitest'

import { runCli } from '../src/cli/program'

const metadata: PackageMetadata = {
  devDependencies: {
    jiti: '^2.7.0',
    typescript: '^5.8.3',
    vitest: '^4.0.18',
  },
  name: '@chanyuxi/eslint-waltz',
  peerDependencies: {
    '@vitest/eslint-plugin': '^1.6.27',
    'eslint': '^10.10.0',
    'eslint-config-flat-gitignore': '^2.4.0',
    'eslint-plugin-import-x': '^4.17.1',
    'eslint-plugin-jsonc': '^3.4.2',
    'eslint-plugin-perfectionist': '^5.11.0',
    'eslint-plugin-react-debug': '^5.19.0',
    'eslint-plugin-react-dom': '^5.19.0',
    'eslint-plugin-react-hooks-extra': '^2.13.0',
    'eslint-plugin-react-naming-convention': '^5.19.0',
    'eslint-plugin-react-web-api': '^5.19.0',
    'eslint-plugin-react-x': '^5.19.0',
    'jsonc-eslint-parser': '^3.3.0',
    'typescript-eslint': '^8.70.0',
  },
  version: '1.4.0',
}

test('only exposes the version and init commands', async () => {
  const versionOutput = createOutput()
  const helpOutput = createOutput()

  expect(await runCli(['version'], { metadata, output: versionOutput.stream }))
    .toBe(0)
  expect(versionOutput.read()).toBe('1.4.0\n')

  expect(await runCli(['sync-vscode'], { output: helpOutput.stream })).toBe(1)
  expect(helpOutput.read()).toContain('version')
  expect(helpOutput.read()).toContain('init')
  expect(helpOutput.read()).not.toContain('sync-vscode')
})

test('initializes the config, dependencies, and VS Code settings', async () => {
  const cwd = await mkdtemp(join(tmpdir(), 'eslint-waltz-'))
  const installed: string[][] = []
  let initialFeatures: string[] = []
  let initialPackageManager = ''

  try {
    await writeFile(
      join(cwd, 'package.json'),
      JSON.stringify({
        dependencies: {
          react: '^19.0.0',
          typescript: '^5.8.3',
          vitest: '^4.0.18',
        },
        packageManager: 'pnpm@10.4.1',
      }),
    )
    await writeFile(join(cwd, '.gitignore'), 'node_modules\n')
    await mkdir(join(cwd, '.vscode'))
    await writeFile(
      join(cwd, '.vscode', 'settings.json'),
      '{\n  // keep\n  "files.trimTrailingWhitespace": true\n}\n',
    )

    const prompts = createPrompts({
      confirm: async () => true,
      multiselect: async (_message, _choices, initial) => {
        initialFeatures = initial
        return [
          'json',
          'perfectionist',
          'typescript',
          'react',
          'gitignore',
          'vitest',
        ]
      },
      select: async (message, _choices, initial) => {
        if (message.startsWith('Which package manager')) {
          initialPackageManager = initial
          return initial
        }

        return 'recommended-natural'
      },
    })

    await runCli(['init'], {
      cwd,
      install: async (_packageManager, dependencies) => {
        installed.push(dependencies)
      },
      metadata,
      prompts,
    })

    expect(initialFeatures).toEqual([
      'json',
      'imports',
      'perfectionist',
      'typescript',
      'react',
      'gitignore',
      'vitest',
    ])
    expect(initialPackageManager).toBe('pnpm')
    expect(await readFile(join(cwd, 'eslint.config.ts'), 'utf8')).toBe(
      `import waltz from '@chanyuxi/eslint-waltz'

export default waltz({
  gitignore: true,
  imports: false,
  perfectionist: { preset: 'recommended-natural' },
  react: true,
  ts: true,
  vitest: true,
})
`,
    )
    expect(installed).toHaveLength(1)
    expect(installed[0]).toContain('jiti@^2.7.0')
    expect(installed[0]).toContain('@chanyuxi/eslint-waltz@1.4.0')
    expect(installed[0]).toContain('@vitest/eslint-plugin@^1.6.27')
    expect(installed[0]).not.toContain('typescript@^5.8.3')
    expect(installed[0]).not.toContain('vitest@^4.0.18')

    const settings = parse(
      await readFile(join(cwd, '.vscode', 'settings.json'), 'utf8'),
    )
    expect(settings['editor.codeActionsOnSave']['source.fixAll.eslint'])
      .toBe('explicit')
    expect(settings['files.trimTrailingWhitespace']).toBe(true)
  }
  finally {
    await rm(cwd, { force: true, recursive: true })
  }
})

test('preserves an existing config when replacement is declined', async () => {
  const cwd = await mkdtemp(join(tmpdir(), 'eslint-waltz-'))

  try {
    await writeFile(join(cwd, 'package.json'), '{}')
    await writeFile(join(cwd, 'eslint.config.js'), 'export default []\n')
    const prompts = createPrompts({ confirm: async () => false })

    await runCli(['init'], { cwd, metadata, prompts })

    expect(await readFile(join(cwd, 'eslint.config.js'), 'utf8'))
      .toBe('export default []\n')
    await expect(readFile(join(cwd, 'eslint.config.ts'), 'utf8'))
      .rejects.toMatchObject({ code: 'ENOENT' })
  }
  finally {
    await rm(cwd, { force: true, recursive: true })
  }
})

function createOutput() {
  let source = ''
  const stream = new Writable({
    write(chunk, _encoding, callback) {
      source += chunk.toString()
      callback()
    },
  })

  return { read: () => source, stream }
}

function createPrompts(overrides: Partial<InitPrompts> = {}): InitPrompts {
  return {
    cancel: vi.fn(),
    confirm: vi.fn(async () => true),
    intro: vi.fn(),
    multiselect: vi.fn(async () => ['json', 'imports', 'perfectionist']),
    note: vi.fn(),
    outro: vi.fn(),
    select: vi.fn(async (_message, _choices, initial) => initial),
    ...overrides,
  }
}
