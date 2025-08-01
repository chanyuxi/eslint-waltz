import waltz from './src'

export default waltz({
  gitignore: true,
  js: { globals: ['browser'] },
  ts: true,
  imports: true,
  react: true,
})
