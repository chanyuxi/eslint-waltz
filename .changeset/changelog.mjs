function formatReleaseLine(changeset) {
  const [firstLine, ...futureLines] = changeset.summary
    .split('\n')
    .map(line => line.trimEnd())
  let releaseLine = `- ${firstLine}`

  if (futureLines.length > 0) {
    releaseLine += `\n${futureLines.map(line => `  ${line}`).join('\n')}`
  }

  return releaseLine
}

const changelogFunctions = {
  getDependencyReleaseLine: (changesets, dependenciesUpdated) => {
    if (dependenciesUpdated.length === 0) return ''

    const changesetLines = changesets.map(() => '- Updated dependencies')
    const dependencyLines = dependenciesUpdated.map(
      dependency => `  - ${dependency.name}@${dependency.newVersion}`,
    )

    return [...changesetLines, ...dependencyLines].join('\n')
  },
  getReleaseLine: changeset => formatReleaseLine(changeset),
}

export default changelogFunctions
