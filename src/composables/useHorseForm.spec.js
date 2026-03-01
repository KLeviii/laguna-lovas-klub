import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../services/horseService.js', () => ({
  createHorse: vi.fn(),
  updateHorse: vi.fn(),
  fetchHorseForEdit: vi.fn(),
  fetchParentOptions: vi.fn(),
}))

vi.mock('@/services/supabase', () => ({
  supabase: {
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn().mockResolvedValue({ data: {}, error: null }),
        getPublicUrl: vi.fn(() => ({ data: { publicUrl: 'https://example.com/img.jpg' } })),
      })),
    },
  },
}))

import { useHorseForm } from './useHorseForm.js'

describe('useHorseForm', () => {
  let form

  beforeEach(() => {
    vi.clearAllMocks()
    form = useHorseForm()
    form.resetForm()
  })

  // ── validateForm ─────────────────────────────────────────────
  describe('validateForm', () => {
    it('returns false and sets error when name is empty', () => {
      form.name.value = ''
      form.gender.value = 'male'

      const isValid = form.validateForm()

      expect(isValid).toBe(false)
      expect(form.formErrors.value.name).toBeDefined()
    })

    it('returns false and sets error when gender is empty', () => {
      form.name.value = 'Test Horse'
      form.gender.value = ''

      const isValid = form.validateForm()

      expect(isValid).toBe(false)
      expect(form.formErrors.value.gender).toBeDefined()
    })

    it('returns true when name and gender are valid', () => {
      form.name.value = 'Test Horse'
      form.gender.value = 'male'

      const isValid = form.validateForm()

      expect(isValid).toBe(true)
      expect(Object.keys(form.formErrors.value)).toHaveLength(0)
    })

    it('returns false when birth year is in the future', () => {
      form.name.value = 'Test Horse'
      form.gender.value = 'female'
      form.birth_date.value = '2099-01-01'

      const isValid = form.validateForm()

      expect(isValid).toBe(false)
      expect(form.formErrors.value.birth_date).toBeDefined()
    })

    it('returns false when sire and dam are the same', () => {
      form.name.value = 'Test Horse'
      form.gender.value = 'male'
      form.sire_id.value = 'same-id'
      form.dam_id.value = 'same-id'

      const isValid = form.validateForm()

      expect(isValid).toBe(false)
      expect(form.formErrors.value.sire_id).toBeDefined()
    })
  })

  // ── resetForm ────────────────────────────────────────────────
  describe('resetForm', () => {
    it('clears all form fields to defaults', () => {
      form.name.value = 'Some Horse'
      form.gender.value = 'female'
      form.description.value = 'A description'
      form.is_for_sale.value = true
      form.sire_id.value = 's1'
      form.dam_id.value = 'd1'
      form.formErrors.value = { name: 'Error' }
      form.editingHorseId.value = 'h1'

      form.resetForm()

      expect(form.name.value).toBe('')
      expect(form.gender.value).toBe('')
      expect(form.description.value).toBe('')
      expect(form.is_for_sale.value).toBe(false)
      expect(form.sire_id.value).toBeNull()
      expect(form.dam_id.value).toBeNull()
      expect(Object.keys(form.formErrors.value)).toHaveLength(0)
      expect(form.editingHorseId.value).toBeNull()
    })

    it('resets main_image_url to null', () => {
      form.main_image_url.value = 'https://example.com/img.jpg'

      form.resetForm()

      expect(form.main_image_url.value).toBeNull()
    })
  })
})
