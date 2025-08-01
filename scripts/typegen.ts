import fs from 'node:fs/promises'

import { pluginsToRulesDTS } from 'eslint-typegen/core'

import {
  importImportsPlugin,
  importJsoncPlugin,
  importReactDebugPlugin,
  importReactDomPlugin,
  importReactHookExtraPlugin,
  importReactNamingConventionPlugin,
  importReactPlugin,
  importReactWebApiPlugin,
  importStylisticPlugin,
  importTypeScriptPlugin,
} from '../src/packages'

import type { ESLint } from 'eslint'

const pluginImporters: Record<string, () => Promise<ESLint.Plugin>> = {
  '@typescript-eslint': importTypeScriptPlugin,
  '@stylistic': importStylisticPlugin,
  'jsonc': importJsoncPlugin,
  'imports': importImportsPlugin,
  '@eslint-react': importReactPlugin,
  '@eslint-react/dom': importReactDomPlugin,
  '@eslint-react/web-api': importReactWebApiPlugin,
  '@eslint-react/debug': importReactDebugPlugin,
  '@eslint-react/hooks-extra': importReactHookExtraPlugin,
  '@eslint-react/naming-convention': importReactNamingConventionPlugin,
}

const plugins: Record<string, ESLint.Plugin> = {
}

for (const [name, importer] of Object.entries(pluginImporters)) {
  plugins[name] = await importer()
}

const dts = await pluginsToRulesDTS(plugins, {
  includeAugmentation: false,
})

await fs.writeFile('src/typegen.d.ts', dts)
