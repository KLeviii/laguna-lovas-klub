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
    single: vi.fn().mockReturnThis(),
  }

  // Make the chain thenable so `await` resolves it
  chain.then = vi.fn((resolve) => resolve(resolveValue))

  // Helper: allow tests to override the resolved value after chain is built
  chain._resolve = (val) => {
    chain.then = vi.fn((resolve) => resolve(val))
  }

  return chain
}

vi.mock('./supabase', () => {
  return {
    supabase: {
      from: vi.fn(() => mockChain),
    },
  }
})

// Import AFTER the mock is registered
import { supabase } from './supabase'
import {
  submitContactForm,
  fetchContactSubmissions,
  markContactAsRead,
  markContactAsUnread,
  deleteContactSubmission,
} from './contactService'

// ── Tests ──────────────────────────────────────────────────────
describe('contactService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockChain = createMockChain()
  })

  // ── submitContactForm ────────────────────────────────────────
  describe('submitContactForm', () => {
    it('inserts form data without throwing on success', async () => {
      mockChain._resolve({ data: null, error: null })

      const formData = { name: 'Test', email: 'a@b.com', message: 'Hello' }
      await expect(submitContactForm(formData)).resolves.toBeUndefined()

      expect(supabase.from).toHaveBeenCalledWith('contact_submissions')
      expect(mockChain.insert).toHaveBeenCalledWith([formData])
    })

    it('throws when the insert fails', async () => {
      mockChain._resolve({ data: null, error: { message: 'db error' } })

      await expect(submitContactForm({ name: 'X' })).rejects.toThrow(
        'Hiba az üzenet küldése közben',
      )
    })
  })

  // ── fetchContactSubmissions ──────────────────────────────────
  describe('fetchContactSubmissions', () => {
    it('returns an array of submissions on success', async () => {
      const submissions = [{ id: '1', name: 'A' }, { id: '2', name: 'B' }]
      mockChain._resolve({ data: submissions, error: null })

      const result = await fetchContactSubmissions()
      expect(result).toEqual(submissions)
      expect(supabase.from).toHaveBeenCalledWith('contact_submissions')
      expect(mockChain.select).toHaveBeenCalled()
      expect(mockChain.order).toHaveBeenCalledWith('created_at', { ascending: false })
    })

    it('returns empty array when data is null', async () => {
      mockChain._resolve({ data: null, error: null })

      const result = await fetchContactSubmissions()
      expect(result).toEqual([])
    })

    it('throws on query error', async () => {
      mockChain._resolve({ data: null, error: { message: 'fail' } })

      await expect(fetchContactSubmissions()).rejects.toThrow(
        'Hiba az üzenetek betöltése közben',
      )
    })
  })

  // ── markContactAsRead ────────────────────────────────────────
  describe('markContactAsRead', () => {
    it('fetches the record then upserts with is_read = true', async () => {
      // The function calls supabase.from() twice:
      // 1st call: select + eq + single => returns existing record
      // 2nd call: upsert => succeeds
      const existing = { id: 'abc', is_read: false, created_at: '2024-01-01' }

      let callCount = 0
      supabase.from = vi.fn(() => {
        callCount++
        if (callCount === 1) {
          // First call: fetch existing record
          return createMockChain({ data: existing, error: null })
        }
        // Second call: upsert
        return createMockChain({ data: null, error: null })
      })

      await expect(markContactAsRead('abc')).resolves.toBeUndefined()

      // Verify both calls used the correct table
      expect(supabase.from).toHaveBeenCalledTimes(2)
      expect(supabase.from).toHaveBeenNthCalledWith(1, 'contact_submissions')
      expect(supabase.from).toHaveBeenNthCalledWith(2, 'contact_submissions')
    })

    it('throws when the initial fetch fails', async () => {
      mockChain._resolve({ data: null, error: { message: 'fetch fail' } })

      await expect(markContactAsRead('abc')).rejects.toThrow('Hiba a jelölés közben')
    })

    it('throws when the upsert fails', async () => {
      const existing = { id: 'abc', is_read: false, created_at: '2024-01-01' }

      let callCount = 0
      supabase.from = vi.fn(() => {
        callCount++
        if (callCount === 1) {
          return createMockChain({ data: existing, error: null })
        }
        return createMockChain({ data: null, error: { message: 'upsert fail' } })
      })

      await expect(markContactAsRead('abc')).rejects.toThrow('Hiba a jelölés közben')
    })
  })

  // ── markContactAsUnread ──────────────────────────────────────
  describe('markContactAsUnread', () => {
    it('fetches the record then upserts with is_read = false', async () => {
      const existing = { id: 'abc', is_read: true, created_at: '2024-01-01' }

      let callCount = 0
      supabase.from = vi.fn(() => {
        callCount++
        if (callCount === 1) {
          return createMockChain({ data: existing, error: null })
        }
        return createMockChain({ data: null, error: null })
      })

      await expect(markContactAsUnread('abc')).resolves.toBeUndefined()
      expect(supabase.from).toHaveBeenCalledTimes(2)
    })

    it('throws when the fetch step fails', async () => {
      mockChain._resolve({ data: null, error: { message: 'fail' } })

      await expect(markContactAsUnread('xyz')).rejects.toThrow('Hiba a jelölés közben')
    })
  })

  // ── deleteContactSubmission ──────────────────────────────────
  describe('deleteContactSubmission', () => {
    it('deletes successfully without throwing', async () => {
      mockChain._resolve({ data: null, error: null })

      await expect(deleteContactSubmission('abc')).resolves.toBeUndefined()
      expect(supabase.from).toHaveBeenCalledWith('contact_submissions')
      expect(mockChain.delete).toHaveBeenCalled()
      expect(mockChain.eq).toHaveBeenCalledWith('id', 'abc')
    })

    it('throws on delete error', async () => {
      mockChain._resolve({ data: null, error: { message: 'delete fail' } })

      await expect(deleteContactSubmission('abc')).rejects.toThrow(
        'Hiba az üzenet törlése közben',
      )
    })
  })
})
