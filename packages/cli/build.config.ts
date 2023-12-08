import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  // If entries is not provided, will be automatically inferred from package.json
  entries: ['src/index', 'src/cli'],
  clean: true,
  // Change outDir, default is 'dist'
  outDir: 'dist',
  rollup: {
    inlineDependencies: true,
    esbuild: {
      target: 'node18',
      minify: true
    }
  },
  alias: {
    // we can always use non-transpiled code since we support node 18+
    prompts: 'prompts/lib/index.js',
  },
  // Generates .d.ts declaration file
  declaration: true
})
