import { getRouterParam, type H3Event } from 'h3'
import { getVehicleRequestId, toSafeVehicleCatalogError } from './errors'

export const parsePositiveRouteId = (event: H3Event, name: string): number => {
  const value = getRouterParam(event, name)
  if (!value || !/^[1-9]\d*$/u.test(value)) {
    throw toSafeVehicleCatalogError(new Error('invalid route id'), getVehicleRequestId(event))
  }
  const id = Number(value)
  if (!Number.isSafeInteger(id)) {
    throw toSafeVehicleCatalogError(new Error('unsafe route id'), getVehicleRequestId(event))
  }
  return id
}

export const runVehicleCatalogHandler = async <T>(
  event: H3Event,
  operation: () => Promise<T>
): Promise<T> => {
  const requestId = getVehicleRequestId(event)
  event.context.requestId = requestId
  try {
    return await operation()
  } catch (error: unknown) {
    console.error('Vehicle catalog request failed', {
      requestId,
      errorType: error instanceof Error ? error.name : 'UnknownError'
    })
    throw toSafeVehicleCatalogError(error, requestId)
  }
}
