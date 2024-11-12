module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',  // Transform TypeScript files using ts-jest
  },
  transformIgnorePatterns: [
    '/node_modules/',          // Ignore transforming files in node_modules
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'], // Recognize TypeScript file extensions
};