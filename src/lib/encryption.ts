import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

/**
 * Key rotation (no flag day, zero downtime):
 *   1. Generate a new 32-byte hex key.
 *   2. Move the CURRENT ENCRYPTION_KEY value into ENCRYPTION_KEY_PREVIOUS
 *      (comma-separate if there are several), and set ENCRYPTION_KEY to the new key.
 *   3. Redeploy. New writes use the new key; old data still decrypts because
 *      decrypt() tries the previous key(s) too (AES-GCM auth tells us which matches).
 *   4. Re-encrypt existing rows with a one-off script, then drop the old key from
 *      ENCRYPTION_KEY_PREVIOUS.
 */

// The key used for all NEW encryption.
function currentKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) throw new Error('ENCRYPTION_KEY environment variable is not set');
  return Buffer.from(key, 'hex');
}

// Keys to try when decrypting: current first, then any retired keys.
function decryptKeys(): Buffer[] {
  const keys = [currentKey()];
  const prev = process.env.ENCRYPTION_KEY_PREVIOUS;
  if (prev) {
    for (const hex of prev.split(',').map(s => s.trim()).filter(Boolean)) {
      keys.push(Buffer.from(hex, 'hex'));
    }
  }
  return keys;
}

export function encrypt(plaintext: string): string {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, currentKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString('base64');
}

export function decrypt(ciphertext: string): string {
  const data = Buffer.from(ciphertext, 'base64');
  const iv = data.subarray(0, IV_LENGTH);
  const tag = data.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
  const encrypted = data.subarray(IV_LENGTH + TAG_LENGTH);
  let lastErr: unknown;
  for (const key of decryptKeys()) {
    try {
      const decipher = createDecipheriv(ALGORITHM, key, iv);
      decipher.setAuthTag(tag);
      // The GCM auth tag is verified in final(); a wrong key throws here.
      return decipher.update(encrypted) + decipher.final('utf8');
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr ?? new Error('decrypt: no configured key matched');
}
