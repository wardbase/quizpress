// It's executed by jest and import doesn't work.
/* eslint-disable @typescript-eslint/no-var-requires */
const PuppeteerEnvironment = require( 'jest-environment-puppeteer' );
const fs = require( 'fs-extra' );

let index = 0;

class CustomEnvironment extends PuppeteerEnvironment {
	async setup() {
		await super.setup();
	}

	async teardown() {
		// Wait a few seconds before tearing down the page so we
		// have time to take screenshots and handle other events
		await this.global.page.waitForTimeout( 2000 );
		await super.teardown();
	}

	async handleTestEvent( event, state ) {
		if ( event.name === 'test_fn_failure' ) {
			const testName = state.currentlyRunningTest
				? state.currentlyRunningTest.name
				: `test-${ index++ }`;

			// Take a screenshot at the point of failure
			await fs.ensureDir( 'test-report/screenshots' );
			await this.global.page.screenshot( {
				path: `test-report/screenshots/${ testName }.png`,
			} );
		}
	}
}

module.exports = CustomEnvironment;
