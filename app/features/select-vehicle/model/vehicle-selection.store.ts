import { defineStore } from 'pinia'
import {
  catalogVehicleListResponseSchema,
  createVehicleContext,
  enrichVehicleContext,
  vehicleManufacturerListResponseSchema,
  vehicleModificationContextResponseSchema,
  vehicleModificationListResponseSchema,
  type CatalogVehicle,
  type VehicleContext,
  type VehicleManufacturer,
  type VehicleModification
} from '~/entities/vehicle'
import {
  apiRequest,
  getManufacturerVehicles,
  getSafeErrorMessage,
  getVehicleManufacturers,
  getVehicleModificationContext,
  getVehicleModifications,
  normalizeAppError
} from '~/shared/api'

export type VehicleSelectionStatus = 'idle' | 'loading' | 'ready' | 'invalid' | 'error'
export type VehicleSelectionStage = 'manufacturers' | 'vehicles' | 'modifications' | 'resolution'

export interface VehicleDictionaryApi {
  getManufacturers: (signal?: AbortSignal) => Promise<VehicleManufacturer[]>
  getVehicles: (manufacturerId: number, signal?: AbortSignal) => Promise<CatalogVehicle[]>
  getModifications: (vehicleId: number, signal?: AbortSignal) => Promise<VehicleModification[]>
  getModificationContext: (modificationId: number, signal?: AbortSignal) => Promise<VehicleContext>
}

interface VehicleSelectionState {
  manufacturers: VehicleManufacturer[]
  vehicles: CatalogVehicle[]
  modifications: VehicleModification[]
  manufacturerId?: number
  vehicleId?: number
  modificationId?: number
  confirmed?: VehicleContext
  status: VehicleSelectionStatus
  errorMessage: string
  validationErrors: Partial<Record<'manufacturer' | 'vehicle' | 'modification', string>>
  failedStage?: VehicleSelectionStage
  pendingResolutionId?: number
  generations: Record<VehicleSelectionStage, number>
}

const createDefaultApi = (): VehicleDictionaryApi => ({
  getManufacturers: async (signal) =>
    (
      await apiRequest(
        getVehicleManufacturers(),
        (value) => vehicleManufacturerListResponseSchema.parse(value),
        { signal }
      )
    ).data,
  getVehicles: async (manufacturerId, signal) =>
    (
      await apiRequest(
        getManufacturerVehicles(manufacturerId),
        (value) => catalogVehicleListResponseSchema.parse(value),
        { signal }
      )
    ).data,
  getModifications: async (vehicleId, signal) =>
    (
      await apiRequest(
        getVehicleModifications(vehicleId),
        (value) => vehicleModificationListResponseSchema.parse(value),
        { signal }
      )
    ).data,
  getModificationContext: async (modificationId, signal) => {
    const response = await apiRequest(
      getVehicleModificationContext(modificationId),
      (value) => vehicleModificationContextResponseSchema.parse(value),
      { signal }
    )
    return enrichVehicleContext(response.data)
  }
})

export const resolveVehicleContext = async (
  modificationId: number,
  api: VehicleDictionaryApi = createDefaultApi(),
  signal?: AbortSignal
): Promise<VehicleContext> => await api.getModificationContext(modificationId, signal)

export const useVehicleSelectionStore = defineStore('vehicle-selection', {
  state: (): VehicleSelectionState => ({
    manufacturers: [],
    vehicles: [],
    modifications: [],
    status: 'idle',
    errorMessage: '',
    validationErrors: {},
    generations: { manufacturers: 0, vehicles: 0, modifications: 0, resolution: 0 }
  }),

  getters: {
    selectedManufacturer: (state): VehicleManufacturer | undefined =>
      state.manufacturers.find((item) => item.id === state.manufacturerId),
    selectedVehicle: (state): CatalogVehicle | undefined =>
      state.vehicles.find((item) => item.id === state.vehicleId),
    selectedModification: (state): VehicleModification | undefined =>
      state.modifications.find((item) => item.id === state.modificationId)
  },

  actions: {
    startRequest(stage: VehicleSelectionStage): number {
      const generation = this.generations[stage] + 1
      this.generations[stage] = generation
      this.status = 'loading'
      this.errorMessage = ''
      this.failedStage = stage
      return generation
    },

    isCurrent(stage: VehicleSelectionStage, generation: number): boolean {
      return this.generations[stage] === generation
    },

    finishRequest(stage: VehicleSelectionStage, generation: number) {
      if (!this.isCurrent(stage, generation)) return
      this.status = 'idle'
      this.failedStage = undefined
    },

    failRequest(stage: VehicleSelectionStage, generation: number, error: unknown) {
      if (!this.isCurrent(stage, generation)) return
      this.status = 'error'
      this.failedStage = stage
      this.errorMessage = getSafeErrorMessage(error)
    },

    async loadManufacturers(api: VehicleDictionaryApi = createDefaultApi()) {
      const generation = this.startRequest('manufacturers')
      try {
        const items = await api.getManufacturers()
        if (!this.isCurrent('manufacturers', generation)) return
        this.manufacturers = items
        this.finishRequest('manufacturers', generation)
      } catch (error: unknown) {
        this.failRequest('manufacturers', generation, error)
      }
    },

    async selectManufacturer(
      manufacturerId: number | undefined,
      api: VehicleDictionaryApi = createDefaultApi()
    ) {
      this.generations.vehicles += 1
      this.generations.modifications += 1
      this.manufacturerId = manufacturerId
      this.vehicleId = undefined
      this.modificationId = undefined
      this.vehicles = []
      this.modifications = []
      this.confirmed = undefined
      this.validationErrors = {}
      if (manufacturerId === undefined) {
        this.status = 'idle'
        this.failedStage = undefined
        return
      }

      const generation = this.startRequest('vehicles')
      try {
        const items = await api.getVehicles(manufacturerId)
        if (!this.isCurrent('vehicles', generation) || this.manufacturerId !== manufacturerId)
          return
        this.vehicles = items
        this.finishRequest('vehicles', generation)
      } catch (error: unknown) {
        this.failRequest('vehicles', generation, error)
      }
    },

    async selectVehicle(
      vehicleId: number | undefined,
      api: VehicleDictionaryApi = createDefaultApi()
    ) {
      this.generations.modifications += 1
      this.vehicleId = vehicleId
      this.modificationId = undefined
      this.modifications = []
      this.confirmed = undefined
      this.validationErrors.vehicle = undefined
      this.validationErrors.modification = undefined
      if (vehicleId === undefined) {
        this.status = 'idle'
        this.failedStage = undefined
        return
      }

      const generation = this.startRequest('modifications')
      try {
        const items = await api.getModifications(vehicleId)
        if (!this.isCurrent('modifications', generation) || this.vehicleId !== vehicleId) return
        this.modifications = items
        this.finishRequest('modifications', generation)
      } catch (error: unknown) {
        this.failRequest('modifications', generation, error)
      }
    },

    selectModification(modificationId: number | undefined) {
      this.modificationId = modificationId
      this.confirmed = undefined
      this.validationErrors.modification = undefined
      this.status = 'idle'
    },

    confirmSelection(): VehicleContext | undefined {
      this.validationErrors = {
        ...(!this.selectedManufacturer ? { manufacturer: 'Выберите производителя.' } : {}),
        ...(!this.selectedVehicle ? { vehicle: 'Выберите транспортное средство.' } : {}),
        ...(!this.selectedModification ? { modification: 'Выберите модификацию.' } : {})
      }
      if (!this.selectedManufacturer || !this.selectedVehicle || !this.selectedModification) {
        return undefined
      }
      if (
        this.selectedVehicle.manufacturerId !== this.selectedManufacturer.id ||
        this.selectedModification.vehicleId !== this.selectedVehicle.id
      ) {
        return undefined
      }

      this.confirmed = createVehicleContext(
        this.selectedManufacturer,
        this.selectedVehicle,
        this.selectedModification
      )
      this.status = 'ready'
      return this.confirmed
    },

    async resolveFromUrl(
      modificationId: number | undefined,
      api: VehicleDictionaryApi = createDefaultApi()
    ): Promise<VehicleContext | undefined> {
      if (modificationId === undefined) {
        this.clearSelection()
        return undefined
      }
      if (this.confirmed?.modification.id === modificationId) return this.confirmed

      this.pendingResolutionId = modificationId
      this.confirmed = undefined
      const generation = this.startRequest('resolution')
      try {
        const context = await resolveVehicleContext(modificationId, api)
        if (
          !this.isCurrent('resolution', generation) ||
          this.pendingResolutionId !== modificationId
        ) {
          return undefined
        }
        this.manufacturers = [context.manufacturer]
        this.vehicles = [context.vehicle]
        this.modifications = [context.modification]
        this.manufacturerId = context.manufacturer.id
        this.vehicleId = context.vehicle.id
        this.modificationId = context.modification.id
        this.confirmed = context
        this.status = 'ready'
        this.failedStage = undefined
        return context
      } catch (error: unknown) {
        if (!this.isCurrent('resolution', generation)) return undefined
        const normalized = normalizeAppError(error)
        this.clearSelection(false)
        this.pendingResolutionId = modificationId
        if (normalized.statusCode === 404 || normalized.code === 'VEHICLE_NOT_FOUND') {
          this.status = 'invalid'
          this.failedStage = undefined
          return undefined
        }
        this.failRequest('resolution', generation, normalized)
        return undefined
      }
    },

    async retry(api: VehicleDictionaryApi = createDefaultApi()) {
      if (this.failedStage === 'vehicles') return this.selectManufacturer(this.manufacturerId, api)
      if (this.failedStage === 'modifications') return this.selectVehicle(this.vehicleId, api)
      if (this.failedStage === 'resolution')
        return this.resolveFromUrl(this.pendingResolutionId, api)
      return this.loadManufacturers(api)
    },

    async beginEdit(api: VehicleDictionaryApi = createDefaultApi()) {
      const context = this.confirmed
      if (!context) return this.loadManufacturers(api)
      await this.loadManufacturers(api)
      if (this.status === 'error') return
      this.manufacturerId = context.manufacturer.id
      const vehicles = await api.getVehicles(context.manufacturer.id)
      this.vehicles = vehicles
      this.vehicleId = context.vehicle.id
      this.modifications = await api.getModifications(context.vehicle.id)
      this.modificationId = context.modification.id
      this.status = 'idle'
    },

    clearSelection(clearDictionaries = true) {
      if (clearDictionaries) this.manufacturers = []
      this.vehicles = []
      this.modifications = []
      this.manufacturerId = undefined
      this.vehicleId = undefined
      this.modificationId = undefined
      this.confirmed = undefined
      this.status = 'idle'
      this.errorMessage = ''
      this.validationErrors = {}
      this.failedStage = undefined
    },

    clear() {
      this.clearSelection()
      this.pendingResolutionId = undefined
    }
  }
})
