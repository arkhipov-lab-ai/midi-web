module.exports = {
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
    transform: {
        '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
    },
    moduleNameMapper: {
        '^@app$': '<rootDir>/src/app/index',
        '^@processes/(.*)$': '<rootDir>/src/processes/$1',
        '^@pages/(.*)$': '<rootDir>/src/pages/$1',
        '^@widgets/(.*)$': '<rootDir>/src/widgets/$1',
        '^@features/(.*)$': '<rootDir>/src/features/$1',
        '^@entities/(.*)$': '<rootDir>/src/entities/$1',
        '^@service/(.*)$': '<rootDir>/src/service/$1',
        '^@uikit/(.*)$': '<rootDir>/src/uikit/$1',
        '^@shared/(.*)$': '<rootDir>/src/shared/$1',
        '^@core/(.*)$': '<rootDir>/src/core/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(gif|ttf|eot|svg|png|jpg|jpeg|webp)$': '<rootDir>/test/__mocks__/fileMock.js',
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
}
