import { VehicleCatalogUpstreamError } from './errors'

export interface VehicleCatalogRuntimeConfig {
  baseUrl: string
  apiKey: string
  timeoutMs: number
}

export interface VehicleCatalogTransportOptions {
  headers: Record<string, string>
  signal: AbortSignal
}

export type VehicleCatalogTransport = (
  url: string,
  options: VehicleCatalogTransportOptions
) => Promise<unknown>

const trimBaseUrl = (value: string): string => value.trim().replace(/\/+$/u, '')

export const resolveVehicleCatalogConfig = (
  input: Partial<VehicleCatalogRuntimeConfig>,
  production = process.env.NODE_ENV === 'production'
): VehicleCatalogRuntimeConfig => {
  const baseUrl = trimBaseUrl(String(input.baseUrl ?? ''))
  const apiKey = String(input.apiKey ?? '').trim()
  const timeoutMs = Number(input.timeoutMs ?? 3000)

  if (!baseUrl || (production && !apiKey)) {
    throw new Error('Vehicle catalog private runtime configuration is incomplete')
  }
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs <= 0) {
    throw new Error('Vehicle catalog timeout must be a positive integer')
  }

  return { baseUrl, apiKey, timeoutMs }
}

const defaultTransport: VehicleCatalogTransport = async (url, options) =>
  await $fetch<unknown>(url, { headers: options.headers, signal: options.signal })

export interface VehicleCatalogClient {
  get: (path: string) => Promise<unknown>
}

export const createVehicleCatalogClient = (
  configInput: Partial<VehicleCatalogRuntimeConfig>,
  transport: VehicleCatalogTransport = defaultTransport
): VehicleCatalogClient => {
  const config = resolveVehicleCatalogConfig(configInput)

  return {
    async get(path) {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), config.timeoutMs)
      const headers: Record<string, string> = { Accept: 'application/json' }
      if (config.apiKey) headers['X-Service-Key'] = config.apiKey

      try {
        return await transport(`${config.baseUrl}/${path.replace(/^\/+|\/+$/gu, '')}`, {
          headers,
          signal: controller.signal
        })
      } catch (error: unknown) {
        if (controller.signal.aborted) {
          throw new VehicleCatalogUpstreamError('timeout', undefined, { cause: error })
        }
        const status =
          typeof error === 'object' && error !== null && 'statusCode' in error
            ? Number(error.statusCode)
            : undefined
        if (status === 404) {
          throw new VehicleCatalogUpstreamError('not-found', undefined, { cause: error })
        }
        if (status === 401 || status === 403) {
          throw new VehicleCatalogUpstreamError('network', undefined, { cause: error })
        }
        throw new VehicleCatalogUpstreamError('network', undefined, { cause: error })
      } finally {
        clearTimeout(timeout)
      }
    }
  }
}

export const useVehicleCatalogClient = (): VehicleCatalogClient => {
  const config = useRuntimeConfig().catalogBackend
  return createVehicleCatalogClient({
    baseUrl: String(config.baseUrl),
    apiKey: String(config.apiKey),
    timeoutMs: Number(config.timeoutMs)
  })
}
