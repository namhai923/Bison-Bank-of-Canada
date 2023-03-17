/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};

// const config = {
//   //transformIgnorePatterns: ['/node_modules/(?!(axios)/)'],
//   transformIgnorePatterns: ['/node_modules/(!(axios)/)'],
// };

// module.exports = async () => ({
//   ...await createJestConfig(customJestConfig)(),
//   transformIgnorePatterns: [
//     'node_modules/(?!(axios)/)',
//     '^.+\\.module\\.(css|sass|scss)$',
//   ]
// });

// module.exports = createJestConfig(customJestConfig);