import { normalizeAppError } from './error'

export type ResponseParser<T> = (value: unknown) => T

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: BodyInit | Record<string, unknown>
  headers?: Record<string, string>
  apiBase?: string
}

const joinUrl = (base: string, path: string): string =>
  `${base.replace(/\/+$/u, '')}/${path.replace(/^\/+/u, '')}`

export const apiRequest = async <T>(
  path: string,
  parser: ResponseParser<T>,
  options: ApiRequestOptions = {}
): Promise<T> => {
  const apiBase = options.apiBase ?? String(useRuntimeConfig().public.apiBase || '/api')

  try {
    const response: unknown = await $fetch(joinUrl(apiBase, path), {
      method: options.method,
      body: options.body,
      headers: options.headers
    })
    return parser(response)
  } catch (error: unknown) {
    throw normalizeAppError(error)
  }
}
