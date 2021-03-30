module.exports = {
    "roots": [
        "<rootDir>/src"
    ],
    "testMatch": [
        "**/__tests__/**/(?!test)*.+(ts|tsx|js)",
        "**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    "testPathIgnorePatterns": [
        "/node_modules/",
        "/src/__tests__/setup.ts"
    ],
    "transform": {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    "automock": false,
    "setupFiles": [
        "./src/__tests__/setup.ts"
    ],
    "testResultsProcessor": "jest-junit",
    "moduleFileExtensions": ["ts", "tsx", "js", "jsx", "json", "node"],
}
