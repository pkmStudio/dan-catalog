export interface AppErrorDetails {
  code?: string
  message?: string
  fieldErrors?: Record<string, string>
  requestId?: string
  statusCode?: number
}

const DEFAULT_ERROR_MESSAGE = 'Не удалось выполнить запрос. Попробуйте ещё раз.'

export class AppError extends Error {
  readonly code: string
  readonly fieldErrors?: Record<string, string>
  readonly requestId?: string
  readonly statusCode?: number

  constructor({
    code = 'UNKNOWN_ERROR',
    message = DEFAULT_ERROR_MESSAGE,
    fieldErrors,
    requestId,
    statusCode
  }: AppErrorDetails = {}) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.fieldErrors = fieldErrors
    this.requestId = requestId
    this.statusCode = statusCode
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const asString = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim() ? value : undefined

const asNumber = (value: unknown): number | undefined =>
  typeof value === 'number' && Number.isFinite(value) ? value : undefined

const asFieldErrors = (value: unknown): Record<string, string> | undefined => {
  if (!isRecord(value)) return undefined

  const entries = Object.entries(value).filter(
    (entry): entry is [string, string] => typeof entry[1] === 'string'
  )
  return entries.length ? Object.fromEntries(entries) : undefined
}

export const normalizeAppError = (value: unknown): AppError => {
  if (value instanceof AppError) return value
  if (!isRecord(value)) return new AppError()

  const responseData = isRecord(value.data) ? value.data : undefined
  const payload = responseData && isRecord(responseData.error) ? responseData.error : responseData

  return new AppError({
    code: asString(payload?.code) ?? asString(value.code) ?? 'REQUEST_FAILED',
    message: asString(payload?.message) ?? asString(value.statusMessage) ?? DEFAULT_ERROR_MESSAGE,
    fieldErrors: asFieldErrors(payload?.fieldErrors),
    requestId: asString(payload?.requestId),
    statusCode: asNumber(value.statusCode) ?? asNumber(value.status)
  })
}

export const getSafeErrorMessage = (value: unknown): string => normalizeAppError(value).message
