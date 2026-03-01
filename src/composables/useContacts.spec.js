import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/services/contactService.js', () => ({
  fetchContactSubmissions: vi.fn(),
  markContactAsRead: vi.fn(),
  markContactAsUnread: vi.fn(),
  deleteContactSubmission: vi.fn(),
}))

import { useContacts } from './useContacts.js'
import {
  fetchContactSubmissions,
  markContactAsRead,
  markContactAsUnread,
  deleteContactSubmission,
} from '@/services/contactService.js'

describe('useContacts', () => {
  let contacts

  beforeEach(() => {
    vi.clearAllMocks()
    contacts = useContacts()
  })

  // ── loadSubmissions ──────────────────────────────────────────
  describe('loadSubmissions', () => {
    it('populates submissions array on success', async () => {
      const mockSubmissions = [
        { id: '1', name: 'Test User', is_read: false },
        { id: '2', name: 'Other User', is_read: true },
      ]
      fetchContactSubmissions.mockResolvedValueOnce(mockSubmissions)

      await contacts.loadSubmissions()

      expect(contacts.submissions.value).toHaveLength(2)
      expect(contacts.loading.value).toBe(false)
      expect(contacts.error.value).toBeNull()
      expect(contacts.isEmpty.value).toBe(false)
    })

    it('sets error on failure', async () => {
      fetchContactSubmissions.mockRejectedValueOnce(new Error('DB error'))

      await contacts.loadSubmissions()

      expect(contacts.submissions.value).toEqual([])
      expect(contacts.error.value).toBe('DB error')
    })

    it('computes unreadCount correctly', async () => {
      const mockSubmissions = [
        { id: '1', is_read: false },
        { id: '2', is_read: false },
        { id: '3', is_read: true },
      ]
      fetchContactSubmissions.mockResolvedValueOnce(mockSubmissions)

      await contacts.loadSubmissions()

      expect(contacts.unreadCount.value).toBe(2)
    })
  })

  // ── markAsRead ───────────────────────────────────────────────
  describe('markAsRead', () => {
    it('updates local submission status to read', async () => {
      const mockSubmissions = [{ id: '1', is_read: false }]
      fetchContactSubmissions.mockResolvedValueOnce(mockSubmissions)
      markContactAsRead.mockResolvedValueOnce()
      await contacts.loadSubmissions()

      await contacts.markAsRead('1')

      expect(markContactAsRead).toHaveBeenCalledWith('1')
      expect(contacts.submissions.value[0].is_read).toBe(true)
      expect(contacts.unreadCount.value).toBe(0)
    })

    it('sets error when marking fails', async () => {
      const mockSubmissions = [{ id: '1', is_read: false }]
      fetchContactSubmissions.mockResolvedValueOnce(mockSubmissions)
      markContactAsRead.mockRejectedValueOnce(new Error('mark fail'))
      await contacts.loadSubmissions()

      await contacts.markAsRead('1')

      expect(contacts.error.value).toBe('mark fail')
    })
  })

  // ── markAsUnread ─────────────────────────────────────────────
  describe('markAsUnread', () => {
    it('updates local submission status to unread', async () => {
      const mockSubmissions = [{ id: '1', is_read: true }]
      fetchContactSubmissions.mockResolvedValueOnce(mockSubmissions)
      markContactAsUnread.mockResolvedValueOnce()
      await contacts.loadSubmissions()

      await contacts.markAsUnread('1')

      expect(markContactAsUnread).toHaveBeenCalledWith('1')
      expect(contacts.submissions.value[0].is_read).toBe(false)
      expect(contacts.unreadCount.value).toBe(1)
    })
  })

  // ── removeSubmission ─────────────────────────────────────────
  describe('removeSubmission', () => {
    it('removes submission from local list', async () => {
      const mockSubmissions = [
        { id: '1', is_read: false },
        { id: '2', is_read: true },
      ]
      fetchContactSubmissions.mockResolvedValueOnce(mockSubmissions)
      deleteContactSubmission.mockResolvedValueOnce()
      await contacts.loadSubmissions()

      await contacts.removeSubmission('1')

      expect(deleteContactSubmission).toHaveBeenCalledWith('1')
      expect(contacts.submissions.value).toHaveLength(1)
      expect(contacts.submissions.value[0].id).toBe('2')
    })
  })
})
