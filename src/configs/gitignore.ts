import type { FlatGitignoreOptions } from 'eslint-config-flat-gitignore'

import type { LinterConfig } from '../types'

import { importGitignoreSeek } from '../packages'

export default async function gitignore(
  enable: boolean | FlatGitignoreOptions,
): Promise<LinterConfig> {
  return (await importGitignoreSeek())({
    name: 'waltz/gitignore/setup',
    ...(enable === true ? { strict: true } : enable),
  })
}
