module.exports = {
    rootDir: '../../',
    globals: {},
    clearMocks: true,
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.js?$': 'ts-jest',
        '^.+\\.ts?$': 'ts-jest',
    },
    testRegex: 'tests/.*(spec).*\\.(js|ts)',
    moduleDirectories: ['node_modules', 'src'],
    setupFilesAfterEnv: ['./scripts/jest/setup.ts'],
    moduleFileExtensions: ['ts', 'js'],
    reporters: ['default', 'jest-sonar'],
    collectCoverageFrom: [
        '**/src/**',
        '!**/src/index.ts',
        '!**/src/types.ts',
        '!**/node_modules/**',
        '!**/vendor/**',
        '!**/dist/**',
    ],
};
