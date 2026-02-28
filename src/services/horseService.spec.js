import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Supabase mock ──────────────────────────────────────────────
let fromHandler

function createMockChain(resolveValue = { data: null, error: null }) {
  const chain = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
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

let defaultChain

const mockStorage = {
  from: vi.fn(() => ({
    remove: vi.fn().mockResolvedValue({ data: null, error: null }),
  })),
}

vi.mock('./supabase', () => {
  return {
    supabase: {
      from: vi.fn((...args) => {
        if (fromHandler) return fromHandler(...args)
        return defaultChain
      }),
      storage: mockStorage,
    },
  }
})

import { supabase } from './supabase'
import {
  fetchAllHorses,
  fetchHorsesForSale,
  fetchHorseById,
  createHorse,
  deleteHorse,
  fetchRelatedHorses,
  fetchParentOptions,
  fetchPedigree,
  updateHorse,
  fetchHorseForEdit,
} from './horseService'

// ── Tests ──────────────────────────────────────────────────────
describe('horseService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    fromHandler = null
    defaultChain = createMockChain()
    supabase.from = vi.fn((...args) => {
      if (fromHandler) return fromHandler(...args)
      return defaultChain
    })
  })

  // ── fetchAllHorses ───────────────────────────────────────────
  describe('fetchAllHorses', () => {
    it('returns all horses without filters', async () => {
      const horses = [{ id: '1', name: 'Spirit' }]
      defaultChain._resolve({ data: horses, error: null })

      const result = await fetchAllHorses()
      expect(result).toEqual(horses)
      expect(supabase.from).toHaveBeenCalledWith('horses')
      expect(defaultChain.order).toHaveBeenCalledWith('name', { ascending: true })
    })

    it('applies available_only filter', async () => {
      defaultChain._resolve({ data: [], error: null })

      await fetchAllHorses({ available_only: true })
      expect(defaultChain.eq).toHaveBeenCalledWith('is_for_sale', true)
    })

    it('returns empty array when data is null', async () => {
      defaultChain._resolve({ data: null, error: null })

      const result = await fetchAllHorses()
      expect(result).toEqual([])
    })

    it('throws on error', async () => {
      defaultChain._resolve({ data: null, error: { message: 'fail' } })

      await expect(fetchAllHorses()).rejects.toThrow('Failed to fetch horses')
    })
  })

  // ── fetchHorsesForSale ───────────────────────────────────────
  describe('fetchHorsesForSale', () => {
    it('returns horses for sale with default limit', async () => {
      const horses = [{ id: '1', name: 'Luna' }]
      defaultChain._resolve({ data: horses, error: null })

      const result = await fetchHorsesForSale()
      expect(result).toEqual(horses)
      expect(defaultChain.eq).toHaveBeenCalledWith('is_for_sale', true)
      expect(defaultChain.limit).toHaveBeenCalledWith(2)
    })

    it('respects custom limit', async () => {
      defaultChain._resolve({ data: [], error: null })

      await fetchHorsesForSale(5)
      expect(defaultChain.limit).toHaveBeenCalledWith(5)
    })

    it('throws on error', async () => {
      defaultChain._resolve({ data: null, error: { message: 'fail' } })

      await expect(fetchHorsesForSale()).rejects.toThrow('Failed to fetch horses for sale')
    })
  })

  // ── fetchHorseById ───────────────────────────────────────────
  describe('fetchHorseById', () => {
    it('returns horse with sire/dam when both exist', async () => {
      const horseData = {
        id: 'h1',
        name: 'Storm',
        sire_id: 's1',
        dam_id: 'd1',
        main_img_url: null,
        images: [{ id: 'img1', image_url: 'url1', display_order: 0 }],
      }
      const sireData = { id: 's1', name: 'Thunder' }
      const damData = { id: 'd1', name: 'Misty' }

      let callCount = 0
      fromHandler = () => {
        callCount++
        if (callCount === 1) {
          // Main horse query
          return createMockChain({ data: horseData, error: null })
        }
        if (callCount === 2) {
          // Sire query
          const chain = createMockChain({ data: sireData, error: null })
          // The code calls .then() directly on the chain, so we need it thenable
          return chain
        }
        // Dam query
        return createMockChain({ data: damData, error: null })
      }

      const result = await fetchHorseById('h1')
      expect(result.name).toBe('Storm')
      expect(result.sire).toEqual(sireData)
      expect(result.dam).toEqual(damData)
      expect(result.images).toHaveLength(1)
    })

    it('returns horse without sire/dam when ids are null', async () => {
      const horseData = {
        id: 'h2',
        name: 'Solo',
        sire_id: null,
        dam_id: null,
        main_img_url: 'main.jpg',
        images: [],
      }

      fromHandler = () => createMockChain({ data: horseData, error: null })

      const result = await fetchHorseById('h2')
      expect(result.sire).toBeNull()
      expect(result.dam).toBeNull()
      // fallback image from main_img_url
      expect(result.images).toHaveLength(1)
      expect(result.images[0].image_url).toBe('main.jpg')
    })

    it('throws when the main query fails', async () => {
      defaultChain._resolve({ data: null, error: { message: 'not found' } })

      await expect(fetchHorseById('bad')).rejects.toThrow('Failed to fetch horse with ID bad')
    })
  })

  // ── createHorse ──────────────────────────────────────────────
  describe('createHorse', () => {
    it('creates a horse and returns the record', async () => {
      const created = { id: 'new1', name: 'Blaze' }
      defaultChain._resolve({ data: created, error: null })

      const result = await createHorse({ name: 'Blaze', gender: 'male' })
      expect(result).toEqual(created)
      expect(defaultChain.insert).toHaveBeenCalledWith([{ name: 'Blaze', gender: 'male' }])
    })

    it('strips main_image_url from input data', async () => {
      defaultChain._resolve({ data: { id: 'new2' }, error: null })

      await createHorse({ name: 'X', main_image_url: 'should-be-removed' })
      expect(defaultChain.insert).toHaveBeenCalledWith([{ name: 'X' }])
    })

    it('throws on error with server message', async () => {
      defaultChain._resolve({ data: null, error: { message: 'duplicate name' } })

      await expect(createHorse({ name: 'Dup' })).rejects.toThrow('duplicate name')
    })
  })

  // ── deleteHorse ──────────────────────────────────────────────
  describe('deleteHorse', () => {
    it('deletes images from storage then deletes the horse record', async () => {
      const images = [
        { id: 'img1', image_url: 'https://example.com/storage/horse-images/h1/photo.jpg' },
      ]

      const removeFunc = vi.fn().mockResolvedValue({ data: null, error: null })
      mockStorage.from = vi.fn(() => ({ remove: removeFunc }))

      let callCount = 0
      fromHandler = () => {
        callCount++
        if (callCount === 1) {
          // Fetch images
          return createMockChain({ data: images, error: null })
        }
        // Delete horse
        return createMockChain({ data: null, error: null })
      }

      await deleteHorse('h1')
      expect(mockStorage.from).toHaveBeenCalledWith('horse-images')
      expect(removeFunc).toHaveBeenCalledWith(['h1/photo.jpg'])
    })

    it('throws when fetching images fails', async () => {
      defaultChain._resolve({ data: null, error: { message: 'img fail' } })

      await expect(deleteHorse('h1')).rejects.toThrow()
    })

    it('throws when deleting the horse record fails', async () => {
      let callCount = 0
      fromHandler = () => {
        callCount++
        if (callCount === 1) {
          return createMockChain({ data: [], error: null })
        }
        return createMockChain({ data: null, error: { message: 'delete fail' } })
      }

      await expect(deleteHorse('h1')).rejects.toThrow()
    })
  })

  // ── fetchRelatedHorses ───────────────────────────────────────
  describe('fetchRelatedHorses', () => {
    it('fetches horses of the same gender excluding current', async () => {
      const related = [{ id: '2', name: 'Rival' }]
      defaultChain._resolve({ data: related, error: null })

      const result = await fetchRelatedHorses('male', 'h1', 3)
      expect(result).toEqual(related)
      expect(defaultChain.eq).toHaveBeenCalledWith('gender', 'male')
      expect(defaultChain.neq).toHaveBeenCalledWith('id', 'h1')
      expect(defaultChain.limit).toHaveBeenCalledWith(3)
    })

    it('throws on error', async () => {
      defaultChain._resolve({ data: null, error: { message: 'fail' } })

      await expect(fetchRelatedHorses('female', 'x')).rejects.toThrow(
        'Failed to fetch related horses',
      )
    })
  })

  // ── fetchParentOptions ───────────────────────────────────────
  describe('fetchParentOptions', () => {
    it('returns all horses ordered by name', async () => {
      const parents = [{ id: '1', name: 'Alpha' }, { id: '2', name: 'Beta' }]
      defaultChain._resolve({ data: parents, error: null })

      const result = await fetchParentOptions()
      expect(result).toEqual(parents)
      expect(defaultChain.order).toHaveBeenCalledWith('name', { ascending: true })
    })

    it('throws on error', async () => {
      defaultChain._resolve({ data: null, error: { message: 'fail' } })

      await expect(fetchParentOptions()).rejects.toThrow()
    })
  })

  // ── fetchPedigree ────────────────────────────────────────────
  describe('fetchPedigree', () => {
    it('returns null when root horse not found', async () => {
      defaultChain._resolve({ data: null, error: { message: 'not found' } })

      const result = await fetchPedigree('bad-id')
      expect(result).toBeNull()
    })

    it('returns root with byId map for a horse with no parents', async () => {
      const root = { id: 'h1', name: 'Solo', gender: 'male', sire_id: null, dam_id: null }
      defaultChain._resolve({ data: root, error: null })

      const result = await fetchPedigree('h1')
      expect(result.root).toEqual(root)
      expect(result.byId['h1']).toEqual(root)
    })

    it('traverses ancestors up the pedigree tree', async () => {
      const root = { id: 'h1', name: 'Child', gender: 'male', sire_id: 's1', dam_id: null }
      const sire = { id: 's1', name: 'Sire', gender: 'male', sire_id: null, dam_id: null }

      let callCount = 0
      fromHandler = () => {
        callCount++
        if (callCount === 1) {
          return createMockChain({ data: root, error: null })
        }
        // Ancestor fetch
        return createMockChain({ data: [sire], error: null })
      }

      const result = await fetchPedigree('h1')
      expect(result.byId['h1']).toEqual(root)
      expect(result.byId['s1']).toEqual(sire)
    })
  })

  // ── updateHorse ──────────────────────────────────────────────
  describe('updateHorse', () => {
    it('upserts and returns the updated horse', async () => {
      const updated = { id: 'h1', name: 'Updated' }
      defaultChain._resolve({ data: updated, error: null })

      const result = await updateHorse('h1', { name: 'Updated' })
      expect(result).toEqual(updated)
      expect(defaultChain.upsert).toHaveBeenCalledWith({ id: 'h1', name: 'Updated' })
    })

    it('throws on error', async () => {
      defaultChain._resolve({ data: null, error: { message: 'fail' } })

      await expect(updateHorse('h1', {})).rejects.toThrow()
    })
  })

  // ── fetchHorseForEdit ────────────────────────────────────────
  describe('fetchHorseForEdit', () => {
    it('returns horse with images for editing', async () => {
      const horse = { id: 'h1', name: 'Edit', horse_images: [] }
      defaultChain._resolve({ data: horse, error: null })

      const result = await fetchHorseForEdit('h1')
      expect(result).toEqual(horse)
      expect(defaultChain.eq).toHaveBeenCalledWith('id', 'h1')
      expect(defaultChain.single).toHaveBeenCalled()
    })

    it('throws on error', async () => {
      defaultChain._resolve({ data: null, error: { message: 'fail' } })

      await expect(fetchHorseForEdit('bad')).rejects.toThrow()
    })
  })
})
