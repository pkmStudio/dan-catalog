interface ContactFormState {
  name: string
  phone: string
  message: string
}

const getRequestErrorMessage = (requestError: unknown): string => {
  if (typeof requestError !== 'object' || requestError === null || !('data' in requestError)) {
    return 'Не удалось отправить сообщение'
  }

  const data = requestError.data
  if (typeof data !== 'object' || data === null || !('message' in data)) {
    return 'Не удалось отправить сообщение'
  }

  return typeof data.message === 'string' ? data.message : 'Не удалось отправить сообщение'
}

export const useContactForm = () => {
  const error = ref('')
  const submitting = ref(false)
  const phoneTouched = ref(false)
  const form = reactive<ContactFormState>({ name: '', phone: '', message: '' })

  const phoneDigits = computed(() => form.phone.replace(/\D/g, ''))
  const phoneValid = computed(() => /^7\d{10}$/.test(phoneDigits.value))
  const phoneError = computed(() =>
    phoneTouched.value && !phoneValid.value ? 'Введите 10 цифр номера телефона' : ''
  )

  const onNameInput = (event: Event) => {
    const input = event.target as HTMLInputElement
    form.name = input.value.replace(/[^\p{L}\s-]/gu, '')
    input.value = form.name
  }

  const formatPhone = (value: string) => {
    let digits = value.replace(/\D/g, '')
    if (digits.startsWith('8')) digits = `7${digits.slice(1)}`
    if (!digits.startsWith('7')) digits = `7${digits}`
    digits = digits.slice(0, 11)

    const local = digits.slice(1)
    let result = '+7'
    if (local.length) result += ` (${local.slice(0, 3)}`
    if (local.length >= 3) result += ')'
    if (local.length > 3) result += ` ${local.slice(3, 6)}`
    if (local.length > 6) result += `-${local.slice(6, 8)}`
    if (local.length > 8) result += `-${local.slice(8, 10)}`
    return result
  }

  const onPhoneInput = (event: Event) => {
    const input = event.target as HTMLInputElement
    form.phone = formatPhone(input.value)
    input.value = form.phone
  }

  const touchPhone = () => {
    phoneTouched.value = true
  }

  const submit = async () => {
    error.value = ''
    touchPhone()
    if (!phoneValid.value) return

    submitting.value = true
    try {
      const response = await $fetch<{ data: { id: string } }>('/api/feedback', {
        method: 'POST',
        body: form
      })
      await navigateTo({ path: '/contacts', query: { request: response.data.id } })
    } catch (requestError: unknown) {
      error.value = getRequestErrorMessage(requestError)
    } finally {
      submitting.value = false
    }
  }

  return {
    form,
    error,
    submitting,
    phoneError,
    onNameInput,
    onPhoneInput,
    touchPhone,
    submit
  }
}
