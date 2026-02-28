import { describe, it, expect, vi } from 'vitest'
import { validateFile, generateSafeFilename } from './fileUpload'

function createMockFile(name, size, type) {
  return { name, size, type }
}

describe('validateFile', () => {
  it('throws if file is null', () => {
    expect(() => validateFile(null)).toThrow('Nincs fájl kiválasztva')
  })

  it('throws if file is undefined', () => {
    expect(() => validateFile(undefined)).toThrow('Nincs fájl kiválasztva')
  })

  it('throws if file is too large', () => {
    const bigFile = createMockFile('big.jpg', 60 * 1024 * 1024, 'image/jpeg')
    expect(() => validateFile(bigFile, { maxSizeMB: 50 })).toThrow('túl nagy')
  })

  it('accepts file within size limit', () => {
    const smallFile = createMockFile('small.jpg', 1 * 1024 * 1024, 'image/jpeg')
    expect(() => validateFile(smallFile, { maxSizeMB: 50 })).not.toThrow()
  })

  it('throws for invalid file type', () => {
    const pdfFile = createMockFile('doc.pdf', 1024, 'application/pdf')
    expect(() => validateFile(pdfFile)).toThrow('Nem támogatott fájltípus')
  })

  it('accepts valid image types', () => {
    const jpgFile = createMockFile('photo.jpg', 1024, 'image/jpeg')
    expect(() => validateFile(jpgFile)).not.toThrow()

    const pngFile = createMockFile('photo.png', 1024, 'image/png')
    expect(() => validateFile(pngFile)).not.toThrow()

    const webpFile = createMockFile('photo.webp', 1024, 'image/webp')
    expect(() => validateFile(webpFile)).not.toThrow()
  })

  it('uses custom maxSizeMB', () => {
    const file = createMockFile('photo.jpg', 6 * 1024 * 1024, 'image/jpeg')
    expect(() => validateFile(file, { maxSizeMB: 5 })).toThrow('maximum 5MB')
  })

  it('uses custom validTypes', () => {
    const gifFile = createMockFile('anim.gif', 1024, 'image/gif')
    expect(() => validateFile(gifFile, { validTypes: ['image/gif'] })).not.toThrow()
  })
})

describe('generateSafeFilename', () => {
  it('returns a timestamp-based filename with correct extension', () => {
    const file = createMockFile('my photo.jpg', 1024, 'image/jpeg')
    const before = Date.now()
    const result = generateSafeFilename(file)
    const after = Date.now()

    expect(result).toMatch(/^\d+\.jpg$/)
    const timestamp = parseInt(result.split('.')[0])
    expect(timestamp).toBeGreaterThanOrEqual(before)
    expect(timestamp).toBeLessThanOrEqual(after)
  })

  it('handles files without extension', () => {
    const file = createMockFile('noext', 1024, 'image/jpeg')
    const result = generateSafeFilename(file)
    expect(result).toMatch(/^\d+\.noext$/)
  })

  it('adds prefix when provided', () => {
    const file = createMockFile('photo.png', 1024, 'image/png')
    const result = generateSafeFilename(file, 'horse-123')
    expect(result).toMatch(/^horse-123\/\d+\.png$/)
  })

  it('returns without prefix when prefix is empty', () => {
    const file = createMockFile('photo.webp', 1024, 'image/webp')
    const result = generateSafeFilename(file, '')
    expect(result).toMatch(/^\d+\.webp$/)
  })
})
