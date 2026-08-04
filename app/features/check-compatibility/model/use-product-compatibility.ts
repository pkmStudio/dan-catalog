import { compatibilityResponseSchema, type CompatibilityResult } from '~/entities/compatibility'
import { apiRequest, getProductCompatibility, getSafeErrorMessage } from '~/shared/api'

export type CompatibilityLoadStatus = 'idle' | 'loading' | 'ready' | 'error'

export const useProductCompatibility = (
  productId: Readonly<Ref<string>>,
  modificationId: Readonly<Ref<string | undefined>>
) => {
  const status = ref<CompatibilityLoadStatus>('idle')
  const result = ref<CompatibilityResult>()
  const errorMessage = ref('')

  const load = async () => {
    if (!modificationId.value) {
      status.value = 'idle'
      result.value = undefined
      errorMessage.value = ''
      return
    }

    status.value = 'loading'
    result.value = undefined
    errorMessage.value = ''
    try {
      const response = await apiRequest(
        getProductCompatibility(productId.value, modificationId.value),
        (value) => compatibilityResponseSchema.parse(value)
      )
      result.value = response.data
      status.value = 'ready'
    } catch (error: unknown) {
      status.value = 'error'
      errorMessage.value = getSafeErrorMessage(error)
    }
  }

  watch([productId, modificationId], load, { immediate: true })

  return { errorMessage, load, result, status }
}
