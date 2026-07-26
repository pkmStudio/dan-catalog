export const MOCK_DELAY_MS = 180

export const mockDelay = (milliseconds = MOCK_DELAY_MS): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, Math.max(0, milliseconds)))

export const isDeterministicFailure = (value: unknown, trigger = 'error'): boolean =>
  typeof value === 'string' && value.trim().toLowerCase() === trigger.toLowerCase()
