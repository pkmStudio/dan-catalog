import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it, vi } from 'vitest'
import {
  createVehicleCatalogClient,
  resolveVehicleCatalogConfig,
  type VehicleCatalogTransport
} from '~~/server/integrations/vehicles-ddd/client'

describe('vehicles-ddd client', () => {
  it('constructs the upstream URL and sends an optional local service key', async () => {
    const transport = vi.fn<VehicleCatalogTransport>(async () => ({ data: [] }))
    const client = createVehicleCatalogClient(
      { baseUrl: 'http://vehicles.test/', apiKey: 'private-key', timeoutMs: 100 },
      transport
    )

    await client.get('/api/v1/catalog/manufacturers')

    expect(transport).toHaveBeenCalledOnce()
    expect(transport.mock.calls[0]?.[0]).toBe('http://vehicles.test/api/v1/catalog/manufacturers')
    expect(transport.mock.calls[0]?.[1].headers).toMatchObject({
      Accept: 'application/json',
      'X-Service-Key': 'private-key'
    })
  })

  it('omits the key locally and requires it in production', () => {
    expect(
      resolveVehicleCatalogConfig({ baseUrl: 'http://localhost', timeoutMs: 1 }, false).apiKey
    ).toBe('')
    expect(() =>
      resolveVehicleCatalogConfig({ baseUrl: 'http://vehicles', timeoutMs: 1 }, true)
    ).toThrow('private runtime configuration')
  })

  it('classifies an aborted request as a timeout without leaking transport details', async () => {
    vi.useFakeTimers()
    const client = createVehicleCatalogClient(
      { baseUrl: 'http://secret.internal', apiKey: 'secret', timeoutMs: 10 },
      async (_url, { signal }) =>
        await new Promise((_resolve, reject) => {
          signal.addEventListener('abort', () => reject(new Error('secret transport response')))
        })
    )
    const request = client.get('/slow')
    const assertion = expect(request).rejects.toMatchObject({
      kind: 'timeout',
      message: 'Vehicle catalog request failed'
    })
    await vi.advanceTimersByTimeAsync(11)
    await assertion
    vi.useRealTimers()
  })

  it('keeps backend configuration out of public runtime config', () => {
    const config = readFileSync(
      fileURLToPath(new URL('../../../nuxt.config.ts', import.meta.url)),
      'utf8'
    )
    const publicBlock = config.match(/public:\s*\{([^}]*)\}/su)?.[1] ?? ''
    expect(publicBlock).not.toMatch(/catalogBackend|apiKey|baseUrl/u)
  })
})
