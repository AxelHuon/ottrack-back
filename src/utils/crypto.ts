import * as bcrypt from 'bcrypt';

const SALT_ROUNDS: number = 10;

async function hashText(text: string): Promise<string> {
  return bcrypt.hash(text, SALT_ROUNDS);
}

async function compareText(
  hashedText: string,
  textToCompare: string,
): Promise<boolean> {
  return bcrypt.compare(textToCompare, hashedText);
}

export { hashText, compareText };
