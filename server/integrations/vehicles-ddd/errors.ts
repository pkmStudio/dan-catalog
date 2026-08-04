import { createError, type H3Error } from 'h3'
import { ZodError } from 'zod'

export type VehicleCatalogErrorCode =
  | 'VEHICLE_CATALOG_BAD_RESPONSE'
  | 'VEHICLE_CATALOG_UNAVAILABLE'
  | 'VEHICLE_CATALOG_TIMEOUT'
  | 'VEHICLE_NOT_FOUND'

export class VehicleCatalogUpstreamError extends Error {
  constructor(
    readonly kind: 'bad-response' | 'network' | 'timeout' | 'not-found',
    readonly requestId?: string,
    options?: ErrorOptions
  ) {
    super('Vehicle catalog request failed', options)
    this.name = 'VehicleCatalogUpstreamError'
  }
}

const publicDetails = (
  code: VehicleCatalogErrorCode,
  message: string,
  requestId: string,
  retryable: boolean
) => ({ error: { code, message, requestId, retryable } })

export const toSafeVehicleCatalogError = (error: unknown, requestId: string): H3Error => {
  const kind =
    error instanceof VehicleCatalogUpstreamError
      ? error.kind
      : error instanceof ZodError
        ? 'bad-response'
        : 'network'

  if (kind === 'not-found') {
    return createError({
      statusCode: 404,
      statusMessage: 'Автомобиль недоступен.',
      data: publicDetails('VEHICLE_NOT_FOUND', 'Автомобиль недоступен.', requestId, false)
    })
  }

  if (kind === 'timeout') {
    return createError({
      statusCode: 503,
      statusMessage: 'Справочник временно недоступен.',
      data: publicDetails(
        'VEHICLE_CATALOG_TIMEOUT',
        'Справочник временно недоступен. Попробуйте ещё раз.',
        requestId,
        true
      )
    })
  }

  const malformed = kind === 'bad-response'
  return createError({
    statusCode: 502,
    statusMessage: 'Не удалось получить данные автомобиля.',
    data: publicDetails(
      malformed ? 'VEHICLE_CATALOG_BAD_RESPONSE' : 'VEHICLE_CATALOG_UNAVAILABLE',
      'Не удалось получить данные автомобиля. Попробуйте ещё раз.',
      requestId,
      true
    )
  })
}

export const getVehicleRequestId = (event?: { context?: Record<string, unknown> }): string => {
  const existing = event?.context?.requestId
  return typeof existing === 'string' && existing ? existing : crypto.randomUUID()
}
