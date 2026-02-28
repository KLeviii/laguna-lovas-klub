import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@/services/contactService.js', () => ({
  submitContactForm: vi.fn(),
}))

import { useContactForm } from './useContactForm.js'
import { submitContactForm } from '@/services/contactService.js'

describe('useContactForm', () => {
  let form

  beforeEach(() => {
    vi.clearAllMocks()
    form = useContactForm()
    form.clearForm()
  })

  it('clearForm resets all fields', () => {
    form.name.value = 'Test'
    form.email.value = 'test@test.com'
    form.phone.value = '123'
    form.subject.value = 'Subject'
    form.message.value = 'Hello'
    form.consent.value = true

    form.clearForm()

    expect(form.name.value).toBe('')
    expect(form.email.value).toBe('')
    expect(form.phone.value).toBe('')
    expect(form.subject.value).toBe('')
    expect(form.message.value).toBe('')
    expect(form.consent.value).toBe(false)
    expect(form.error.value).toBeNull()
    expect(form.success.value).toBe(false)
  })

  it('sendMessage fails when name is empty', async () => {
    form.email.value = 'test@test.com'
    form.message.value = 'Hello'
    form.consent.value = true

    const result = await form.sendMessage()

    expect(result).toBe(false)
    expect(form.error.value).toContain('név')
  })

  it('sendMessage fails when email is empty', async () => {
    form.name.value = 'Test'
    form.message.value = 'Hello'
    form.consent.value = true

    const result = await form.sendMessage()

    expect(result).toBe(false)
    expect(form.error.value).toContain('email')
  })

  it('sendMessage fails when email format is invalid', async () => {
    form.name.value = 'Test'
    form.email.value = 'not-an-email'
    form.message.value = 'Hello'
    form.consent.value = true

    const result = await form.sendMessage()

    expect(result).toBe(false)
    expect(form.error.value).toContain('email')
  })

  it('sendMessage fails when message is empty', async () => {
    form.name.value = 'Test'
    form.email.value = 'test@test.com'
    form.consent.value = true

    const result = await form.sendMessage()

    expect(result).toBe(false)
    expect(form.error.value).toContain('üzenet')
  })

  it('sendMessage fails when consent is not given', async () => {
    form.name.value = 'Test'
    form.email.value = 'test@test.com'
    form.message.value = 'Hello'
    form.consent.value = false

    const result = await form.sendMessage()

    expect(result).toBe(false)
    expect(form.error.value).toContain('adatvédelmi')
  })

  it('sendMessage succeeds with valid data', async () => {
    submitContactForm.mockResolvedValueOnce({})

    form.name.value = 'Test User'
    form.email.value = 'test@test.com'
    form.message.value = 'Hello world'
    form.consent.value = true

    const result = await form.sendMessage()

    expect(result).toBe(true)
    expect(form.success.value).toBe(true)
    expect(form.error.value).toBeNull()
    expect(submitContactForm).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@test.com',
      phone: null,
      subject: null,
      message: 'Hello world',
    })
  })

  it('sendMessage handles service error', async () => {
    submitContactForm.mockRejectedValueOnce(new Error('Network error'))

    form.name.value = 'Test'
    form.email.value = 'test@test.com'
    form.message.value = 'Hello'
    form.consent.value = true

    const result = await form.sendMessage()

    expect(result).toBe(false)
    expect(form.error.value).toBe('Network error')
  })

  it('sendMessage sets loading during submission', async () => {
    let resolvePromise
    submitContactForm.mockImplementationOnce(() => new Promise((resolve) => { resolvePromise = resolve }))

    form.name.value = 'Test'
    form.email.value = 'test@test.com'
    form.message.value = 'Hello'
    form.consent.value = true

    const promise = form.sendMessage()
    expect(form.loading.value).toBe(true)

    resolvePromise({})
    await promise
    expect(form.loading.value).toBe(false)
  })
})
