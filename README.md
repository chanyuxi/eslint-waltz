# Introduction

👋 A composable ESLint flat config for JavaScript, TypeScript, JSONC, imports, and React.

Inspired by [@antfu/eslint-config](https://github.com/antfu/eslint-config).

# Features

The following configuration modules are available:

- ✅ Javascript
- ✅ Typescript
- ✅ Stylistic
- ✅ Json
- ✅ Import
- ✅ React
- JSONC is enabled by default and can be disabled with `json: false`.
- TypeScript, imports, React, and gitignore support are opt-in.

# Usage

#### Install

Install the core package and its core ESLint peers:

```bash
pnpm add -D @chanyuxi/eslint-waltz eslint @eslint/js @stylistic/eslint-plugin eslint-plugin-jsonc jsonc-eslint-parser globals
```

Install the peer packages for any optional modules you enable, such as `typescript-eslint`, `eslint-plugin-import`, or the React ESLint plugins.

#### Configuration

Create a `eslint.config.ts` file in the project root directory and configure it as follows:

```ts
import waltz from '@chanyuxi/eslint-waltz'

export default waltz({
  // JSONC is enabled by default
  json: true,
  ts: true,
  imports: true,
  react: true,
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
