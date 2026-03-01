import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/services/competitionService.js', () => ({
  fetchAllCompetitions: vi.fn(),
}))

import { useCompetitions } from './useCompetitions.js'
import { fetchAllCompetitions } from '@/services/competitionService.js'

describe('useCompetitions', () => {
  let competitions

  beforeEach(() => {
    vi.clearAllMocks()
    competitions = useCompetitions()
  })

  // ── loadCompetitions ─────────────────────────────────────────
  describe('loadCompetitions', () => {
    it('populates competitions array on success', async () => {
      const mockCompetitions = [
        { id: '1', name: 'Verseny A', start_date: '2024-06-01', competition_results: [] },
        { id: '2', name: 'Verseny B', start_date: '2024-07-15', competition_results: [] },
      ]
      fetchAllCompetitions.mockResolvedValueOnce(mockCompetitions)

      await competitions.loadCompetitions()

      expect(competitions.competitions.value).toHaveLength(2)
      expect(competitions.loading.value).toBe(false)
      expect(competitions.error.value).toBeNull()
      expect(competitions.isEmpty.value).toBe(false)
    })

    it('sets error on failure', async () => {
      fetchAllCompetitions.mockRejectedValueOnce(new Error('Network error'))

      await competitions.loadCompetitions()

      expect(competitions.competitions.value).toEqual([])
      expect(competitions.error.value).toBe('Network error')
      expect(competitions.isEmpty.value).toBe(true)
    })

    it('sets loading to true while fetching', async () => {
      let resolvePromise
      fetchAllCompetitions.mockImplementationOnce(
        () => new Promise((resolve) => { resolvePromise = resolve }),
      )

      const promise = competitions.loadCompetitions()
      expect(competitions.loading.value).toBe(true)

      resolvePromise([])
      await promise
      expect(competitions.loading.value).toBe(false)
    })
  })

  // ── competitionsByYear ───────────────────────────────────────
  describe('competitionsByYear', () => {
    it('groups competitions by year in descending order', async () => {
      const mockCompetitions = [
        { id: '1', name: 'A', start_date: '2024-06-01', competition_results: [] },
        { id: '2', name: 'B', start_date: '2023-03-10', competition_results: [] },
        { id: '3', name: 'C', start_date: '2024-09-20', competition_results: [] },
      ]
      fetchAllCompetitions.mockResolvedValueOnce(mockCompetitions)
      await competitions.loadCompetitions()

      const byYear = competitions.competitionsByYear.value
      expect(byYear).toHaveLength(2)
      expect(byYear[0].year).toBe('2024')
      expect(byYear[0].competitions).toHaveLength(2)
      expect(byYear[1].year).toBe('2023')
      expect(byYear[1].competitions).toHaveLength(1)
    })
  })

  // ── stats ────────────────────────────────────────────────────
  describe('stats', () => {
    it('computes correct statistics from results', async () => {
      const mockCompetitions = [
        {
          id: '1',
          name: 'A',
          start_date: '2024-06-01',
          competition_results: [
            { jockey_name: 'Lovas A', placement: 1 },
            { jockey_name: 'Lovas B', placement: 2 },
          ],
        },
        {
          id: '2',
          name: 'B',
          start_date: '2024-07-01',
          competition_results: [
            { jockey_name: 'Lovas A', placement: 1 },
          ],
        },
      ]
      fetchAllCompetitions.mockResolvedValueOnce(mockCompetitions)
      await competitions.loadCompetitions()

      const stats = competitions.stats.value
      expect(stats.uniqueJockeys).toBe(2)
      expect(stats.firstPlaceCount).toBe(2)
      expect(stats.totalPlacements).toBe(3)
    })
  })
})
