# Introduction

👋 A composable ESLint flat config for JavaScript, TypeScript, JSONC, imports, React, Tailwind CSS, and Perfectionist.

Inspired by [@antfu/eslint-config](https://github.com/antfu/eslint-config).

# Features

The following configuration modules are available:

- ✅ Javascript
- ✅ Typescript
- ✅ Stylistic
- ✅ Perfectionist
- ✅ Json
- ✅ Import
- ✅ React
- ✅ Tailwind CSS
- JSONC and imports are enabled by default and can be disabled with `json: false` and `imports: false`.
- TypeScript, React, Tailwind CSS, and gitignore support are opt-in.

The `stylistic` configuration is always enabled. Perfectionist is enabled by default with the `recommended-alphabetical` preset.

# Usage

#### Install

Install the core package and its core ESLint peers:

```bash
pnpm add -D @chanyuxi/eslint-waltz eslint @eslint/js @stylistic/eslint-plugin eslint-plugin-jsonc eslint-plugin-import-x eslint-plugin-perfectionist jsonc-eslint-parser globals
```

Install the peer packages for any optional modules you enable, such as `typescript-eslint`, `eslint-plugin-tailwindcss`, `tailwindcss`, or the React ESLint plugins.

Perfectionist uses the `recommended-alphabetical` preset by default. Use `perfectionist: { preset: 'recommended-custom' }`, `recommended-line-length`, or `recommended-natural` to select another recommended preset. ESLint 10 and the current integrations require Node.js `>=20.19.0`.

Tailwind CSS support targets `eslint-plugin-tailwindcss` 4.x and Tailwind CSS 4.x. Node.js `>=20.19.0` is required when the Tailwind CSS module is enabled.

#### Configuration

Create a `eslint.config.ts` file in the project root directory and configure it as follows:

```ts
import waltz from '@chanyuxi/eslint-waltz'

export default waltz({
  // JSONC and imports are enabled by default
  json: true,
  ts: true,
  react: true,
  tailwindcss: {
    settings: {
      tailwindcss: { cssConfigPath: './src/styles.css' },
    },
  },
  js: { globals: ['browser'] },
})
```

Every module accepts `files` and `overrides` where applicable. Custom flat configs can be appended after the options:

```ts
export default waltz({}, {
  files: ['src/**/*.js'],
  rules: {
    'no-console': 'off',
  },
})
```

Run `pnpm run check` before committing. `pnpm pack` and `npm publish` build the package automatically through the `prepack` lifecycle.

#### VS Code synchronization

After installing the package, run this command from your project root:

```bash
npx eslint-waltz sync-vscode
```

It creates or updates `.vscode/settings.json` with ESLint fix-on-save settings while preserving other settings and JSONC comments.
