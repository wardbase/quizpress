import {
	visitAdminPage,
	// No definition.
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
} from '@wordpress/e2e-test-utils';

describe( 'WP Dependencies', () => {
	describe( 'Plugin', () => {
		it( 'From official WP Plugin repo', async () => {
			visitAdminPage( 'plugins.php' );

			// Wait for load
			await page.waitForSelector( '.wp-heading-inline' );

			// Check if the plugin is installed correctly.
			const [ name ] = await page.$x(
				"//strong[contains(., 'Hello Samuel L Jackson')]"
			);

			expect( name ).not.toBeUndefined();
		} );

		it( 'From Github private repo', async () => {
			visitAdminPage( 'plugins.php' );

			// Wait for load
			await page.waitForSelector( '.wp-heading-inline' );

			// Check if the plugin is installed correctly.
			const [ name ] = await page.$x(
				"//strong[contains(., 'WP React Plugin X')]"
			);

			expect( name ).not.toBeUndefined();
		} );
	} );

	describe( 'Theme', () => {
		it( 'From official WP Themes repo', async () => {
			visitAdminPage( 'themes.php' );

			// Wait for load
			await page.waitForSelector( '.wp-heading-inline' );

			// Check if the plugin is installed correctly.
			const name = await page.$( '#twentyfourteen-name' );

			expect( name ).not.toBeNull();
		} );

		it( 'From Github private repo', async () => {
			visitAdminPage( 'themes.php' );

			// Wait for load
			await page.waitForSelector( '.wp-heading-inline' );

			// Check if the plugin is installed correctly.
			const name = await page.$( '#test-x-name' );

			expect( name ).not.toBeNull();
		} );
	} );
} );
