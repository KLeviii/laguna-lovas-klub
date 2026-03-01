import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Supabase mock ──────────────────────────────────────────────
let mockChain

function createMockChain(resolveValue = { data: null, error: null }) {
  const chain = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
  }
  chain.then = vi.fn((resolve) => resolve(resolveValue))
  chain._resolve = (val) => {
    chain.then = vi.fn((resolve) => resolve(val))
  }
  return chain
}

vi.mock('./supabase', () => ({
  supabase: {
    from: vi.fn(() => mockChain),
    storage: { from: vi.fn() },
  },
}))

import { supabase } from './supabase'
import {
  fetchAllCompetitions,
  createCompetition,
  deleteCompetition,
  createCompetitionResult,
} from './competitionService'

// ── Tests ──────────────────────────────────────────────────────
describe('competitionService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockChain = createMockChain()
  })

  // ── fetchAllCompetitions ─────────────────────────────────────
  describe('fetchAllCompetitions', () => {
    it('returns all competitions on success', async () => {
      const competitions = [{ id: '1', name: 'Verseny A' }]
      mockChain._resolve({ data: competitions, error: null })

      const result = await fetchAllCompetitions()
      expect(result).toEqual(competitions)
      expect(supabase.from).toHaveBeenCalledWith('competitions')
      expect(mockChain.order).toHaveBeenCalledWith('start_date', { ascending: false })
    })

    it('returns empty array when data is null', async () => {
      mockChain._resolve({ data: null, error: null })

      const result = await fetchAllCompetitions()
      expect(result).toEqual([])
    })

    it('throws on query error', async () => {
      mockChain._resolve({ data: null, error: { message: 'db error' } })

      await expect(fetchAllCompetitions()).rejects.toThrow('Failed to fetch competitions')
    })
  })

  // ── createCompetition ────────────────────────────────────────
  describe('createCompetition', () => {
    it('creates a competition and returns the record', async () => {
      const created = { id: 'c1', name: 'Verseny B' }
      mockChain._resolve({ data: created, error: null })

      const result = await createCompetition({ name: 'Verseny B', location: 'Budapest' })
      expect(result).toEqual(created)
      expect(supabase.from).toHaveBeenCalledWith('competitions')
      expect(mockChain.insert).toHaveBeenCalledWith([{ name: 'Verseny B', location: 'Budapest' }])
    })

    it('throws on insert error', async () => {
      mockChain._resolve({ data: null, error: { message: 'insert fail' } })

      await expect(createCompetition({ name: 'X' })).rejects.toThrow('Failed to create competition')
    })
  })

  // ── deleteCompetition ────────────────────────────────────────
  describe('deleteCompetition', () => {
    it('deletes competition without throwing on success', async () => {
      mockChain._resolve({ data: null, error: null })

      await expect(deleteCompetition('c1')).resolves.toBeUndefined()
      expect(supabase.from).toHaveBeenCalledWith('competitions')
      expect(mockChain.delete).toHaveBeenCalled()
      expect(mockChain.eq).toHaveBeenCalledWith('id', 'c1')
    })

    it('throws on delete error', async () => {
      mockChain._resolve({ data: null, error: { message: 'delete fail' } })

      await expect(deleteCompetition('c1')).rejects.toThrow('Failed to delete competition')
    })
  })

  // ── createCompetitionResult ──────────────────────────────────
  describe('createCompetitionResult', () => {
    it('creates a result and returns the record', async () => {
      const created = { id: 'r1', competition_id: 'c1', jockey_name: 'Teszt Lovas' }
      mockChain._resolve({ data: created, error: null })

      const resultData = { competition_id: 'c1', jockey_name: 'Teszt Lovas', placement: 1 }
      const result = await createCompetitionResult(resultData)
      expect(result).toEqual(created)
      expect(supabase.from).toHaveBeenCalledWith('competition_results')
      expect(mockChain.insert).toHaveBeenCalledWith([resultData])
    })

    it('throws on insert error', async () => {
      mockChain._resolve({ data: null, error: { message: 'result fail' } })

      await expect(createCompetitionResult({ competition_id: 'c1' })).rejects.toThrow(
        'Failed to create competition result',
      )
    })
  })
})
