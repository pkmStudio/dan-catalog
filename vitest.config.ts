import { defineVitestProject } from '@nuxt/test-utils/config'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const appAlias = fileURLToPath(new URL('./app', import.meta.url))
const aliases = {
  '@': appAlias,
  '~': appAlias
}

export default defineConfig({
  resolve: {
    alias: aliases
  },
  test: {
    projects: [
      {
        resolve: {
          alias: aliases
        },
        test: {
          name: 'unit',
          include: ['tests/unit/**/*.spec.ts'],
          environment: 'node'
        }
      },
      {
        resolve: {
          alias: aliases
        },
        test: {
          name: 'contract',
          include: ['tests/contract/**/*.spec.ts'],
          environment: 'node'
        }
      },
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['tests/nuxt/**/*.spec.ts'],
          environment: 'nuxt',
          setupFiles: ['./tests/setup/nuxt.ts'],
          environmentOptions: {
            nuxt: {
              domEnvironment: 'happy-dom'
            }
          }
        }
      })
    ]
  }
})
