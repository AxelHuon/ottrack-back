import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import * as process from 'node:process';
import { promisify } from 'util';

const password = process.env.CRYPTO_PASSWORD || 'password';

async function generateKey(): Promise<Buffer> {
  return (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
}

async function encryptText(textToEncrypt: string): Promise<string> {
  const iv = randomBytes(16);
  const key = await generateKey();
  const cipher = createCipheriv('aes-256-ctr', key, iv);

  const encryptedBuffer = Buffer.concat([
    cipher.update(textToEncrypt),
    cipher.final(),
  ]);

  return Buffer.concat([iv, encryptedBuffer]).toString('base64');
}

async function compareText(
  encryptedText: string,
  textToCompare: string,
): Promise<boolean> {
  const encryptedBuffer = Buffer.from(encryptedText, 'base64');
  const iv = encryptedBuffer.slice(0, 16);
  const key = await generateKey();
  const decipher = createDecipheriv('aes-256-ctr', key, iv);

  const decryptedBuffer = Buffer.concat([
    decipher.update(encryptedBuffer.slice(16)),
    decipher.final(),
  ]);

  return decryptedBuffer.toString() === textToCompare;
}

export { encryptText, compareText };
