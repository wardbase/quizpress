import {
	insertBlock,
	createNewPost,
	// No definition.
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
} from '@wordpress/e2e-test-utils';

import { publishPost } from '../util';

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

		expect( link ).not.toBeUndefined();
	} );
} );

describe( 'Retry', () => {
	let i = 0;
	function f() {
		return i++;
	}

	it( 'fails until retry 3 times', () => {
		expect( 2 ).toBe( f() );
	} );
} );
