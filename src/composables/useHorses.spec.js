import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../services/horseService.js', () => ({
  fetchAllHorses: vi.fn(),
  fetchHorseById: vi.fn(),
  fetchRelatedHorses: vi.fn(),
  deleteHorse: vi.fn(),
}))

import { useHorses } from './useHorses.js'
import { fetchAllHorses, fetchHorseById, fetchRelatedHorses, deleteHorse as deleteHorseService } from '../services/horseService.js'

describe('useHorses', () => {
  let horses

  beforeEach(() => {
    vi.clearAllMocks()
    horses = useHorses()
  })

  describe('loadHorses', () => {
    it('populates horses array on success', async () => {
      const mockHorses = [
        { id: '1', name: 'Horse A', is_for_sale: true },
        { id: '2', name: 'Horse B', is_for_sale: false },
      ]
      fetchAllHorses.mockResolvedValueOnce(mockHorses)

      await horses.loadHorses()

      expect(horses.horses.value).toHaveLength(2)
      expect(horses.loading.value).toBe(false)
      expect(horses.error.value).toBeNull()
    })

    it('sets error on failure', async () => {
      fetchAllHorses.mockRejectedValueOnce(new Error('Network error'))

      await horses.loadHorses()

      expect(horses.horses.value).toEqual([])
      expect(horses.error.value).toBe('Network error')
      expect(horses.loading.value).toBe(false)
    })

    it('sets loading to true while fetching', async () => {
      let resolvePromise
      fetchAllHorses.mockImplementationOnce(() => new Promise((resolve) => { resolvePromise = resolve }))

      const promise = horses.loadHorses()
      expect(horses.loading.value).toBe(true)

      resolvePromise([])
      await promise
      expect(horses.loading.value).toBe(false)
    })
  })

  describe('setFilterStatus', () => {
    it('changes filterStatus and reloads horses', async () => {
      fetchAllHorses.mockResolvedValue([])

      await horses.setFilterStatus('available')

      expect(horses.filterStatus.value).toBe('available')
      expect(fetchAllHorses).toHaveBeenCalled()
    })
  })

  describe('filteredHorses (returned as horses)', () => {
    it('returns all horses when filter is "all"', async () => {
      const mockHorses = [
        { id: '1', name: 'A', is_for_sale: true },
        { id: '2', name: 'B', is_for_sale: false },
      ]
      fetchAllHorses.mockResolvedValueOnce(mockHorses)
      await horses.loadHorses()

      horses.filterStatus.value = 'all'

      expect(horses.horses.value).toHaveLength(2)
    })

    it('filters available horses when filter is "available"', async () => {
      const mockHorses = [
        { id: '1', name: 'A', is_for_sale: true },
        { id: '2', name: 'B', is_for_sale: false },
      ]
      fetchAllHorses.mockResolvedValueOnce(mockHorses)
      await horses.loadHorses()

      horses.filterStatus.value = 'available'

      expect(horses.horses.value).toHaveLength(1)
      expect(horses.horses.value[0].id).toBe('1')
    })

    it('filters unavailable horses when filter is "unavailable"', async () => {
      const mockHorses = [
        { id: '1', name: 'A', is_for_sale: true },
        { id: '2', name: 'B', is_for_sale: false },
      ]
      fetchAllHorses.mockResolvedValueOnce(mockHorses)
      await horses.loadHorses()

      horses.filterStatus.value = 'unavailable'

      expect(horses.horses.value).toHaveLength(1)
      expect(horses.horses.value[0].id).toBe('2')
    })
  })

  describe('isEmpty', () => {
    it('returns true when no horses loaded', () => {
      expect(horses.isEmpty.value).toBe(true)
    })

    it('returns false when horses are loaded', async () => {
      fetchAllHorses.mockResolvedValueOnce([{ id: '1', name: 'A', is_for_sale: true }])
      await horses.loadHorses()

      expect(horses.isEmpty.value).toBe(false)
    })
  })

  describe('deleteHorse', () => {
    it('deletes horse and reloads list on success', async () => {
      deleteHorseService.mockResolvedValueOnce()
      fetchAllHorses.mockResolvedValueOnce([])

      const result = await horses.deleteHorse('1')

      expect(result).toBe(true)
      expect(deleteHorseService).toHaveBeenCalledWith('1')
      expect(fetchAllHorses).toHaveBeenCalled()
    })

    it('sets friendly error for foreign key constraint', async () => {
      deleteHorseService.mockRejectedValueOnce(new Error('foreign key constraint violation'))

      const result = await horses.deleteHorse('1')

      expect(result).toBe(false)
      expect(horses.error.value).toContain('szülőjeként')
    })

    it('sets generic error for other failures', async () => {
      deleteHorseService.mockRejectedValueOnce(new Error('Server error'))

      const result = await horses.deleteHorse('1')

      expect(result).toBe(false)
      expect(horses.error.value).toBe('Server error')
    })
  })

  describe('loadHorseById', () => {
    it('loads a single horse and related horses', async () => {
      const mockHorse = { id: '1', name: 'A', gender: 'male' }
      const mockRelated = [{ id: '2', name: 'B', gender: 'male' }]
      fetchHorseById.mockResolvedValueOnce(mockHorse)
      fetchRelatedHorses.mockResolvedValueOnce(mockRelated)

      await horses.loadHorseById('1')

      expect(horses.selectedHorse.value).toEqual(mockHorse)
      expect(horses.relatedHorses.value).toEqual(mockRelated)
      expect(fetchRelatedHorses).toHaveBeenCalledWith('male', '1')
    })

    it('sets error when loadHorseById fails', async () => {
      fetchHorseById.mockRejectedValueOnce(new Error('Not found'))

      await horses.loadHorseById('999')

      expect(horses.selectedHorse.value).toBeNull()
      expect(horses.relatedHorses.value).toEqual([])
      expect(horses.error.value).toBe('Not found')
    })
  })
})
