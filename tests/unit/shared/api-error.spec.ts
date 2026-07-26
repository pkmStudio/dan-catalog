import { describe, expect, it } from 'vitest'
import { AppError, normalizeAppError } from '~/shared/api'

describe('normalizeAppError', () => {
  it('preserves a normalized application error', () => {
    const error = new AppError({ code: 'NOT_FOUND', message: 'Товар не найден' })
    expect(normalizeAppError(error)).toBe(error)
  })

  it('reads the public API error envelope', () => {
    expect(
      normalizeAppError({
        statusCode: 422,
        data: {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Проверьте поля формы',
            fieldErrors: { phone: 'Укажите корректный номер' },
            requestId: 'req-1'
          }
        }
      })
    ).toMatchObject({
      code: 'VALIDATION_ERROR',
      message: 'Проверьте поля формы',
      fieldErrors: { phone: 'Укажите корректный номер' },
      requestId: 'req-1',
      statusCode: 422
    })
  })

  it('does not expose an unknown technical error message', () => {
    expect(normalizeAppError(new Error('ECONNREFUSED internal-host:8080'))).toMatchObject({
      code: 'REQUEST_FAILED',
      message: 'Не удалось выполнить запрос. Попробуйте ещё раз.'
    })
  })
})
