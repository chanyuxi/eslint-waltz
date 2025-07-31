import { importGitignoreSeek } from '../packages'

import type { LinterConfig } from '../types'
import type { FlatGitignoreOptions } from 'eslint-config-flat-gitignore'

export default async function gitignore(
  enable: boolean | FlatGitignoreOptions,
): Promise<LinterConfig> {
  return (await importGitignoreSeek())({
    name: 'waltz/gitignore/setup',
    ...(enable === true
      ? { strict: true }
      : enable),
  })
}
