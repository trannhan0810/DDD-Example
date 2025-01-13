import {
  generateRandomString,
  getRandomArrayElement,
  getRandomBoolean,
  getRandomFloat,
  getRandomInt,
  shuffleArray,
} from './random.util';

describe('random.util', () => {
  it('should generate random integers within the specified range', () => {
    const min = 10;
    const max = 20;
    const randomInt = getRandomInt(min, max);
    expect(randomInt).toBeGreaterThanOrEqual(min);
    expect(randomInt).toBeLessThanOrEqual(max);
  });

  it('should generate random floats within the specified range', () => {
    const min = 0;
    const max = 1;
    const randomFloat = getRandomFloat(min, max);
    expect(randomFloat).toBeGreaterThanOrEqual(min);
    expect(randomFloat).toBeLessThan(max);
  });

  it('should generate random booleans', () => {
    const randomBool1 = getRandomBoolean();
    const randomBool2 = getRandomBoolean();
    // Expecting different results, but not guaranteed
    expect([true, false]).toContain(randomBool1);
    expect([true, false]).toContain(randomBool2);
  });

  it('should return a random element from the array', () => {
    const array = [1, 2, 3, 4, 5];
    const randomElement = getRandomArrayElement(array);
    expect(array).toContain(randomElement);
  });

  it('should return undefined for an empty array', () => {
    const emptyArray: number[] = [];
    const randomElement = getRandomArrayElement(emptyArray);
    expect(randomElement).toBeUndefined();
  });

  it('should shuffle the array', () => {
    const originalArray = [1, 2, 3, 4, 5];
    const shuffledArray = shuffleArray(originalArray);
    expect(shuffledArray).not.toEqual(originalArray); // Ensure the array is shuffled
    expect(new Set(shuffledArray)).toEqual(new Set(originalArray)); // Ensure all elements are still present
  });
});

describe('generateRandomString', () => {
  it('should generate a string with the specified length', () => {
    const options = {
      length: 10,
      includeLowercase: true,
    };
    const result = generateRandomString(options);
    expect(result.length).toBe(10);
  });

  it('should include uppercase letters when specified', () => {
    const options = {
      length: 5,
      includeUppercase: true,
      includeLowercase: false,
    };
    const result = generateRandomString(options);
    expect(result).toMatch(/[A-Z]+/);
  });

  it('should include lowercase letters when specified', () => {
    const options = {
      length: 5,
      includeUppercase: false,
      includeLowercase: true,
    };
    const result = generateRandomString(options);
    expect(result).toMatch(/[a-z]+/);
  });

  it('should include numbers when specified', () => {
    const options = {
      length: 5,
      includeNumbers: true,
    };
    const result = generateRandomString(options);
    expect(result).toMatch(/\d+/);
  });

  it('should include special characters when specified', () => {
    const options = {
      length: 5,
      includeSpecialChars: true,
    };
    const result = generateRandomString(options);
    expect(result).toMatch(/[!@#$%^&*()_+~`|}{[\]:;?><,./]+/);
  });

  it('should generate different strings on each call', () => {
    const options = {
      length: 10,
      includeLowercase: true,
    };
    const result1 = generateRandomString(options);
    const result2 = generateRandomString(options);
    expect(result1).not.toBe(result2);
  });

  it('should throw an error if no character sets are included', () => {
    const options = {
      length: 10,
    };
    expect(() => generateRandomString(options)).toThrow('At least one character set must be included.');
  });
});
