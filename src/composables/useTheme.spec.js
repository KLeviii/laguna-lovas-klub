import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock localStorage and document.body
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, value) => { store[key] = value }),
    removeItem: vi.fn((key) => { delete store[key] }),
    clear: vi.fn(() => { store = {} }),
  }
})()

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock })

describe('useTheme', () => {
  let useTheme

  beforeEach(async () => {
    localStorageMock.clear()
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
    document.body.classList.remove('light')
    vi.resetModules()
    const mod = await import('./useTheme.js')
    useTheme = mod.useTheme
  })

  it('initTheme defaults to dark mode when no saved theme', () => {
    const { initTheme, isDarkMode } = useTheme()
    initTheme()

    expect(isDarkMode.value).toBe(true)
    expect(document.body.classList.contains('light')).toBe(false)
  })

  it('initTheme loads light mode from localStorage', () => {
    localStorageMock.getItem.mockReturnValueOnce('light')
    const { initTheme, isDarkMode } = useTheme()
    initTheme()

    expect(isDarkMode.value).toBe(false)
    expect(document.body.classList.contains('light')).toBe(true)
  })

  it('initTheme loads dark mode from localStorage', () => {
    localStorageMock.getItem.mockReturnValueOnce('dark')
    const { initTheme, isDarkMode } = useTheme()
    initTheme()

    expect(isDarkMode.value).toBe(true)
    expect(document.body.classList.contains('light')).toBe(false)
  })

  it('toggleTheme switches from dark to light', () => {
    const { initTheme, toggleTheme, isDarkMode } = useTheme()
    initTheme()
    expect(isDarkMode.value).toBe(true)

    toggleTheme()

    expect(isDarkMode.value).toBe(false)
    expect(document.body.classList.contains('light')).toBe(true)
  })

  it('toggleTheme switches from light back to dark', () => {
    localStorageMock.getItem.mockReturnValueOnce('light')
    const { initTheme, toggleTheme, isDarkMode } = useTheme()
    initTheme()
    expect(isDarkMode.value).toBe(false)

    toggleTheme()

    expect(isDarkMode.value).toBe(true)
    expect(document.body.classList.contains('light')).toBe(false)
  })

  it('toggleTheme saves to localStorage', () => {
    const { initTheme, toggleTheme } = useTheme()
    initTheme()

    toggleTheme()

    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light')
  })
})
