/* eslint-disable @typescript-eslint/ban-ts-comment */

import {
	insertBlock,
	createNewPost,
	publishPost,
	// @ts-ignore
} from '@wordpress/e2e-test-utils';

describe( 'Basic flow', () => {
	let pageUrl: string;

	const gotoPage = async () => {
		await page.goto( pageUrl );

		// Wait for load
		await page.waitForSelector( '.entry-title' );
	};

	beforeAll( async () => {
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

		pageUrl = await page.url();
	} );

	it( '"Start Quiz" button is shown correctly', async () => {
		await gotoPage();

		// Check if the shortcode is applied correctly.
		const [ link ] = await page.$x( "//input[@value='Start Quiz']" );

		expect( link ).not.toBeUndefined();
	} );

	it( 'Show "No question message" when no question is published.', async () => {
		await gotoPage();

		// Check if the shortcode is applied correctly.
		const [ link ] = await page.$x( "//input[@value='Start Quiz']" );

		if ( link ) {
			link.click();
		}

		await page.waitForSelector( '#no-question-page' );

		const [ message ] = await page.$x(
			"//p[contains(., 'No question has been found')]"
		);

		expect( message ).not.toBeUndefined();
	} );
} );
