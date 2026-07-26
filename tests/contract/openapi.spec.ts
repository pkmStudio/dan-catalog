import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'
import { describe, expect, it } from 'vitest'
import { endpointRegistry } from '~/shared/api'

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

    return Object.entries(pathDefinition).flatMap(([method, operation]) => {
      if (!isRecord(operation) || typeof operation.operationId !== 'string') return []
      return [{ method, operationId: operation.operationId, path }]
    })
  })
}

describe('OpenAPI contract registry', () => {
  it('parses an OpenAPI 3.1 document with unique operation IDs', () => {
    const document: unknown = parse(readFileSync(contractPath, 'utf8'))
    expect(isRecord(document) && document.openapi).toBe('3.1.0')

    const operationIds = readOperations().map(({ operationId }) => operationId)
    expect(operationIds).toHaveLength(13)
    expect(new Set(operationIds).size).toBe(operationIds.length)
  })

  it('keeps endpoint registry keys in parity with operation IDs', () => {
    const operationIds = readOperations()
      .map(({ operationId }) => operationId)
      .sort()

    expect(Object.keys(endpointRegistry).sort()).toEqual(operationIds)
  })

  it('builds every documented route', () => {
    const concreteRoutes: Record<keyof typeof endpointRegistry, string> = {
      getProductGroups: endpointRegistry.getProductGroups(),
      getGroupCategories: endpointRegistry.getGroupCategories('group id'),
      getCategoryProducts: endpointRegistry.getCategoryProducts('wipers'),
      getProduct: endpointRegistry.getProduct('product id'),
      searchProducts: endpointRegistry.searchProducts('щётка'),
      getVehicleMakes: endpointRegistry.getVehicleMakes(),
      getVehicleModels: endpointRegistry.getVehicleModels('make id'),
      getVehicleModifications: endpointRegistry.getVehicleModifications('model id'),
      getModificationCategories: endpointRegistry.getModificationCategories('mod id'),
      getProductCompatibility: endpointRegistry.getProductCompatibility('product id', 'mod id'),
      getAboutContent: endpointRegistry.getAboutContent(),
      getContactContent: endpointRegistry.getContactContent(),
      createInquiry: endpointRegistry.createInquiry()
    }

    expect(concreteRoutes).toEqual({
      getProductGroups: '/catalog/groups',
      getGroupCategories: '/catalog/groups/group%20id/categories',
      getCategoryProducts: '/catalog/categories/wipers/products',
      getProduct: '/catalog/products/product%20id',
      searchProducts: '/catalog/search?limit=8&q=%D1%89%D1%91%D1%82%D0%BA%D0%B0',
      getVehicleMakes: '/vehicles/makes',
      getVehicleModels: '/vehicles/makes/make%20id/models',
      getVehicleModifications: '/vehicles/models/model%20id/modifications',
      getModificationCategories: '/vehicles/modifications/mod%20id/categories',
      getProductCompatibility:
        '/catalog/products/product%20id/compatibility?vehicleModificationId=mod+id',
      getAboutContent: '/content/about',
      getContactContent: '/content/contacts',
      createInquiry: '/inquiries'
    })
  })
})
