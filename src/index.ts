import {
  ignoreConfig,
  importsConfig,
  jsConfig,
  jsoncConfig,
  reactConfig,
  stylisticConfig,
  tsConfig,
} from './configs'

import type { LinterConfig, UnresolvedLinterConfig, WaltzOptions } from './types'

async function waltz(options: WaltzOptions = {}, ...orders: LinterConfig[]) {
  const isEnableTypeScript = !!options.ts
  const isEnableReact = !!options.react

  const configs: UnresolvedLinterConfig[] = []

  if (options.gitignore) {
    configs.push(ignoreConfig(options.gitignore))
  }

  // These configurations are mandatory to enable
  configs.push(
    jsConfig(options.js, {
      isEnableReact,
    }),
    stylisticConfig(options.stylistic),
    jsoncConfig(),
  )

  if (isEnableTypeScript) {
    configs.push(tsConfig(options.ts))
  }

  if (options.imports) {
    configs.push(importsConfig())
  }

  if (isEnableReact) {
    configs.push(reactConfig(options.react, {
      isEnableTypeScript,
    }))
  }

  const resolvedConfigs = (await Promise.all(configs.flat(Infinity))).flat(Infinity)

  return [
    ...resolvedConfigs,
    ...orders,
  ]
}

export { waltz as default }
