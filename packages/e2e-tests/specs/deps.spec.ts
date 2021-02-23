import {
	visitAdminPage,
	// No definition.
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
} from '@wordpress/e2e-test-utils';

describe( 'WP Dependencies', () => {
	describe( 'Plugin', () => {
		it( 'LearnDash activated', async () => {
			visitAdminPage( 'plugins.php' );

			// Wait for load
			await page.waitForSelector( '.wp-heading-inline' );

			// Check if the plugin is installed correctly.
			const [ name ] = await page.$x(
				"//strong[contains(., 'LearnDash LMS')]"
			);

			expect( name ).not.toBeUndefined();
		} );
	} );
} );
