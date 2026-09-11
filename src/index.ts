import {
  gitignoreConfig,
  importsConfig,
  jsConfig,
  jsoncConfig,
  reactConfig,
  stylisticConfig,
  tsConfig,
} from './configs'

import type {
  LinterConfig,
  UnresolvedLinterConfig,
  WaltzOptions,
} from './types'

async function waltz(
  options: WaltzOptions = {},
  ...orders: LinterConfig[]
): Promise<LinterConfig[]> {
  const isEnableTypeScript = !!options.ts
  const isEnableReact = !!options.react

  const configs: UnresolvedLinterConfig[] = []

  if (options.gitignore) {
    configs.push(gitignoreConfig(options.gitignore))
  }

  // These configurations are mandatory to enable
  configs.push(
    jsConfig(options.js, {
      isEnableReact,
    }),
    stylisticConfig(options.stylistic, {
      isEnableTypeScript,
    }),
  )

  if (options.json !== false) {
    configs.push(
      jsoncConfig(
        options.json === true || options.json === undefined ? {} : options.json,
      ),
    )
  }

  if (isEnableTypeScript) {
    configs.push(tsConfig(options.ts))
  }

  if (options.imports) {
    configs.push(
      importsConfig(
        isEnableTypeScript,
        options.imports === true ? {} : options.imports,
      ),
    )
  }

  if (isEnableReact) {
    configs.push(
      reactConfig(options.react, {
        isEnableTypeScript,
      }),
    )
  }

  const resolvedConfigs = (await Promise.all(configs)).flat()

  return [...resolvedConfigs, ...orders]
}

export type {
  ImportsOptions,
  JsoncOptions,
  JsOptions,
  LinterConfig,
  ReactOptions,
  SharedOptions,
  StylisticOptions,
  TsOptions,
  UnresolvedLinterConfig,
  WaltzOptions,
} from './types'

export default waltz
