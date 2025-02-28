export default {
  displayName: 'be-template',
  testMatch: ['<rootDir>/src/**/__tests__/**/*.[jt]s?(x)', '<rootDir>/src/**/*(*.)@(spec|test).[jt]s?(x)'],
  preset: './jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/domain/**/*.{ts,tsx}', // Include all JavaScript, TypeScript, and JSX files
    'src/application/**/*.{ts,tsx}', // Include all JavaScript, TypeScript, and JSX files
    // 'src/infrastructure/**/*.{ts,tsx}', // Include all JavaScript, TypeScript, and JSX files
    'src/shared/**/*.{ts,tsx}', // Include all JavaScript, TypeScript, and JSX files
    '!**/node_modules/**', // Exclude node_modules directory
    '!**/dist/**', // Exclude compiled files
    '!**/coverage/**', // Exclude coverage reports
    '!**/test/**', // Exclude test files
    '!**/dtos/**', // Exclude DTO files
    '!**/index.ts', // Exclude barel files
  ],
  coverageReporters: ['lcov', ['text', { skipFull: false }], 'text-summary'],
};
