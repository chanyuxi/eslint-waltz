import type { PackageMetadata } from './package'
import type { Readable, Writable } from 'node:stream'

import { spawn } from 'node:child_process'
import { access, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'

import {
  cancel,
  CANCEL_SYMBOL,
  confirm,
  intro,
  multiselect,
  note,
  outro,
  select,
} from '@clack/prompts'

import { syncVSCodeSettings } from './vscode'

const packageManagers = ['pnpm', 'npm', 'yarn', 'bun'] as const
const perfectionistPresets = [
  'recommended-alphabetical',
  'recommended-natural',
  'recommended-line-length',
  'recommended-custom',
] as const
const features = [
  'json',
  'imports',
  'perfectionist',
  'typescript',
  'react',
  'tailwindcss',
  'gitignore',
  'vitest',
] as const
const eslintConfigFiles = [
  'eslint.config.ts',
  'eslint.config.mts',
  'eslint.config.cts',
  'eslint.config.js',
  'eslint.config.mjs',
  'eslint.config.cjs',
]

export interface InitPrompts {
  cancel: (message: string) => void
  confirm: (message: string, initial: boolean) => Promise<boolean>
  intro: (message: string) => void
  multiselect: (
    message: string,
    choices: readonly PromptChoice[],
    initial: string[],
  ) => Promise<string[]>
  note: (message: string, title?: string) => void
  outro: (message: string) => void
  select: (
    message: string,
    choices: readonly PromptChoice[],
    initial: string,
  ) => Promise<string>
}
export interface InitRuntime {
  cwd?: string
  input?: Readable
  install?: (
    packageManager: PackageManager,
    dependencies: string[],
    cwd: string,
  ) => Promise<void>
  metadata: PackageMetadata
  output?: Writable
  prompts?: InitPrompts
}
type Feature = typeof features[number]

interface InitSelections {
  features: Set<Feature>
  packageManager: PackageManager
  perfectionist: PerfectionistPreset
  vscode: boolean
}

type PackageManager = typeof packageManagers[number]

type PerfectionistPreset = typeof perfectionistPresets[number]

interface ProjectPackage {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  optionalDependencies?: Record<string, string>
  packageManager?: string
}

interface PromptChoice {
  hint?: string
  label: string
  value: string
}

class PromptCancelledError extends Error {}

export async function runInit(runtime: InitRuntime): Promise<void> {
  const cwd = runtime.cwd ?? process.cwd()
  const output = runtime.output ?? process.stdout
  const prompts = runtime.prompts
    ?? createClackPrompts(runtime.input ?? process.stdin, output)

  try {
    prompts.intro(`eslint-waltz ${runtime.metadata.version}`)

    const projectPackage = await readProjectPackage(cwd)
    const existingConfigs = await findExistingConfigs(cwd)

    if (existingConfigs.length > 0) {
      const shouldReplace = await prompts.confirm(
        `Replace ${existingConfigs.join(', ')} with eslint.config.ts?`,
        false,
      )

      if (!shouldReplace) {
        prompts.cancel('Initialization cancelled.')
        return
      }
    }

    const installed = getInstalledDependencies(projectPackage)
    const selections = await collectSelections(
      cwd,
      projectPackage,
      installed,
      prompts,
    )
    const requiredDependencies = getRequiredDependencies(
      runtime.metadata,
      selections,
    )
    const missingDependencies = requiredDependencies.filter(({ name }) =>
      !installed.has(name),
    )
    let shouldInstall = false

    if (missingDependencies.length > 0) {
      prompts.note(
        missingDependencies.map(({ spec }) => spec).join('\n'),
        'Dependencies to install',
      )
      shouldInstall = await prompts.confirm('Install these dependencies?', true)
    }

    if (shouldInstall) {
      const install = runtime.install ?? installDependencies
      await install(
        selections.packageManager,
        missingDependencies.map(({ spec }) => spec),
        cwd,
      )
    }

    const configPath = join(cwd, 'eslint.config.ts')
    await writeFile(configPath, createConfig(selections), 'utf8')

    for (const fileName of existingConfigs) {
      if (fileName !== 'eslint.config.ts') {
        await rm(join(cwd, fileName))
      }
    }

    const completed = [
      `${existingConfigs.length > 0 ? 'Updated' : 'Created'} ${configPath}`,
    ]

    if (selections.vscode) {
      const result = await syncVSCodeSettings(cwd)
      completed.push(
        result.changed
          ? `Updated ${result.filePath}`
          : `${result.filePath} is already synchronized`,
      )
    }

    if (missingDependencies.length > 0 && !shouldInstall) {
      prompts.note(
        formatInstallCommand(
          selections.packageManager,
          missingDependencies.map(({ spec }) => spec),
        ),
        'Dependency installation skipped',
      )
    }

    prompts.note(completed.join('\n'), 'Files')
    prompts.outro('eslint-waltz is ready.')
  }
  catch (error) {
    if (error instanceof PromptCancelledError) {
      prompts.cancel('Initialization cancelled.')
      return
    }

    throw error
  }
}

async function collectSelections(
  cwd: string,
  projectPackage: ProjectPackage,
  installed: Set<string>,
  prompts: InitPrompts,
): Promise<InitSelections> {
  const detectedPackageManager = await detectPackageManager(cwd, projectPackage)
  const packageManager = await prompts.select(
    'Which package manager should install the dependencies?',
    packageManagers.map(value => ({ label: value, value })),
    detectedPackageManager,
  )
  const selectedFeatures = await prompts.multiselect(
    'Which features should be enabled?',
    [
      { hint: 'default', label: 'JSON and JSONC', value: 'json' },
      { hint: 'default', label: 'Import validation', value: 'imports' },
      { hint: 'default', label: 'Perfectionist sorting', value: 'perfectionist' },
      { label: 'TypeScript', value: 'typescript' },
      { label: 'React', value: 'react' },
      { label: 'Tailwind CSS', value: 'tailwindcss' },
      { label: '.gitignore', value: 'gitignore' },
      { label: 'Vitest', value: 'vitest' },
    ],
    await detectInitialFeatures(cwd, installed),
  )
  const enabledFeatures = new Set(selectedFeatures)

  for (const feature of enabledFeatures) {
    if (!isFeature(feature)) {
      throw new Error(`Unsupported feature: ${feature}`)
    }
  }

  const perfectionist = enabledFeatures.has('perfectionist')
    ? await selectPerfectionistPreset(prompts)
    : 'recommended-alphabetical'
  const vscode = await prompts.confirm(
    'Configure VS Code fix-on-save settings?',
    await fileExists(join(cwd, '.vscode')),
  )

  if (!isPackageManager(packageManager)) {
    throw new Error(`Unsupported package manager: ${packageManager}`)
  }

  return {
    features: enabledFeatures as Set<Feature>,
    packageManager,
    perfectionist,
    vscode,
  }
}

function createClackPrompts(input: Readable, output: Writable): InitPrompts {
  const io = { input, output }

  return {
    cancel: message => cancel(message, io),
    async confirm(message, initial) {
      return unwrapPromptResult(await confirm({
        ...io,
        initialValue: initial,
        message,
      }))
    },
    intro: message => intro(message, io),
    async multiselect(message, choices, initial) {
      return unwrapPromptResult(await multiselect({
        ...io,
        initialValues: initial,
        message,
        options: [...choices],
        required: false,
      }))
    },
    note: (message, title) => note(message, title, io),
    outro: message => outro(message, io),
    async select(message, choices, initial) {
      return unwrapPromptResult(await select({
        ...io,
        initialValue: initial,
        message,
        options: [...choices],
      }))
    },
  }
}

function createConfig(selections: InitSelections): string {
  const options: string[] = []
  const { features } = selections

  if (features.has('gitignore')) {
    options.push('  gitignore: true,')
  }

  if (!features.has('imports')) {
    options.push('  imports: false,')
  }

  if (!features.has('json')) {
    options.push('  json: false,')
  }

  if (!features.has('perfectionist')) {
    options.push('  perfectionist: false,')
  }
  else if (selections.perfectionist !== 'recommended-alphabetical') {
    options.push(
      `  perfectionist: { preset: '${selections.perfectionist}' },`,
    )
  }

  if (features.has('react')) {
    options.push('  react: true,')
  }

  if (features.has('tailwindcss')) {
    options.push('  tailwindcss: true,')
  }

  if (features.has('typescript')) {
    options.push('  ts: true,')
  }

  if (features.has('vitest')) {
    options.push('  vitest: true,')
  }

  const invocation = options.length === 0
    ? 'waltz()'
    : `waltz({\n${options.join('\n')}\n})`

  return `import waltz from '@chanyuxi/eslint-waltz'\n\nexport default ${invocation}\n`
}

async function detectInitialFeatures(
  cwd: string,
  installed: Set<string>,
): Promise<Feature[]> {
  const initial: Feature[] = ['json', 'imports', 'perfectionist']

  if (
    installed.has('typescript')
    || installed.has('typescript-eslint')
    || await fileExists(join(cwd, 'tsconfig.json'))
  ) {
    initial.push('typescript')
  }

  if (installed.has('react') || installed.has('preact')) {
    initial.push('react')
  }

  if (installed.has('tailwindcss')) {
    initial.push('tailwindcss')
  }

  if (await fileExists(join(cwd, '.gitignore'))) {
    initial.push('gitignore')
  }

  if (installed.has('vitest')) {
    initial.push('vitest')
  }

  return initial
}

async function detectPackageManager(
  cwd: string,
  projectPackage: ProjectPackage,
): Promise<PackageManager> {
  const configured = projectPackage.packageManager?.split('@')[0]
  if (isPackageManager(configured)) {
    return configured
  }

  const lockFiles: Array<[PackageManager, string]> = [
    ['pnpm', 'pnpm-lock.yaml'],
    ['yarn', 'yarn.lock'],
    ['bun', 'bun.lock'],
    ['bun', 'bun.lockb'],
    ['npm', 'package-lock.json'],
  ]

  for (const [packageManager, lockFile] of lockFiles) {
    if (await fileExists(join(cwd, lockFile))) {
      return packageManager
    }
  }

  return 'npm'
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath)
    return true
  }
  catch {
    return false
  }
}

async function findExistingConfigs(cwd: string): Promise<string[]> {
  const results = await Promise.all(
    eslintConfigFiles.map(async fileName => ({
      exists: await fileExists(join(cwd, fileName)),
      fileName,
    })),
  )

  return results.filter(result => result.exists).map(result => result.fileName)
}

function formatInstallCommand(
  packageManager: PackageManager,
  dependencies: string[],
): string {
  return getInstallCommand(packageManager, dependencies).join(' ')
}

function getDependencySpec(metadata: PackageMetadata, name: string): string {
  if (name === metadata.name) {
    return `${name}@${metadata.version}`
  }

  const version = metadata.peerDependencies?.[name]
    ?? metadata.dependencies?.[name]
    ?? metadata.devDependencies?.[name]

  return version ? `${name}@${version}` : name
}

function getInstallCommand(
  packageManager: PackageManager,
  dependencies: string[],
): string[] {
  switch (packageManager) {
    case 'npm':
      return ['npm', 'install', '--save-dev', ...dependencies]
    case 'yarn':
      return ['yarn', 'add', '--dev', ...dependencies]
    default:
      return [packageManager, 'add', '-D', ...dependencies]
  }
}

function getInstalledDependencies(projectPackage: ProjectPackage): Set<string> {
  return new Set([
    ...Object.keys(projectPackage.dependencies ?? {}),
    ...Object.keys(projectPackage.devDependencies ?? {}),
    ...Object.keys(projectPackage.optionalDependencies ?? {}),
  ])
}

function getRequiredDependencies(
  metadata: PackageMetadata,
  selections: InitSelections,
): Array<{ name: string, spec: string }> {
  const names = [metadata.name, 'eslint', 'jiti']
  const { features } = selections

  if (features.has('gitignore')) {
    names.push('eslint-config-flat-gitignore')
  }

  if (features.has('imports')) {
    names.push('eslint-plugin-import-x')
  }

  if (features.has('json')) {
    names.push('eslint-plugin-jsonc', 'jsonc-eslint-parser')
  }

  if (features.has('perfectionist')) {
    names.push('eslint-plugin-perfectionist')
  }

  if (features.has('react')) {
    names.push(
      'eslint-plugin-react-debug',
      'eslint-plugin-react-dom',
      'eslint-plugin-react-hooks-extra',
      'eslint-plugin-react-naming-convention',
      'eslint-plugin-react-web-api',
      'eslint-plugin-react-x',
    )
  }

  if (features.has('tailwindcss')) {
    names.push('eslint-plugin-tailwindcss', 'tailwindcss')
  }

  if (features.has('typescript')) {
    names.push('typescript', 'typescript-eslint')
  }

  if (features.has('vitest')) {
    names.push('@vitest/eslint-plugin', 'vitest')
  }

  return names.map(name => ({
    name,
    spec: getDependencySpec(metadata, name),
  }))
}

async function installDependencies(
  packageManager: PackageManager,
  dependencies: string[],
  cwd: string,
): Promise<void> {
  const [command, ...args] = getInstallCommand(packageManager, dependencies)
  const child = spawn(command, args, {
    cwd,
    shell: process.platform === 'win32',
    stdio: 'inherit',
  })

  await new Promise<void>((resolve, reject) => {
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) {
        resolve()
      }
      else {
        reject(new Error(`${command} exited with code ${code ?? 'unknown'}.`))
      }
    })
  })
}

function isFeature(value: string): value is Feature {
  return features.some(feature => feature === value)
}

function isPackageManager(value: string | undefined): value is PackageManager {
  return packageManagers.some(packageManager => packageManager === value)
}

function isPerfectionistPreset(value: string): value is PerfectionistPreset {
  return perfectionistPresets.some(preset => preset === value)
}

async function readProjectPackage(cwd: string): Promise<ProjectPackage> {
  const filePath = join(cwd, 'package.json')

  try {
    return JSON.parse(await readFile(filePath, 'utf8')) as ProjectPackage
  }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`package.json was not found in ${cwd}.`)
    }

    throw new Error(
      `Unable to read ${filePath}: ${error instanceof Error ? error.message : error}`,
    )
  }
}

async function selectPerfectionistPreset(
  prompts: InitPrompts,
): Promise<PerfectionistPreset> {
  const preset = await prompts.select(
    'Which Perfectionist preset should be used?',
    [
      {
        hint: 'recommended',
        label: 'Alphabetical',
        value: 'recommended-alphabetical',
      },
      { label: 'Natural', value: 'recommended-natural' },
      { label: 'Line length', value: 'recommended-line-length' },
      { label: 'Custom', value: 'recommended-custom' },
    ],
    'recommended-alphabetical',
  )

  if (!isPerfectionistPreset(preset)) {
    throw new Error(`Unsupported Perfectionist preset: ${preset}`)
  }

  return preset
}

function unwrapPromptResult<T>(result: T | typeof CANCEL_SYMBOL): T {
  if (result === CANCEL_SYMBOL) {
    throw new PromptCancelledError()
  }

  return result as T
}
