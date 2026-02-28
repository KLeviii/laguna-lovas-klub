import { describe, it, expect } from 'vitest'
import { formatPrice, formatDate, formatDateTime } from './formatting'

describe('formatPrice', () => {
  it('formats a positive integer as HUF currency', () => {
    const result = formatPrice(12500)
    expect(result).toContain('12')
    expect(result).toContain('500')
    expect(result).toContain('Ft')
  })

  it('formats zero', () => {
    const result = formatPrice(0)
    expect(result).toContain('0')
    expect(result).toContain('Ft')
  })

  it('formats large numbers with grouping', () => {
    const result = formatPrice(1500000)
    expect(result).toContain('Ft')
  })

  it('handles negative values', () => {
    const result = formatPrice(-5000)
    expect(result).toContain('5')
    expect(result).toContain('000')
  })
})

describe('formatDate', () => {
  it('formats a valid YYYY-MM-DD date to Hungarian format', () => {
    const result = formatDate('2024-05-03')
    expect(result).toContain('2024')
    expect(result).toContain('3')
  })

  it('returns em dash for null input', () => {
    expect(formatDate(null)).toBe('—')
  })

  it('returns em dash for undefined input', () => {
    expect(formatDate(undefined)).toBe('—')
  })

  it('returns em dash for empty string', () => {
    expect(formatDate('')).toBe('—')
  })

  it('returns original string for invalid date', () => {
    const result = formatDate('not-a-date')
    expect(typeof result).toBe('string')
  })
})

describe('formatDateTime', () => {
  it('formats a valid ISO datetime to Hungarian format', () => {
    const result = formatDateTime('2024-05-03T14:30:00')
    expect(result).toContain('2024')
    expect(result).toContain('3')
  })

  it('returns em dash for null input', () => {
    expect(formatDateTime(null)).toBe('—')
  })

  it('returns em dash for undefined input', () => {
    expect(formatDateTime(undefined)).toBe('—')
  })

  it('returns em dash for empty string', () => {
    expect(formatDateTime('')).toBe('—')
  })
})
