# @chanyuxi/eslint-waltz

Composable ESLint flat config for JavaScript, TypeScript, JSONC, imports, React, Tailwind CSS, Perfectionist, and Vitest.

Requires Node.js `>=20.19.0`.

## Quick start

Run the interactive initializer from your project root:

```bash
pnpm dlx @chanyuxi/eslint-waltz init
```

The initializer detects your package manager and existing dependencies, creates
`eslint.config.ts`, installs missing dependencies for the selected features,
and can configure ESLint fix-on-save in VS Code while preserving existing
settings and comments.

If the package is already installed, use its local binary:

```bash
pnpm exec eslint-waltz init
```

## Configuration

```ts
// eslint.config.ts
import waltz from '@chanyuxi/eslint-waltz'

export default waltz({
  ts: true,
  react: true,
})
```

The default configuration includes JavaScript, stylistic rules, JSONC,
import validation, and Perfectionist's `recommended-alphabetical` preset.
Optional modules are enabled with `ts`, `react`, `tailwindcss`, `gitignore`,
and `vitest`. All options are fully typed.

## CLI

```bash
eslint-waltz init     # create or update eslint.config.ts
eslint-waltz version  # print the installed version
```

Use `eslint-waltz --help` to see the available commands. VS Code
fix-on-save synchronization is part of `init`.

## Advanced options

### TypeScript scope

`ts.files` limits the TypeScript files included by modules that automatically
support TypeScript. JavaScript files keep their normal scope, and a module's
own `files` option can narrow or override it. Vitest also intersects its test
patterns with this scope.

```ts
export default waltz({
  ts: { files: ['src/**/*.ts'] },
  react: true,
})
```

### Module resolution

Potentially expensive module-resolution rules are disabled by default. Enable
only the rules you need:

```ts
export default waltz({
  imports: {
    overrides: {
      'imports/named': 'error',
      'imports/namespace': 'error',
    },
  },
})
```

### React settings

```ts
export default waltz({
  react: {
    settings: {
      'react-x': { importSource: 'preact' },
    },
  },
})
```
