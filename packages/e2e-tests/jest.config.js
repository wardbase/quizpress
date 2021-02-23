module.exports = {
	preset: 'jest-puppeteer',
	testMatch: [ '**/?(*.)+(spec|test).[t]s' ],
	testRunner: 'jest-circus/runner',
	testPathIgnorePatterns: [ '/node_modules/', 'dist' ],
	testTimeout: 300000,
	testEnvironment: './jest-wp-react-env.js',
	setupFilesAfterEnv: [ '<rootDir>/jest.setup.ts' ],
	transform: {
		'^.+\\.ts?$': 'ts-jest',
	},
};
