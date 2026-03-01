import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/services/competitionService.js', () => ({
  createCompetition: vi.fn(),
  updateCompetition: vi.fn(),
  createCompetitionResult: vi.fn(),
  deleteCompetitionResult: vi.fn(),
  uploadCompetitionImage: vi.fn(),
}))

import { useCompetitionForm } from './useCompetitionForm.js'
import {
  createCompetitionResult,
  deleteCompetitionResult,
} from '@/services/competitionService.js'

describe('useCompetitionForm', () => {
  let form

  beforeEach(() => {
    vi.clearAllMocks()
    form = useCompetitionForm()
    form.clearCompetitionForm()
  })

  // ── validateForm (via saveCompetition) ───────────────────────
  describe('saveCompetition validation', () => {
    it('sets error when competition name is empty', async () => {
      form.competitionName.value = ''
      form.competitionLocation.value = 'Budapest'
      form.startDate.value = '2024-06-01'

      const result = await form.saveCompetition()

      expect(result).toBe(false)
      expect(form.error.value).toContain('verseny neve')
    })

    it('sets error when location is empty', async () => {
      form.competitionName.value = 'Verseny A'
      form.competitionLocation.value = ''
      form.startDate.value = '2024-06-01'

      const result = await form.saveCompetition()

      expect(result).toBe(false)
      expect(form.error.value).toContain('helyszín')
    })

    it('sets error when start date is missing', async () => {
      form.competitionName.value = 'Verseny A'
      form.competitionLocation.value = 'Budapest'
      form.startDate.value = ''

      const result = await form.saveCompetition()

      expect(result).toBe(false)
      expect(form.error.value).toContain('kezdő dátum')
    })

    it('sets error when end date is before start date', async () => {
      form.competitionName.value = 'Verseny A'
      form.competitionLocation.value = 'Budapest'
      form.startDate.value = '2024-06-15'
      form.endDate.value = '2024-06-01'

      const result = await form.saveCompetition()

      expect(result).toBe(false)
      expect(form.error.value).toContain('záró dátum')
    })
  })

  // ── addResult ────────────────────────────────────────────────
  describe('addResult', () => {
    it('calls createCompetitionResult and returns the created record', async () => {
      const created = { id: 'r1', competition_id: 'c1', jockey_name: 'Lovas A' }
      createCompetitionResult.mockResolvedValueOnce(created)

      const resultData = { competition_id: 'c1', jockey_name: 'Lovas A', placement: 1 }
      const result = await form.addResult(resultData)

      expect(result).toEqual(created)
      expect(createCompetitionResult).toHaveBeenCalledWith(resultData)
      expect(form.loading.value).toBe(false)
    })

    it('returns null and sets error on failure', async () => {
      createCompetitionResult.mockRejectedValueOnce(new Error('DB error'))

      const result = await form.addResult({ competition_id: 'c1' })

      expect(result).toBeNull()
      expect(form.error.value).toBe('DB error')
    })
  })

  // ── removeResult ─────────────────────────────────────────────
  describe('removeResult', () => {
    it('calls deleteCompetitionResult and returns true on success', async () => {
      deleteCompetitionResult.mockResolvedValueOnce()

      const result = await form.removeResult('r1')

      expect(result).toBe(true)
      expect(deleteCompetitionResult).toHaveBeenCalledWith('r1')
      expect(form.loading.value).toBe(false)
    })

    it('returns false and sets error on failure', async () => {
      deleteCompetitionResult.mockRejectedValueOnce(new Error('Delete failed'))

      const result = await form.removeResult('r1')

      expect(result).toBe(false)
      expect(form.error.value).toBe('Delete failed')
    })
  })

  // ── clearCompetitionForm ─────────────────────────────────────
  describe('clearCompetitionForm', () => {
    it('resets all fields to defaults', () => {
      form.competitionName.value = 'Test'
      form.competitionLocation.value = 'Budapest'
      form.startDate.value = '2024-01-01'
      form.endDate.value = '2024-01-02'
      form.competitionDescription.value = 'Desc'
      form.competitionImageUrl.value = 'http://img.jpg'
      form.editingCompetitionId.value = 'c1'
      form.error.value = 'Some error'

      form.clearCompetitionForm()

      expect(form.competitionName.value).toBe('')
      expect(form.competitionLocation.value).toBe('')
      expect(form.startDate.value).toBe('')
      expect(form.endDate.value).toBe('')
      expect(form.competitionDescription.value).toBe('')
      expect(form.competitionImageUrl.value).toBe('')
      expect(form.editingCompetitionId.value).toBeNull()
      expect(form.error.value).toBeNull()
    })
  })

  // ── handleImageSelect ────────────────────────────────────────
  describe('handleImageSelect', () => {
    it('accepts valid image file', () => {
      const file = new File([''], 'photo.jpg', { type: 'image/jpeg' })
      Object.defineProperty(file, 'size', { value: 1024 })

      form.handleImageSelect(file)

      expect(form.competitionImageFile.value).toBe(file)
      expect(form.error.value).toBeNull()
    })

    it('rejects non-image file', () => {
      const file = new File([''], 'doc.pdf', { type: 'application/pdf' })

      form.handleImageSelect(file)

      expect(form.competitionImageFile.value).toBeNull()
      expect(form.error.value).toContain('képfájlok')
    })

    it('clears file when null is passed', () => {
      form.handleImageSelect(null)

      expect(form.competitionImageFile.value).toBeNull()
    })
  })
})
