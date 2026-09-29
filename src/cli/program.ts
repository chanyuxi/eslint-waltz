import type { InitPrompts, InitRuntime } from './init'
import type { PackageMetadata } from './package'
import type { Readable, Writable } from 'node:stream'

import process from 'node:process'

import { runInit } from './init'
import { readPackageMetadata } from './package'

interface CliRuntime {
  cwd?: string
  input?: Readable
  install?: InitRuntime['install']
  metadata?: PackageMetadata
  output?: Writable
  prompts?: InitPrompts
}

export async function runCli(
  args: string[],
  runtime: CliRuntime = {},
): Promise<number> {
  const output = runtime.output ?? process.stdout
  const [command, ...rest] = args

  if ((command === '--help' || command === '-h') && rest.length === 0) {
    printHelp(output)
    return 0
  }

  if (command === 'version' && rest.length === 0) {
    const metadata = runtime.metadata ?? await readPackageMetadata()
    output.write(`${metadata.version}\n`)
    return 0
  }

  if (command === 'init' && rest.length === 0) {
    const metadata = runtime.metadata ?? await readPackageMetadata()
    await runInit({
      cwd: runtime.cwd,
      input: runtime.input,
      install: runtime.install,
      metadata,
      output,
      prompts: runtime.prompts,
    })
    return 0
  }

  printHelp(output)
  return 1
}

function printHelp(output: Writable): void {
  output.write(`Usage: eslint-waltz <command>

Commands:
  version  Display the installed eslint-waltz version
  init     Interactively create eslint.config.ts
`)
}
