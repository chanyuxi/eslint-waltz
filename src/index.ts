import type {
  LinterConfig,
  UnresolvedLinterConfig,
  WaltzOptions,
} from './types'

import {
  gitignoreConfig,
  importsConfig,
  jsConfig,
  jsoncConfig,
  perfectionistConfig,
  reactConfig,
  stylisticConfig,
  tailwindcssConfig,
  tsConfig,
  vitestConfig,
} from './configs'
import { resolveFileScopes } from './internal/files'

async function waltz(
  options: WaltzOptions = {},
  ...orders: LinterConfig[]
): Promise<LinterConfig[]> {
  const isEnableTypeScript = !!options.ts
  const isEnableReact = !!options.react

  const { scriptScope } = resolveFileScopes(options)

  const configs: UnresolvedLinterConfig[] = []

  if (options.gitignore) {
    configs.push(gitignoreConfig(options.gitignore))
  }

  // These configurations are mandatory to enable
  configs.push(
    jsConfig(options.js, {
      isEnableReact,
    }),
    stylisticConfig(options.stylistic, scriptScope),
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

  if (options.imports !== false) {
    configs.push(
      importsConfig(
        scriptScope,
        options.imports === true || options.imports === undefined
          ? {}
          : options.imports,
      ),
    )
  }

  if (isEnableReact) {
    configs.push(
      reactConfig(options.react, scriptScope),
    )
  }

  if (options.perfectionist !== false) {
    configs.push(
      perfectionistConfig(
        options.perfectionist === true ? {} : options.perfectionist,
        scriptScope,
      ),
    )
  }

  if (options.tailwindcss) {
    configs.push(
      tailwindcssConfig(
        options.tailwindcss === true ? {} : options.tailwindcss,
        scriptScope,
      ),
    )
  }

  if (options.vitest) {
    configs.push(
      vitestConfig(
        options.vitest === true ? {} : options.vitest,
        scriptScope,
      ),
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
  PerfectionistOptions,
  PerfectionistPreset,
  ReactOptions,
  SharedOptions,
  StylisticOptions,
  TailwindcssOptions,
  TsOptions,
  UnresolvedLinterConfig,
  VitestOptions,
  WaltzOptions,
} from './types'

export default waltz
