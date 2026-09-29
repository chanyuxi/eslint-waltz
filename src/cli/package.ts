import { readFile } from 'node:fs/promises'

export interface PackageMetadata {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  name: string
  peerDependencies?: Record<string, string>
  version: string
}

export async function readPackageMetadata(): Promise<PackageMetadata> {
  for (const relativePath of ['../package.json', '../../package.json']) {
    try {
      const source = await readFile(new URL(relativePath, import.meta.url), 'utf8')
      const metadata = JSON.parse(source) as PackageMetadata

      if (metadata.name === '@chanyuxi/eslint-waltz') {
        return metadata
      }
    }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error
      }
    }
  }

  throw new Error('Unable to locate the eslint-waltz package metadata.')
}
