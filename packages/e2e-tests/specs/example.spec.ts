/* eslint-disable @typescript-eslint/ban-ts-comment */

import {
	insertBlock,
	createNewPost,
	publishPost,
	// @ts-ignore
} from '@wordpress/e2e-test-utils';

// Default example copied from the official Jest site.
// https://jestjs.io/docs/en/puppeteer
describe( 'Google', () => {
	beforeAll( async () => {
		await page.goto( 'https://google.com' );
	} );

	it( 'should be titled "Google"', async () => {
		await expect( page.title() ).resolves.toMatch( 'Google' );
	} );
} );

describe( 'Shortcode', () => {
	it( 'shortcode is shown correctly', async () => {
		// Create post and enter title.
		await createNewPost();
		await page.keyboard.type( 'Title' );

		// Add shortcode block
		await insertBlock( 'Shortcode' );
		await page.keyboard.type( '[React]' );

		// Publish post
		await publishPost();

		// Navigate to the published post.
		const [ button ] = await page.$x( "//a[contains(., 'View Post')]" );

		if ( button ) {
			await button.click();
		}

		// Wait for load
		await page.waitForSelector( '.entry-title' );

		// Check if the shortcode is applied correctly.
		const [ link ] = await page.$x( "//a[contains(., 'Learn React')]" );

		expect( link ).not.toBeNull();
	} );
} );
