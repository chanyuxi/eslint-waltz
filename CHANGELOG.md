# @chanyuxi/eslint-waltz

## 1.1.0 [2026-09-11]

### Minor Changes

- Enable **recommended-alphabetical** by default

## 1.0.0 [2026-09-11]

### Major Changes

- Migrate to ESLint 10 and replace `eslint-plugin-import` with `eslint-plugin-import-x` while preserving the existing `imports/`* rule IDs.
- Replace the deprecated stylistic JSX prop sorting rule with the independent Perfectionist configuration. The default configuration enables `sort-jsx-props`, and full recommended presets can be selected.

### Minor Changes

- Add support for Tailwind CSS.

## 0.1.1 [2026-09-11]

### Patch Changes

- We have adjusted the default for `import` to `true`.

## 0.1.0 [2026-09-11]

### Minor Changes

- Add the `eslint-waltz sync-vscode` CLI command for synchronizing ESLint fix-on-save settings.

## 0.0.0 [2026-09-11]

### Minor Changes

- Fix feature option handling and file scoping, add official recommended presets, and make the package build and validation workflow reproducible.

