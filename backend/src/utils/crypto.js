const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;

const getKey = () => {
  const secret = process.env.MESSAGE_SECRET || process.env.JWT_SECRET;
  if (!secret) throw new Error('MESSAGE_SECRET or JWT_SECRET must be set');
  return crypto.createHash('sha256').update(secret).digest();
};

const encryptServerPayload = (plainText) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return {
    encryptedMessage: encrypted.toString('base64'),
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64'),
    algorithm: ALGORITHM,
  };
};

const decryptServerPayload = ({ encryptedMessage, iv, authTag }) => {
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), Buffer.from(iv, 'base64'));
  decipher.setAuthTag(Buffer.from(authTag, 'base64'));
  const plain = Buffer.concat([
    decipher.update(Buffer.from(encryptedMessage, 'base64')),
    decipher.final(),
  ]);
  return plain.toString('utf8');
};

module.exports = { encryptServerPayload, decryptServerPayload };
