export default {
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  moduleFileExtensions: ['js', 'json'],
  collectCoverageFrom: [
    'src/controllers/**/*.js',
  ],
  coverageDirectory: 'coverage',
  transform: {},
  verbose: false,
};


