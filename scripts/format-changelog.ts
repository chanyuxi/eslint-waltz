import { readFile, writeFile } from 'node:fs/promises'

const changelogFile = 'CHANGELOG.md'
const source = await readFile(changelogFile, 'utf8')
const now = new Date()
const date = [
  now.getFullYear(),
  String(now.getMonth() + 1).padStart(2, '0'),
  String(now.getDate()).padStart(2, '0'),
].join('-')
const formatted = source.replace(
  /^## (\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)$/gm,
  (_, version: string) => `## ${version} [${date}]`,
)

if (formatted !== source) {
  await writeFile(changelogFile, formatted, 'utf8')
}
