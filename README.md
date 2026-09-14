# @chanyuxi/eslint-waltz

Composable ESLint flat config for JavaScript, TypeScript, JSONC, React, Tailwind CSS, Perfectionist, and Vitest.

Requires Node.js `>=20.19.0`.

## Install

Install the package, ESLint, and the peer dependencies used by the default configuration:

```bash
pnpm add -D @chanyuxi/eslint-waltz eslint eslint-plugin-jsonc eslint-plugin-import-x eslint-plugin-perfectionist jsonc-eslint-parser
```

`@eslint/js`, `@stylistic/eslint-plugin`, `globals`, and `jsonc-parser` are included automatically.

Install peers only for the optional modules you enable:

```bash
# TypeScript
pnpm add -D typescript-eslint

# React
pnpm add -D eslint-plugin-react-x eslint-plugin-react-debug eslint-plugin-react-dom eslint-plugin-react-hooks-extra eslint-plugin-react-naming-convention eslint-plugin-react-web-api

# Tailwind CSS
pnpm add -D eslint-plugin-tailwindcss tailwindcss

# .gitignore support
pnpm add -D eslint-config-flat-gitignore

# Vitest
pnpm add -D @vitest/eslint-plugin vitest
```

## Usage

```ts
// eslint.config.ts
import waltz from '@chanyuxi/eslint-waltz'

export default waltz({
  ts: true,
  react: true,
})
```

Enabled by default:

- JavaScript and stylistic rules
- JSONC rules
- import validation
- Perfectionist with `recommended-alphabetical`

Optional: `ts`, `react`, `tailwindcss`, `gitignore`, and `vitest`.

More options are documented in the exported TypeScript types.
