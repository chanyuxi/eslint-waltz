import assert from 'node:assert/strict'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

import { parse } from 'jsonc-parser'

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

    assert.equal(first.changed, true)
    assert.equal(settings['prettier.enable'], false)
    assert.equal(settings['editor.formatOnSave'], false)
    assert.equal(
      settings['editor.codeActionsOnSave']['source.fixAll.eslint'],
      'explicit',
    )
    assert.equal(
      settings['editor.codeActionsOnSave']['source.organizeImports'],
      'explicit',
    )
    assert.equal(settings['files.trimTrailingWhitespace'], true)
    assert.match(source, /Keep unrelated settings and comments/)

    const second = await syncVSCodeSettings(cwd)
    assert.equal(second.changed, false)
  }
  finally {
    await rm(cwd, { recursive: true, force: true })
  }
})

test('creates missing VS Code settings', async () => {
  const cwd = await mkdtemp(join(tmpdir(), 'eslint-waltz-'))

  try {
    const result = await syncVSCodeSettings(cwd)
    const source = await readFile(join(cwd, '.vscode', 'settings.json'), 'utf8')

    assert.equal(result.changed, true)
    assert.deepEqual(parse(source), {
      'prettier.enable': false,
      'editor.formatOnSave': false,
      'editor.codeActionsOnSave': {
        'source.fixAll.eslint': 'explicit',
      },
    })
  }
  finally {
    await rm(cwd, { recursive: true, force: true })
  }
})
