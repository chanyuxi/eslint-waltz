import { ALL_SCRIPTS_FILES, JS_FILES, TS_FILES } from '../constants'
import {
  importReactDebugPlugin,
  importReactDomPlugin,
  importReactHookExtraPlugin,
  importReactNamingConventionPlugin, importReactPlugin,
  importReactWebApiPlugin,
} from '../packages'

import type { LinterConfig, ReactOptions } from '../types'

interface relativeOptions {
  isEnableTypeScript: boolean
}

export default async function reactConfig(
  options: boolean | ReactOptions = {},
  relative: relativeOptions,
): Promise<LinterConfig[]> {
  const resolvedConfig: ReactOptions = typeof options === 'boolean' ? {} : options

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

  return [
    {
      name: 'waltz/react/setup',
      files: ALL_SCRIPTS_FILES,
      plugins: {
        '@eslint-react': reactPlugin,
        '@eslint-react/dom': reactDomPlugin,
        '@eslint-react/web-api': reactWebApiPlugin,
        '@eslint-react/debug': reactDebugPlugin,
        '@eslint-react/hooks-extra': reactHookExtraPlugin,
        '@eslint-react/naming-convention': reactNamingConventionPlugin,
      },
    },
    {
      name: 'waltz/react/rules',
      files: resolvedConfig.files ?? [JS_FILES, TS_FILES],
      rules: {
        '@eslint-react/jsx-key-before-spread': 'warn',
        '@eslint-react/jsx-no-duplicate-props': relative.isEnableTypeScript ? 'off' : 'warn',
        '@eslint-react/jsx-uses-react': relative.isEnableTypeScript ? 'off' : 'warn',
        '@eslint-react/jsx-uses-vars': relative.isEnableTypeScript ? 'off' : 'warn',
        '@eslint-react/no-access-state-in-setstate': 'error',
        '@eslint-react/no-array-index-key': 'warn',
        '@eslint-react/no-children-count': 'warn',
        '@eslint-react/no-children-for-each': 'warn',
        '@eslint-react/no-children-map': 'warn',
        '@eslint-react/no-children-only': 'warn',
        '@eslint-react/no-children-to-array': 'warn',
        '@eslint-react/no-clone-element': 'warn',
        '@eslint-react/no-comment-textnodes': 'warn',
        '@eslint-react/no-component-will-mount': 'error',
        '@eslint-react/no-component-will-receive-props': 'error',
        '@eslint-react/no-component-will-update': 'error',
        '@eslint-react/no-context-provider': 'warn',
        '@eslint-react/no-create-ref': 'error',
        '@eslint-react/no-default-props': 'error',
        '@eslint-react/no-direct-mutation-state': 'error',
        '@eslint-react/no-duplicate-key': 'warn',
        '@eslint-react/no-forward-ref': 'warn',
        '@eslint-react/no-implicit-key': 'warn',
        '@eslint-react/no-missing-key': 'error',
        '@eslint-react/no-misused-capture-owner-stack': 'error',
        '@eslint-react/no-nested-component-definitions': 'error',
        '@eslint-react/no-nested-lazy-component-declarations': 'warn',
        '@eslint-react/no-prop-types': 'error',
        '@eslint-react/no-redundant-should-component-update': 'error',
        '@eslint-react/no-set-state-in-component-did-mount': 'warn',
        '@eslint-react/no-set-state-in-component-did-update': 'warn',
        '@eslint-react/no-set-state-in-component-will-update': 'warn',
        '@eslint-react/no-string-refs': 'error',
        '@eslint-react/no-unsafe-component-will-mount': 'warn',
        '@eslint-react/no-unsafe-component-will-receive-props': 'warn',
        '@eslint-react/no-unsafe-component-will-update': 'warn',
        '@eslint-react/no-unstable-context-value': 'warn',
        '@eslint-react/no-unstable-default-props': 'warn',
        '@eslint-react/no-unused-class-component-members': 'warn',
        '@eslint-react/no-unused-state': 'warn',
        '@eslint-react/no-use-context': 'warn',
        '@eslint-react/no-useless-forward-ref': 'warn',
        '@eslint-react/dom/no-dangerously-set-innerhtml': 'warn',
        '@eslint-react/dom/no-dangerously-set-innerhtml-with-children': 'error',
        '@eslint-react/dom/no-find-dom-node': 'error',
        '@eslint-react/dom/no-flush-sync': 'error',
        '@eslint-react/dom/no-hydrate': 'error',
        '@eslint-react/dom/no-missing-button-type': 'warn',
        '@eslint-react/dom/no-missing-iframe-sandbox': 'warn',
        '@eslint-react/dom/no-namespace': 'error',
        '@eslint-react/dom/no-render': 'error',
        '@eslint-react/dom/no-render-return-value': 'error',
        '@eslint-react/dom/no-script-url': 'warn',
        '@eslint-react/dom/no-unsafe-iframe-sandbox': 'warn',
        '@eslint-react/dom/no-unsafe-target-blank': 'warn',
        '@eslint-react/dom/no-use-form-state': 'error',
        '@eslint-react/dom/no-void-elements-with-children': 'error',
        '@eslint-react/web-api/no-leaked-event-listener': 'warn',
        '@eslint-react/web-api/no-leaked-interval': 'warn',
        '@eslint-react/web-api/no-leaked-resize-observer': 'warn',
        '@eslint-react/web-api/no-leaked-timeout': 'warn',
        '@eslint-react/hooks-extra/no-direct-set-state-in-use-effect': 'warn',
        '@eslint-react/hooks-extra/no-unnecessary-use-prefix': 'warn',
        '@eslint-react/hooks-extra/prefer-use-state-lazy-initialization': 'warn',
        '@eslint-react/naming-convention/context-name': 'warn',

        ...(relative.isEnableTypeScript
          ? {
              '@eslint-react/dom/no-unknown-property': 'off',
            }
          : {}),

      },
      settings: {
        'react-x': {
          version: 'detect',
          importSource: 'react',
          strict: true,
          skipImportCheck: true,
          polymorphicPropName: 'as',
          additionalComponents: [
          ],
          additionalHooks: {
            useEffect: [
              'useIsomorphicLayoutEffect',
            ],
            useLayoutEffect: [
              'useIsomorphicLayoutEffect',
            ],
          },
        },
      },
    },
  ]
}
