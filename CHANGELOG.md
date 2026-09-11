# @chanyuxi/eslint-waltz

## 1.1.0

### Minor Changes

- 4adb093: Enable **recommended-alphabetical** by default

## 1.0.0

### Major Changes

- a036dcd: Migrate to ESLint 10 and replace `eslint-plugin-import` with `eslint-plugin-import-x` while preserving the existing `imports/`* rule IDs.
- a036dcd: Replace the deprecated stylistic JSX prop sorting rule with the independent Perfectionist configuration. The default configuration enables `sort-jsx-props`, and full recommended presets can be selected.

### Minor Changes

- a036dcd: Add support for Tailwind CSS.

## 0.1.1

### Patch Changes

- 0e053fc: We have adjusted the default for `import` to `true`.

## 0.1.0

### Minor Changes

- Add the `eslint-waltz sync-vscode` CLI command for synchronizing ESLint fix-on-save settings.

## 0.0.0

### Minor Changes

- 0880418: Fix feature option handling and file scoping, add official recommended presets, and make the package build and validation workflow reproducible.

