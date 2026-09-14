# @chanyuxi/eslint-waltz

Composable ESLint flat config for JavaScript, TypeScript, JSONC, React, Tailwind CSS, and Perfectionist.

Requires Node.js `>=20.19.0`.

## Install

```bash
pnpm add -D @chanyuxi/eslint-waltz eslint @eslint/js @stylistic/eslint-plugin eslint-plugin-jsonc eslint-plugin-import-x eslint-plugin-perfectionist jsonc-eslint-parser globals
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

Optional: `ts`, `react`, `tailwindcss`, and `gitignore`.

Disable or configure modules with options such as:

```ts
export default waltz({
  imports: false,
  perfectionist: { preset: 'recommended-natural' },
})
```

More options are documented in the exported TypeScript types.
