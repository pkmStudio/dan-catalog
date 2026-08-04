import { defineStore } from 'pinia'
import {
  vehicleMakeListResponseSchema,
  vehicleModelListResponseSchema,
  vehicleModificationListResponseSchema,
  type VehicleContext,
  type VehicleMake,
  type VehicleModel,
  type VehicleModification
} from '~/entities/vehicle'
import {
  apiRequest,
  getSafeErrorMessage,
  getVehicleMakes,
  getVehicleModels,
  getVehicleModifications
} from '~/shared/api'

export type VehicleSelectionStatus = 'idle' | 'loading' | 'ready' | 'invalid' | 'error'
export type VehicleSelectionStage = 'makes' | 'models' | 'modifications' | 'resolution'

export interface VehicleDictionaryApi {
  getMakes: () => Promise<VehicleMake[]>
  getModels: (makeId: string) => Promise<VehicleModel[]>
  getModifications: (modelId: string) => Promise<VehicleModification[]>
}

interface VehicleSelectionState {
  makes: VehicleMake[]
  models: VehicleModel[]
  modifications: VehicleModification[]
  makeId: string
  modelId: string
  modificationId: string
  confirmed?: VehicleContext
  status: VehicleSelectionStatus
  errorMessage: string
  validationErrors: Partial<Record<'make' | 'model' | 'modification', string>>
  failedStage?: VehicleSelectionStage
}

const createDefaultApi = (): VehicleDictionaryApi => {
  const apiBase = String(useRuntimeConfig().public.apiBase || '/api')

  return {
    getMakes: async () =>
      (
        await apiRequest(getVehicleMakes(), (value) => vehicleMakeListResponseSchema.parse(value), {
          apiBase
        })
      ).data,
    getModels: async (makeId) =>
      (
        await apiRequest(
          getVehicleModels(makeId),
          (value) => vehicleModelListResponseSchema.parse(value),
          { apiBase }
        )
      ).data,
    getModifications: async (modelId) =>
      (
        await apiRequest(
          getVehicleModifications(modelId),
          (value) => vehicleModificationListResponseSchema.parse(value),
          { apiBase }
        )
      ).data
  }
}

const createContext = (
  make: VehicleMake,
  model: VehicleModel,
  modification: VehicleModification
): VehicleContext => ({
  make,
  model,
  modification,
  displayName: `${make.name} ${model.name} · ${modification.displayName}`
})

export const resolveVehicleContext = async (
  modificationId: string,
  api: VehicleDictionaryApi = createDefaultApi()
): Promise<
  | {
      context: VehicleContext
      makes: VehicleMake[]
      models: VehicleModel[]
      modifications: VehicleModification[]
    }
  | undefined
> => {
  const makes = await api.getMakes()

  for (const make of makes) {
    const models = await api.getModels(make.id)
    for (const model of models) {
      const modifications = await api.getModifications(model.id)
      const modification = modifications.find((item) => item.id === modificationId)
      if (modification) {
        return {
          context: createContext(make, model, modification),
          makes,
          models,
          modifications
        }
      }
    }
  }

  return undefined
}

export const useVehicleSelectionStore = defineStore('vehicle-selection', {
  state: (): VehicleSelectionState => ({
    makes: [],
    models: [],
    modifications: [],
    makeId: '',
    modelId: '',
    modificationId: '',
    status: 'idle',
    errorMessage: '',
    validationErrors: {}
  }),

  getters: {
    selectedMake: (state): VehicleMake | undefined =>
      state.makes.find((make) => make.id === state.makeId),
    selectedModel: (state): VehicleModel | undefined =>
      state.models.find((model) => model.id === state.modelId),
    selectedModification: (state): VehicleModification | undefined =>
      state.modifications.find((modification) => modification.id === state.modificationId)
  },

  actions: {
    beginLoad(stage: VehicleSelectionStage) {
      this.status = 'loading'
      this.errorMessage = ''
      this.failedStage = stage
    },

    failLoad(error: unknown) {
      this.status = 'error'
      this.errorMessage = getSafeErrorMessage(error)
    },

    async loadMakes(api: VehicleDictionaryApi = createDefaultApi()) {
      this.beginLoad('makes')
      try {
        this.makes = await api.getMakes()
        this.status = 'idle'
        this.failedStage = undefined
      } catch (error: unknown) {
        this.failLoad(error)
      }
    },

    async selectMake(makeId: string, api: VehicleDictionaryApi = createDefaultApi()) {
      this.makeId = makeId
      this.modelId = ''
      this.modificationId = ''
      this.models = []
      this.modifications = []
      this.confirmed = undefined
      this.validationErrors = {}
      if (!makeId) {
        this.status = 'idle'
        return
      }

      this.beginLoad('models')
      try {
        this.models = await api.getModels(makeId)
        this.status = 'idle'
        this.failedStage = undefined
      } catch (error: unknown) {
        this.failLoad(error)
      }
    },

    async selectModel(modelId: string, api: VehicleDictionaryApi = createDefaultApi()) {
      this.modelId = modelId
      this.modificationId = ''
      this.modifications = []
      this.confirmed = undefined
      this.validationErrors.model = undefined
      this.validationErrors.modification = undefined
      if (!modelId) {
        this.status = 'idle'
        return
      }

      this.beginLoad('modifications')
      try {
        this.modifications = await api.getModifications(modelId)
        this.status = 'idle'
        this.failedStage = undefined
      } catch (error: unknown) {
        this.failLoad(error)
      }
    },

    selectModification(modificationId: string) {
      this.modificationId = modificationId
      this.confirmed = undefined
      this.validationErrors.modification = undefined
      this.status = 'idle'
    },

    confirmSelection(): VehicleContext | undefined {
      this.validationErrors = {
        ...(!this.selectedMake ? { make: 'Выберите марку автомобиля.' } : {}),
        ...(!this.selectedModel ? { model: 'Выберите модель автомобиля.' } : {}),
        ...(!this.selectedModification ? { modification: 'Выберите модификацию автомобиля.' } : {})
      }

      if (!this.selectedMake || !this.selectedModel || !this.selectedModification) return undefined

      this.confirmed = createContext(
        this.selectedMake,
        this.selectedModel,
        this.selectedModification
      )
      this.status = 'ready'
      return this.confirmed
    },

    async resolveFromUrl(
      modificationId: string | undefined,
      api: VehicleDictionaryApi = createDefaultApi()
    ): Promise<VehicleContext | undefined> {
      if (!modificationId) {
        this.clear()
        return undefined
      }

      if (this.confirmed?.modification.id === modificationId) return this.confirmed

      this.beginLoad('resolution')
      this.confirmed = undefined
      try {
        const resolved = await resolveVehicleContext(modificationId, api)
        if (!resolved) {
          this.makeId = ''
          this.modelId = ''
          this.modificationId = ''
          this.models = []
          this.modifications = []
          this.status = 'invalid'
          this.failedStage = undefined
          return undefined
        }

        this.makes = resolved.makes
        this.models = resolved.models
        this.modifications = resolved.modifications
        this.makeId = resolved.context.make.id
        this.modelId = resolved.context.model.id
        this.modificationId = resolved.context.modification.id
        this.confirmed = resolved.context
        this.status = 'ready'
        this.failedStage = undefined
        return resolved.context
      } catch (error: unknown) {
        this.failLoad(error)
        return undefined
      }
    },

    async retry(api: VehicleDictionaryApi = createDefaultApi()) {
      if (this.failedStage === 'models') return this.selectMake(this.makeId, api)
      if (this.failedStage === 'modifications') return this.selectModel(this.modelId, api)
      if (this.failedStage === 'resolution') return this.resolveFromUrl(this.modificationId, api)
      return this.loadMakes(api)
    },

    clear() {
      this.makes = []
      this.models = []
      this.modifications = []
      this.makeId = ''
      this.modelId = ''
      this.modificationId = ''
      this.confirmed = undefined
      this.status = 'idle'
      this.errorMessage = ''
      this.validationErrors = {}
      this.failedStage = undefined
    }
  }
})
