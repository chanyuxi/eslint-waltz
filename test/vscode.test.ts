import { parse } from 'jsonc-parser'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect, test } from 'vitest'

import { syncVSCodeSettings } from '../src/cli/vscode'

test('syncs and preserves VS Code settings', async () => {
  const cwd = await mkdtemp(join(tmpdir(), 'eslint-waltz-'))

  try {
    await mkdir(join(cwd, '.vscode'), { recursive: true })
    await writeFile(
      join(cwd, '.vscode', 'settings.json'),
      `{
  // Keep unrelated settings and comments.
  "files.trimTrailingWhitespace": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": "explicit"
  }
}\n`,
      'utf8',
    )

    const first = await syncVSCodeSettings(cwd)
    const source = await readFile(join(cwd, '.vscode', 'settings.json'), 'utf8')
    const settings = parse(source)

    expect(first.changed).toBe(true)
    expect(settings['prettier.enable']).toBe(false)
    expect(settings['editor.formatOnSave']).toBe(false)
    expect(
      settings['editor.codeActionsOnSave']['source.fixAll.eslint'],
    ).toBe('explicit')
    expect(
      settings['editor.codeActionsOnSave']['source.organizeImports'],
    ).toBe('explicit')
    expect(settings['files.trimTrailingWhitespace']).toBe(true)
    expect(source).toMatch(/Keep unrelated settings and comments/)

    const second = await syncVSCodeSettings(cwd)
    expect(second.changed).toBe(false)
  }
  finally {
    await rm(cwd, { force: true, recursive: true })
  }
})

test('creates missing VS Code settings', async () => {
  const cwd = await mkdtemp(join(tmpdir(), 'eslint-waltz-'))

  try {
    const result = await syncVSCodeSettings(cwd)
    const source = await readFile(join(cwd, '.vscode', 'settings.json'), 'utf8')

    expect(result.changed).toBe(true)
    expect(parse(source)).toEqual({
      'editor.codeActionsOnSave': {
        'source.fixAll.eslint': 'explicit',
      },
      'editor.formatOnSave': false,
      'prettier.enable': false,
    })
  }
  finally {
    await rm(cwd, { force: true, recursive: true })
  }
})
