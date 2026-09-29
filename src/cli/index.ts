#!/usr/bin/env node

import process from 'node:process'

import { runCli } from './program'

runCli(process.argv.slice(2)).then(
  (exitCode) => {
    process.exitCode = exitCode
  },
  (error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  },
)
