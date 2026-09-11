#!/usr/bin/env node

import process from 'node:process'

import { syncVSCodeSettings } from './vscode'

async function main() {
  const [command] = process.argv.slice(2)

  if (command === '--help' || command === '-h') {
    printHelp()
    return
  }

  if (command !== 'sync-vscode') {
    printHelp()
    process.exitCode = 1
    return
  }

  const result = await syncVSCodeSettings()
  console.log(
    result.changed
      ? `Updated ${result.filePath}`
      : `${result.filePath} is already synchronized`,
  )
}

function printHelp() {
  console.log(`Usage: eslint-waltz <command>

Commands:
  sync-vscode  Create or update .vscode/settings.json for ESLint fix-on-save
`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
