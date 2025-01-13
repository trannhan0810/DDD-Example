import * as crypto from 'crypto';

export const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomFloat = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

export const getRandomBoolean = (): boolean => {
  return Math.random() < 0.5;
};

export const getRandomArrayElement = <T>(array: T[]): T | undefined => {
  if (array.length === 0) {
    return undefined;
  }
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

interface RandomStringOptions {
  length: number;
  includeUppercase?: boolean;
  includeLowercase?: boolean;
  includeNumbers?: boolean;
  includeSpecialChars?: boolean;
}

export function generateRandomString(input: RandomStringOptions): string {
  let characters = '';
  const { length } = input;

  if (input.includeUppercase) characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (input.includeLowercase) characters += 'abcdefghijklmnopqrstuvwxyz';
  if (input.includeNumbers) characters += '0123456789';
  if (input.includeSpecialChars) characters += '!@#$%^&*()_+~`|}{[]:;?><,./';

  if (!characters) {
    throw new Error('At least one character set must be included.');
  }

  const bytes = crypto.randomBytes(length);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(bytes[i] % characters.length);
  }

  return result;
}
