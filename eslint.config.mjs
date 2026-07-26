import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    ignores: [
      '.agents/**',
      '.codex/**',
      '.nuxt/**',
      '.output/**',
      '.specify/**',
      'build/**',
      'coverage/**',
      'dist/**',
      'node_modules/**',
      'public/**',
      'specs/**',
      '**/*.min.js'
    ]
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'always',
            component: 'always'
          },
          svg: 'always',
          math: 'always'
        }
      ]
    }
  }
)
