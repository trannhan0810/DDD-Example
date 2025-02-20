export default {
  displayName: 'be-template',
  testMatch: ['<rootDir>/src/**/*(*.)@(spec|test).[jt]s?(x)'],
  preset: './jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
};
