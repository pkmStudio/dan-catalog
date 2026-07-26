import { createError } from 'h3'

export interface MockResponse<T> {
  data: T
}

export interface MockErrorPayload {
  code: string
  message: string
  fieldErrors?: Record<string, string>
  requestId?: string
}

export const mockResponse = <T>(data: T): MockResponse<T> => ({ data })

export const throwMockError = (statusCode: number, payload: MockErrorPayload): never => {
  throw createError({
    statusCode,
    statusMessage: payload.message,
    data: { error: payload }
  })
}
