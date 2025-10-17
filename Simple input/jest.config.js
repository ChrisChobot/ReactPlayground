export default {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.mjs'],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    transform: {
        '^.+\\.(ts|tsx)$': [
            'ts-jest',
            {
                useESM: true,
            },
        ],
    },
    testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transformIgnorePatterns: [
        "node_modules[/\\\\](?!@amcharts[/\\\\]amcharts4)"
    ]
};