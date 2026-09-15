import type { Linter } from 'eslint'

import type { WaltzOptions } from '../types'

import {
  JS_FILES,
  TS_FILES,
  VITEST_JS_FILES,
  VITEST_TS_FILES,
} from '../constants'

export interface FileScope {
  files: FilePatterns
}

export interface ResolvedFileScopes {
  scriptScope: ScriptScope
}

export interface ScriptScope {
  isCustomTypeScriptFiles: boolean
  isEnableTypeScript: boolean
  typeScriptFiles: FilePatterns
}

type FilePatterns = NonNullable<Linter.Config['files']>

export function getScriptFiles(scope: ScriptScope): FilePatterns {
  return scope.isEnableTypeScript
    ? [JS_FILES, ...scope.typeScriptFiles]
    : [JS_FILES]
}

export function getScriptScope(
  isEnableTypeScript: boolean,
  configuredTypeScriptFiles?: Linter.Config['files'],
): ScriptScope {
  const isCustomTypeScriptFiles = configuredTypeScriptFiles !== undefined

  return {
    isCustomTypeScriptFiles,
    isEnableTypeScript,
    typeScriptFiles: isEnableTypeScript
      ? configuredTypeScriptFiles ?? [TS_FILES]
      : [],
  }
}

export function getVitestScope(scope: ScriptScope): FileScope {
  if (!scope.isEnableTypeScript) {
    return { files: [VITEST_JS_FILES] }
  }

  if (!scope.isCustomTypeScriptFiles) {
    return { files: [VITEST_JS_FILES, VITEST_TS_FILES] }
  }

  return {
    files: [
      VITEST_JS_FILES,
      ...intersectFiles([VITEST_TS_FILES], scope.typeScriptFiles),
    ],
  }
}

export function intersectFiles(
  left: FilePatterns,
  right: FilePatterns,
): FilePatterns {
  return left.flatMap(leftPattern =>
    right.map(rightPattern => [
      ...(Array.isArray(leftPattern) ? leftPattern : [leftPattern]),
      ...(Array.isArray(rightPattern) ? rightPattern : [rightPattern]),
    ]),
  )
}

export function resolveFiles(
  files: Linter.Config['files'] | undefined,
  defaults: FilePatterns,
): FilePatterns {
  return files ?? defaults
}

export function resolveFileScopes(
  options: WaltzOptions,
): ResolvedFileScopes {
  const isEnableTypeScript = !!options.ts

  // For other configurations that depend on TypeScript—such as React, which requires
  // checking `.tsx` files—the scope defined in the user's TypeScript configuration
  // (if present) serves as the baseline by default; this ensures that the file scopes
  // of these configurations remain aligned.
  const configuredTypeScriptFiles
    = options.ts && typeof options.ts === 'object'
      ? options.ts.files
      : undefined
  const scriptScope = getScriptScope(
    isEnableTypeScript,
    configuredTypeScriptFiles,
  )

  return { scriptScope }
}
