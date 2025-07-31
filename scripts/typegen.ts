import fs from 'node:fs/promises'

import { pluginsToRulesDTS } from 'eslint-typegen/core'

import {
  importImportsPlugin,
  importJsoncPlugin,
  importStylisticPlugin,
  importTypeScriptPlugin,
} from '../src/packages'

const plugins = {
  '@typescript-eslint': await importTypeScriptPlugin(),
  '@stylistic': await importStylisticPlugin(),
  'jsonc': await importJsoncPlugin(),
  'imports': await importImportsPlugin(),
}

const dts = await pluginsToRulesDTS(plugins, {
  includeAugmentation: false,
})

await fs.writeFile('src/typegen.d.ts', dts)
