import { EncryptionService } from '@/infrastructure/crypto/encryption.service';
import { EnvConfig } from '@/config/env.schema';

describe('EncryptionService', () => {
  const env = {
    ENCRYPTION_SECRET: 'test-secret-key-32-characters!!',
  } as EnvConfig;

  const service = new EncryptionService(env);

  it('encrypts and decrypts roundtrip', () => {
    const plaintext = 'sk-proj-my-api-key';
    const encrypted = service.encrypt(plaintext);
    const decrypted = service.decrypt(encrypted);
    expect(decrypted).toBe(plaintext);
    expect(encrypted.ciphertext).not.toBe(plaintext);
  });
});
