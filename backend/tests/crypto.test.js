const { encryptServerPayload, decryptServerPayload } = require('../src/utils/crypto');

describe('crypto utility', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret-key';
  });

  test('encrypts and decrypts message without exposing plain text in cipher text', () => {
    const text = 'Hello secure world';
    const encrypted = encryptServerPayload(text);

    expect(encrypted.encryptedMessage).not.toContain('Hello secure world');
    expect(decryptServerPayload(encrypted)).toBe(text);
  });
});
