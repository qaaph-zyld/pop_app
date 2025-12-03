/**
 * POP Encryption Module
 * AES-256-GCM end-to-end encryption using Web Crypto API
 */

// Generate a random encryption key
export async function generateKey(): Promise<CryptoKey> {
  return await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

// Export key to base64 string for sharing
export async function exportKey(key: CryptoKey): Promise<string> {
  const rawKey = await crypto.subtle.exportKey('raw', key);
  return arrayBufferToBase64(rawKey);
}

// Import key from base64 string
export async function importKey(keyString: string): Promise<CryptoKey> {
  const rawKey = base64ToArrayBuffer(keyString);
  return await crypto.subtle.importKey(
    'raw',
    rawKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

// Encrypt a message
export async function encryptMessage(
  message: string,
  key: CryptoKey
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  
  // Generate random IV for each message
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );
  
  // Combine IV + encrypted data
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);
  
  return arrayBufferToBase64(combined.buffer);
}

// Decrypt a message
export async function decryptMessage(
  encryptedMessage: string,
  key: CryptoKey
): Promise<string> {
  const combined = new Uint8Array(base64ToArrayBuffer(encryptedMessage));
  
  // Extract IV and encrypted data
  const iv = combined.slice(0, 12);
  const data = combined.slice(12);
  
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );
  
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

// Encrypt file data
export async function encryptFile(
  data: ArrayBuffer,
  key: CryptoKey
): Promise<ArrayBuffer> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );
  
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);
  
  return combined.buffer;
}

// Decrypt file data
export async function decryptFile(
  encryptedData: ArrayBuffer,
  key: CryptoKey
): Promise<ArrayBuffer> {
  const combined = new Uint8Array(encryptedData);
  const iv = combined.slice(0, 12);
  const data = combined.slice(12);
  
  return await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );
}

// Helper: ArrayBuffer to Base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Helper: Base64 to ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// Generate a random username
export function generateUsername(): string {
  const adjectives = ['Swift', 'Silent', 'Shadow', 'Cyber', 'Ghost', 'Phantom', 'Stealth', 'Cipher', 'Quantum', 'Neural'];
  const nouns = ['Fox', 'Wolf', 'Hawk', 'Raven', 'Tiger', 'Panther', 'Falcon', 'Viper', 'Phoenix', 'Dragon'];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 1000);
  return `${adj}${noun}${num}`;
}

// Generate random room ID
export function generateRoomId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
