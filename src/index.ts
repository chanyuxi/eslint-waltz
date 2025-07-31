import ignoreConfig from './configs/gitignore'
import importsConfig from './configs/imports'
import jsConfig from './configs/js'
import jsoncConfig from './configs/jsonc'
import stylisticConfig from './configs/stylistic'
import tsConfig from './configs/ts'

import type { LinterConfig, WaltzOptions } from './types'

async function waltz(options: WaltzOptions = {}, ...orders: LinterConfig[]) {
  const config: LinterConfig[] = []

  if (options.gitignore) {
    config.push(await ignoreConfig(options.gitignore))
  }

  config.push(
    await stylisticConfig(options.stylistic),
    jsConfig(options.js),
    ...(await jsoncConfig()),
  )

  if (options.ts) {
    config.push(...(await tsConfig(options.ts)))
  }

  if (options.imports) {
    config.push(await importsConfig())
  }

  return [...config, ...orders]
}

export { waltz as default }
