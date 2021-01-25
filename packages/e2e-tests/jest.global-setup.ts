import Env, { JestConfig } from 'jest-environment-puppeteer';
const { setup: setupPuppeteer } = Env;

/**
 * Sets up the environment for running tests with Jest
 *
 * @param {JestConfig} globalConfig
 */
module.exports = async function globalSetup( globalConfig: JestConfig ) {
	// do stuff which needs to be done before all tests are executed
	await setupPuppeteer( globalConfig );
};
