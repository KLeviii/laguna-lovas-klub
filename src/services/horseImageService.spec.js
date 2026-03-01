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
    single: vi.fn().mockReturnThis(),
  }
  chain.then = vi.fn((resolve) => resolve(resolveValue))
  chain._resolve = (val) => {
    chain.then = vi.fn((resolve) => resolve(val))
  }
  return chain
}

const mockRemove = vi.fn().mockResolvedValue({ data: null, error: null })

vi.mock('./supabase', () => ({
  supabase: {
    from: vi.fn(() => mockChain),
    storage: {
      from: vi.fn(() => ({
        remove: mockRemove,
      })),
    },
  },
}))

import { supabase } from './supabase'
import {
  updateImageOrder,
  updateImageAltText,
  deleteImage,
} from './horseImageService'

// ── Tests ──────────────────────────────────────────────────────
describe('horseImageService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockChain = createMockChain()
  })

  // ── updateImageOrder ─────────────────────────────────────────
  describe('updateImageOrder', () => {
    it('upserts new display order and returns the record', async () => {
      const updated = { id: 'img1', display_order: 3 }
      mockChain._resolve({ data: updated, error: null })

      const result = await updateImageOrder('img1', 3)
      expect(result).toEqual(updated)
      expect(supabase.from).toHaveBeenCalledWith('horse_images')
      expect(mockChain.upsert).toHaveBeenCalledWith({ id: 'img1', display_order: 3 })
    })

    it('throws on error', async () => {
      mockChain._resolve({ data: null, error: { message: 'update fail' } })

      await expect(updateImageOrder('img1', 0)).rejects.toThrow()
    })
  })

  // ── updateImageAltText ───────────────────────────────────────
  describe('updateImageAltText', () => {
    it('upserts new alt text and returns the record', async () => {
      const updated = { id: 'img1', alt_text: 'New alt' }
      mockChain._resolve({ data: updated, error: null })

      const result = await updateImageAltText('img1', 'New alt')
      expect(result).toEqual(updated)
      expect(supabase.from).toHaveBeenCalledWith('horse_images')
      expect(mockChain.upsert).toHaveBeenCalledWith({ id: 'img1', alt_text: 'New alt' })
    })

    it('throws on error', async () => {
      mockChain._resolve({ data: null, error: { message: 'fail' } })

      await expect(updateImageAltText('img1', 'text')).rejects.toThrow()
    })
  })

  // ── deleteImage ──────────────────────────────────────────────
  describe('deleteImage', () => {
    it('deletes from storage and database on success', async () => {
      mockChain._resolve({ data: null, error: null })

      const imageUrl = 'https://example.com/storage/v1/object/public/horse-images/h1/photo.jpg'
      await expect(deleteImage('img1', imageUrl)).resolves.toBeUndefined()

      expect(supabase.storage.from).toHaveBeenCalledWith('horse-images')
      expect(mockRemove).toHaveBeenCalledWith(['h1/photo.jpg'])
      expect(supabase.from).toHaveBeenCalledWith('horse_images')
      expect(mockChain.delete).toHaveBeenCalled()
      expect(mockChain.eq).toHaveBeenCalledWith('id', 'img1')
    })

    it('throws when image URL is invalid', async () => {
      await expect(deleteImage('img1', 'https://example.com/bad-url')).rejects.toThrow(
        'Invalid image URL',
      )
    })

    it('throws when storage delete fails', async () => {
      mockRemove.mockResolvedValueOnce({ data: null, error: { message: 'storage fail' } })

      const imageUrl = 'https://example.com/storage/horse-images/h1/photo.jpg'
      await expect(deleteImage('img1', imageUrl)).rejects.toThrow()
    })
  })
})
