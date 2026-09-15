import type { LinterConfig, ReactOptions } from '../types'

import { TS_FILES } from '../constants'
import {
  getScriptFiles,
  intersectFiles,
  resolveFiles,
  type ScriptScope,
} from '../internal/files'
import {
  importReactDebugPlugin,
  importReactDomPlugin,
  importReactHookExtraPlugin,
  importReactNamingConventionPlugin,
  importReactPlugin,
  importReactWebApiPlugin,
  importTypeScriptParser,
} from '../packages'

export default async function reactConfig(
  options: boolean | ReactOptions = {},
  scriptScope: ScriptScope,
): Promise<LinterConfig[]> {
  const [
    reactPlugin,
    reactDebugPlugin,
    reactDomPlugin,
    reactHookExtraPlugin,
    reactNamingConventionPlugin,
    reactWebApiPlugin,
  ] = await Promise.all([
    importReactPlugin(),
    importReactDebugPlugin(),
    importReactDomPlugin(),
    importReactHookExtraPlugin(),
    importReactNamingConventionPlugin(),
    importReactWebApiPlugin(),
  ] as const)

  const resolvedConfig: ReactOptions
    = typeof options === 'boolean' ? {} : options

  const scriptFiles = getScriptFiles(scriptScope)
  const ruleFiles = resolveFiles(resolvedConfig.files, scriptFiles)
  const setupFiles = ruleFiles

  const typeScriptRuleFiles = resolvedConfig.files
    ? intersectFiles(resolvedConfig.files, scriptScope.typeScriptFiles)
    : scriptScope.typeScriptFiles
  const customTypeScriptFiles = resolvedConfig.files
    && scriptScope.isEnableTypeScript
    && scriptScope.isCustomTypeScriptFiles
    ? intersectFiles(resolvedConfig.files, [TS_FILES])
    : []
  const typeScriptParser = customTypeScriptFiles.length > 0
    ? await importTypeScriptParser()
    : undefined
  const typeScriptSetup: LinterConfig[] = typeScriptParser
    ? [
        {
          files: customTypeScriptFiles,
          languageOptions: {
            parser: typeScriptParser,
          },
          name: 'waltz/react/typescript-setup',
        },
      ]
    : []

  const typeScriptRules: LinterConfig[] = typeScriptRuleFiles.length > 0
    ? [
        {
          files: typeScriptRuleFiles,
          name: 'waltz/react/typescript-rules',
          rules: {
            '@eslint-react/dom/no-unknown-property': 'off',
            ...resolvedConfig.overrides,
          },
        },
      ]
    : []

  const defaultSettings = {
    'react-x': {
      additionalComponents: [],
      additionalHooks: {
        useEffect: ['useIsomorphicLayoutEffect'],
        useLayoutEffect: ['useIsomorphicLayoutEffect'],
      },
      importSource: 'react',
      polymorphicPropName: 'as',
      skipImportCheck: true,
      strict: true,
      version: 'detect',
    },
  }
  const reactSettings = resolvedConfig.settings?.['react-x']
  const settings = {
    ...defaultSettings,
    ...resolvedConfig.settings,
    'react-x': {
      ...defaultSettings['react-x'],
      ...(typeof reactSettings === 'object' && reactSettings !== null
        ? reactSettings
        : {}),
    },
  }

  return [
    {
      files: setupFiles,
      name: 'waltz/react/setup',
      plugins: {
        '@eslint-react': reactPlugin,
        '@eslint-react/debug': reactDebugPlugin,
        '@eslint-react/dom': reactDomPlugin,
        '@eslint-react/hooks-extra': reactHookExtraPlugin,
        '@eslint-react/naming-convention': reactNamingConventionPlugin,
        '@eslint-react/web-api': reactWebApiPlugin,
      },
    },
    ...typeScriptSetup,
    {
      files: ruleFiles,
      name: 'waltz/react/rules',
      rules: {
        '@eslint-react/dom/no-dangerously-set-innerhtml': 'warn',
        '@eslint-react/dom/no-dangerously-set-innerhtml-with-children': 'error',
        '@eslint-react/dom/no-find-dom-node': 'error',
        '@eslint-react/dom/no-flush-sync': 'error',
        '@eslint-react/dom/no-hydrate': 'error',
        '@eslint-react/dom/no-missing-button-type': 'warn',
        '@eslint-react/dom/no-missing-iframe-sandbox': 'warn',
        '@eslint-react/dom/no-render': 'error',
        '@eslint-react/dom/no-render-return-value': 'error',
        '@eslint-react/dom/no-script-url': 'warn',
        '@eslint-react/dom/no-unknown-property': 'warn',
        '@eslint-react/dom/no-unsafe-iframe-sandbox': 'warn',
        '@eslint-react/dom/no-unsafe-target-blank': 'warn',
        '@eslint-react/dom/no-use-form-state': 'error',
        '@eslint-react/dom/no-void-elements-with-children': 'error',
        '@eslint-react/hooks-extra/no-direct-set-state-in-use-effect': 'warn',
        '@eslint-react/naming-convention/context-name': 'warn',
        '@eslint-react/no-access-state-in-setstate': 'error',
        '@eslint-react/no-array-index-key': 'warn',
        '@eslint-react/no-children-count': 'warn',
        '@eslint-react/no-children-for-each': 'warn',
        '@eslint-react/no-children-map': 'warn',
        '@eslint-react/no-children-only': 'warn',
        '@eslint-react/no-children-to-array': 'warn',
        '@eslint-react/no-clone-element': 'warn',
        '@eslint-react/no-component-will-mount': 'error',
        '@eslint-react/no-component-will-receive-props': 'error',
        '@eslint-react/no-component-will-update': 'error',
        '@eslint-react/no-context-provider': 'warn',
        '@eslint-react/no-create-ref': 'error',
        '@eslint-react/no-direct-mutation-state': 'error',
        '@eslint-react/no-duplicate-key': 'warn',
        '@eslint-react/no-forward-ref': 'warn',
        '@eslint-react/no-missing-key': 'error',
        '@eslint-react/no-misused-capture-owner-stack': 'error',
        '@eslint-react/no-nested-component-definitions': 'error',
        '@eslint-react/no-nested-lazy-component-declarations': 'warn',
        '@eslint-react/no-set-state-in-component-did-mount': 'warn',
        '@eslint-react/no-set-state-in-component-did-update': 'warn',
        '@eslint-react/no-set-state-in-component-will-update': 'warn',
        '@eslint-react/no-unsafe-component-will-mount': 'warn',
        '@eslint-react/no-unsafe-component-will-receive-props': 'warn',
        '@eslint-react/no-unsafe-component-will-update': 'warn',
        '@eslint-react/no-unstable-context-value': 'warn',
        '@eslint-react/no-unstable-default-props': 'warn',
        '@eslint-react/no-unused-class-component-members': 'warn',
        '@eslint-react/no-unused-state': 'warn',
        '@eslint-react/no-use-context': 'warn',
        '@eslint-react/web-api/no-leaked-event-listener': 'warn',
        '@eslint-react/web-api/no-leaked-interval': 'warn',
        '@eslint-react/web-api/no-leaked-resize-observer': 'warn',
        '@eslint-react/web-api/no-leaked-timeout': 'warn',
        ...resolvedConfig.overrides,
      },
      settings,
    },
    ...typeScriptRules,
  ]
}
