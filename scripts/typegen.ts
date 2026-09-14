import type { ESLint } from 'eslint'

import { pluginsToRulesDTS } from 'eslint-typegen/core'
import fs from 'node:fs/promises'

import {
  importImportXPlugin,
  importJsoncPlugin,
  importPerfectionistPlugin,
  importReactDebugPlugin,
  importReactDomPlugin,
  importReactHookExtraPlugin,
  importReactNamingConventionPlugin,
  importReactPlugin,
  importReactWebApiPlugin,
  importStylisticPlugin,
  importTailwindcssPlugin,
  importTypeScriptPlugin,
} from '../src/packages'

const pluginImporters: Record<string, () => Promise<ESLint.Plugin>> = {
  '@eslint-react': importReactPlugin,
  '@eslint-react/debug': importReactDebugPlugin,
  '@eslint-react/dom': importReactDomPlugin,
  '@eslint-react/hooks-extra': importReactHookExtraPlugin,
  '@eslint-react/naming-convention': importReactNamingConventionPlugin,
  '@eslint-react/web-api': importReactWebApiPlugin,
  '@stylistic': importStylisticPlugin,
  '@typescript-eslint': importTypeScriptPlugin,
  'imports': importImportXPlugin,
  'jsonc': importJsoncPlugin,
  'perfectionist': importPerfectionistPlugin,
  'tailwindcss': importTailwindcssPlugin,
}

const plugins: Record<string, ESLint.Plugin> = {}

for (const [name, importer] of Object.entries(pluginImporters)) {
  plugins[name] = await importer()
}

const dts = await pluginsToRulesDTS(plugins, {
  includeAugmentation: false,
})

await fs.writeFile('src/typegen.d.ts', dts)
