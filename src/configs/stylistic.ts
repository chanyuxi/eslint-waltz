import { ALL_SCRIPTS_FILES, JS_FILES } from '../constants'
import { importStylisticPlugin } from '../packages'

import type { LinterConfig, StylisticOptions } from '../types'

interface RelativeOptions {
  isEnableTypeScript: boolean
}

export default async function stylisticConfig(
  options: StylisticOptions = {},
  relative: RelativeOptions,
): Promise<LinterConfig[]> {
  const eslintStylistic = await importStylisticPlugin()
  const scriptFiles = relative.isEnableTypeScript
    ? ALL_SCRIPTS_FILES
    : [JS_FILES]

  // Directly use the generated recommendation rules
  const configs = eslintStylistic.configs.customize()

  // This will enable the following rules.
  // '@stylistic/array-bracket-spacing'
  // '@stylistic/arrow-parens'
  // '@stylistic/arrow-spacing'
  // '@stylistic/block-spacing'
  // '@stylistic/brace-style'
  // '@stylistic/comma-dangle'
  // '@stylistic/comma-spacing'
  // '@stylistic/comma-style'
  // '@stylistic/computed-property-spacing'
  // '@stylistic/dot-location'
  // '@stylistic/eol-last'
  // '@stylistic/generator-star-spacing'
  // '@stylistic/indent'
  // '@stylistic/indent-binary-ops'
  // '@stylistic/key-spacing'
  // '@stylistic/keyword-spacing'
  // '@stylistic/lines-between-class-members'
  // '@stylistic/max-statements-per-line'
  // '@stylistic/member-delimiter-style'
  // '@stylistic/multiline-ternary'
  // '@stylistic/new-parens'
  // '@stylistic/no-extra-parens'
  // '@stylistic/no-floating-decimal'
  // '@stylistic/no-mixed-operators'
  // '@stylistic/no-mixed-spaces-and-tabs'
  // '@stylistic/no-multi-spaces'
  // '@stylistic/no-multiple-empty-lines'
  // '@stylistic/no-tabs'
  // '@stylistic/no-trailing-spaces'
  // '@stylistic/no-whitespace-before-property'
  // '@stylistic/object-curly-spacing'
  // '@stylistic/operator-linebreak'
  // '@stylistic/padded-blocks'
  // '@stylistic/quote-props'
  // '@stylistic/quotes'
  // '@stylistic/rest-spread-spacing'
  // '@stylistic/semi'
  // '@stylistic/semi-spacing'
  // '@stylistic/space-before-blocks'
  // '@stylistic/space-before-function-paren'
  // '@stylistic/space-in-parens'
  // '@stylistic/space-infix-ops'
  // '@stylistic/space-unary-ops'
  // '@stylistic/spaced-comment'
  // '@stylistic/template-curly-spacing'
  // '@stylistic/template-tag-spacing'
  // '@stylistic/type-annotation-spacing'
  // '@stylistic/type-generic-spacing'
  // '@stylistic/type-named-tuple-spacing'
  // '@stylistic/wrap-iife'
  // '@stylistic/yield-star-spacing'
  // '@stylistic/jsx-closing-bracket-location'
  // '@stylistic/jsx-closing-tag-location'
  // '@stylistic/jsx-curly-brace-presence'
  // '@stylistic/jsx-curly-newline'
  // '@stylistic/jsx-curly-spacing'
  // '@stylistic/jsx-equals-spacing'
  // '@stylistic/jsx-first-prop-new-line'
  // '@stylistic/jsx-function-call-newline'
  // '@stylistic/jsx-indent-props'
  // '@stylistic/jsx-max-props-per-line'
  // '@stylistic/jsx-one-expression-per-line'
  // '@stylistic/jsx-quotes'
  // '@stylistic/jsx-tag-spacing'
  // '@stylistic/jsx-wrap-multilines'

  return [
    {
      name: 'waltz/stylistic/setup',
      files: scriptFiles,
      plugins: {
        '@stylistic': eslintStylistic,
      },
    },
    {
      name: 'waltz/stylistic/rules',
      files: options.files ?? scriptFiles,
      rules: {
        ...configs.rules,
        ...options.overrides,
      },
    },
  ]
}
