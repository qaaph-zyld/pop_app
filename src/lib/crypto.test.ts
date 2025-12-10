import { describe, it, expect } from 'vitest'
import { generateKey, encryptMessage, decryptMessage, encryptFile, decryptFile, generateUsername, generateRoomId } from './crypto'

const textEncoder = new TextEncoder()

describe('crypto module', () => {
  it('encrypts and decrypts text messages correctly', async () => {
    const key = await generateKey()
    const message = 'Hello POP – end-to-end encrypted message!'

    const encrypted = await encryptMessage(message, key)
    expect(encrypted).toBeTypeOf('string')
    expect(encrypted).not.toBe(message)

    const decrypted = await decryptMessage(encrypted, key)
    expect(decrypted).toBe(message)
  })

  it('encrypts and decrypts file data correctly', async () => {
    const key = await generateKey()
    const original = textEncoder.encode('sample file content').buffer

    const encrypted = await encryptFile(original, key)
    expect(encrypted.byteLength).toBeGreaterThan(0)
    expect(encrypted.byteLength).not.toBe(original.byteLength)

    const decrypted = await decryptFile(encrypted, key)
    expect(new Uint8Array(decrypted)).toEqual(new Uint8Array(original))
  })

  it('generates non-empty usernames and room IDs', () => {
    const username = generateUsername()
    const roomId = generateRoomId()

    expect(username).toBeTypeOf('string')
    expect(username.length).toBeGreaterThan(0)

    expect(roomId).toBeTypeOf('string')
    expect(roomId.length).toBeGreaterThan(0)
  })
})
