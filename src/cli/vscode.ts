import type { ParseError } from 'jsonc-parser'

import { applyEdits, modify, parse } from 'jsonc-parser'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const managedSettings = [
  { path: ['prettier.enable'], value: false },
  { path: ['editor.formatOnSave'], value: false },
  {
    path: ['editor.codeActionsOnSave', 'source.fixAll.eslint'],
    value: 'explicit',
  },
]

export interface SyncVSCodeSettingsResult {
  changed: boolean
  filePath: string
}

export async function syncVSCodeSettings(
  cwd: string = process.cwd(),
): Promise<SyncVSCodeSettingsResult> {
  const vscodeDirectory = join(cwd, '.vscode')
  const filePath = join(vscodeDirectory, 'settings.json')

  let originalSource: string | undefined
  try {
    originalSource = await readFile(filePath, 'utf8')
  }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error
    }
  }

  let source = originalSource?.trim() === '' ? '{}\n' : originalSource ?? '{}\n'
  const parseErrors: ParseError[] = []
  const settings = parse(source, parseErrors)

  if (
    parseErrors.length > 0
    || settings === null
    || typeof settings !== 'object'
    || Array.isArray(settings)
  ) {
    throw new Error(`Unable to parse ${filePath} as a VS Code settings object.`)
  }

  const eol = source.includes('\r\n') ? '\r\n' : '\n'
  const formattingOptions = {
    eol,
    insertSpaces: true,
    tabSize: 2,
  }

  for (const setting of managedSettings) {
    source = applyEdits(
      source,
      modify(source, setting.path, setting.value, { formattingOptions }),
    )
  }

  if (!source.endsWith(eol)) {
    source += eol
  }

  const changed = originalSource !== source
  if (changed) {
    await mkdir(vscodeDirectory, { recursive: true })
    await writeFile(filePath, source, 'utf8')
  }

  return { changed, filePath }
}
