import type { CompatibilityResult } from '~/entities/compatibility'

export type CompatibilityLoadStatus = 'idle' | 'loading' | 'ready' | 'error'

export const useProductCompatibility = (
  _productId: Readonly<Ref<string>>,
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

    result.value = undefined
    status.value = 'error'
    errorMessage.value = 'Источник данных о совместимости пока не подключён.'
  }

  watch(modificationId, load, { immediate: true })

  return { errorMessage, load, result, status }
}
