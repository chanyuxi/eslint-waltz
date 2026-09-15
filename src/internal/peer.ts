export function importPeer<T>(
  moduleName: string,
  featureName: string,
  importer: () => Promise<T>,
): Promise<T> {
  return importer().catch((error: unknown) => {
    if (!isMissingPeerError(error, moduleName)) {
      throw error
    }

    throw new Error(
      `${featureName} requires ${moduleName}. Install it with: pnpm add -D ${moduleName}`,
      { cause: error },
    )
  })
}

function isMissingPeerError(error: unknown, moduleName: string): boolean {
  if (typeof error !== 'object' || error === null) {
    return false
  }

  const candidate = error as { code?: unknown, message?: unknown }
  return (
    candidate.code === 'ERR_MODULE_NOT_FOUND'
    && typeof candidate.message === 'string'
    && candidate.message.includes(moduleName)
  )
}
