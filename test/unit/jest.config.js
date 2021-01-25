// eslint-disable-next-line @typescript-eslint/no-var-requires
const glob = require( 'glob' ).sync;

// Finds all packages which are transpiled with Babel to force Jest to use their source code.
const transpiledPackageNames = glob( 'packages/*/src/index.{js,ts,tsx}' ).map(
	( fileName ) => fileName.split( '/' )[ 1 ]
);

module.exports = {
	rootDir: '../../',
	moduleNameMapper: {
		[ `@wordpress\\/(${ transpiledPackageNames.join(
			'|'
		) })$` ]: 'packages/$1/src',
	},
	preset: '@wordpress/jest-preset-default',
	setupFiles: [ '<rootDir>/test/unit/global-mocks.ts' ],
	testURL: 'http://localhost',
	testMatch: [
		'**/__tests__/**/*.{js,jsx,ts,tsx}',
		'**/test/*.{js,jsx,ts,tsx}',
		'**/?(*.)test.{js,jsx,ts,tsx}',
	],
	testPathIgnorePatterns: [
		'/.git/',
		'/node_modules/',
		'/packages/e2e-tests',
		'<rootDir>/.*/build/',
		'<rootDir>/.*/build-module/',
		'<rootDir>/.+.native.js$',
	],
	transform: {
		'^.+\\.tsx?$': 'ts-jest',
		'\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
			'<rootDir>/test/unit/file-transformer.js',
	},
	setupFilesAfterEnv: [ '<rootDir>/test/unit/jest.setup.ts' ],
	snapshotSerializers: [ 'jest-emotion' ],
	watchPlugins: [
		'jest-watch-typeahead/filename',
		'jest-watch-typeahead/testname',
	],
};
