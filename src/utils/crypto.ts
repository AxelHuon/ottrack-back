const bcrypt = require('bcrypt');

const SALT_ROUNDS: number = 10;

async function hashText(text: string): Promise<string> {
  const hashedText: string = await (
    bcrypt.hash as (
      data: string | Buffer,
      saltOrRounds: string | number,
    ) => Promise<string>
  )(text, SALT_ROUNDS);
  return hashedText;
}

async function compareText(
  hashedText: string,
  textToCompare: string,
): Promise<boolean> {
  const result: boolean = await (
    bcrypt.compare as (
      data: string | Buffer,
      encrypted: string,
    ) => Promise<boolean>
  )(textToCompare, hashedText);
  return result;
}

export { hashText, compareText };
