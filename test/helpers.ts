import type { LinterConfig } from '../src'

export function configByName(
  configs: LinterConfig[],
  name: string,
) {
  return configs.find(config => config.name === name)
}

export function ruleSeverity(rule: unknown) {
  return Array.isArray(rule) ? rule[0] : rule
}
