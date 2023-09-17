export async function getFileHash(fileBuffer: ArrayBuffer) {
  const hash = await crypto.subtle.digest('SHA-256', fileBuffer)
  const hashArray = Array.from(new Uint8Array(hash))
  const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('')

  return hashHex
}
