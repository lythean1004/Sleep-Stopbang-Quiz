import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';

function getKey() {
  const secret = process.env.ENCRYPTION_SECRET || '';
  return crypto.createHash('sha256').update(secret).digest();
}

export function encryptPII(plainText) {
  const key = getKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(plainText, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return `${iv.toString('base64')}:${encrypted}`;
}

export function decryptPII(payload) {
  const [ivRaw, encrypted] = payload.split(':');
  const key = getKey();
  const iv = Buffer.from(ivRaw, 'base64');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  let plain = decipher.update(encrypted, 'base64', 'utf8');
  plain += decipher.final('utf8');
  return plain;
}

export function maskPhone(phone) {
  return phone.replace(/(\d{3})\d+(\d{4})/, '$1****$2');
}
