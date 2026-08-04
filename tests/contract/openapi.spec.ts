import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'
import { describe, expect, it } from 'vitest'
import { vehicleEndpointRegistry } from '~/shared/api'

const contractPath = fileURLToPath(new URL('../../contracts/openapi.yaml', import.meta.url))

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

interface ContractOperation {
  method: string
  operationId: string
  path: string
}

const readOperations = (): ContractOperation[] => {
  const document: unknown = parse(readFileSync(contractPath, 'utf8'))
  if (!isRecord(document) || !isRecord(document.paths)) {
    throw new Error('OpenAPI document must define paths')
  }
  return Object.entries(document.paths).flatMap(([path, pathDefinition]) => {
    if (!isRecord(pathDefinition)) return []
    return Object.entries(pathDefinition).flatMap(([method, operation]) =>
      isRecord(operation) && typeof operation.operationId === 'string'
        ? [{ method, operationId: operation.operationId, path }]
        : []
    )
  })
}

describe('OpenAPI contract registry', () => {
  it('parses an OpenAPI 3.1 document with unique operation IDs', () => {
    const document: unknown = parse(readFileSync(contractPath, 'utf8'))
    expect(isRecord(document) && document.openapi).toBe('3.1.0')
    const operationIds = readOperations().map(({ operationId }) => operationId)
    expect(new Set(operationIds).size).toBe(operationIds.length)
  })

  it('keeps the canonical vehicle registry in exact parity with four Vehicles operations', () => {
    const operationIds = readOperations()
      .filter(({ path }) => path.startsWith('/vehicles/'))
      .map(({ operationId }) => operationId)
      .sort()
    expect(Object.keys(vehicleEndpointRegistry).sort()).toEqual(operationIds)
  })

  it('builds all four documented numeric routes', () => {
    expect({
      getVehicleManufacturers: vehicleEndpointRegistry.getVehicleManufacturers(),
      getManufacturerVehicles: vehicleEndpointRegistry.getManufacturerVehicles(10),
      getVehicleModifications: vehicleEndpointRegistry.getVehicleModifications(20),
      getVehicleModificationContext: vehicleEndpointRegistry.getVehicleModificationContext(30)
    }).toEqual({
      getVehicleManufacturers: '/vehicles/manufacturers',
      getManufacturerVehicles: '/vehicles/manufacturers/10/vehicles',
      getVehicleModifications: '/vehicles/20/modifications',
      getVehicleModificationContext: '/vehicles/modifications/30'
    })
  })
})
