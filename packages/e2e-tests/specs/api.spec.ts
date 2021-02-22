import { resetTable, runSQL } from '../api';

import {
	createNewPost,
	publishPost,
	createURL,
	// No definition.
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
} from '@wordpress/e2e-test-utils';

describe( 'DB API', () => {
	it( 'table is reset correctly', async () => {
		// Create post and enter title.
		await createNewPost();
		await page.keyboard.type( 'Title' );

		// Publish post
		await publishPost();

		await resetTable( 'wp_posts' );

		await page.goto( createURL( '/' ) );

		// Wait for load
		await page.waitForSelector( '.page-title' );

		// Check if the shortcode is applied correctly.
		const element = await page.$( '.page-title' );
		const text = await page.evaluate( ( e ) => e.textContent, element );

		expect( text ).toBe( 'Nothing here' );
	} );

	it( 'SQL is run correctly', async () => {
		await resetTable( 'wp_posts' );
		await runSQL( 'post.sql' );

		await page.goto( createURL( '/', '?p=27' ) );

		// Wait for load
		await page.waitForSelector( '.entry-title' );

		// Check if the shortcode is applied correctly.
		const [ link ] = await page.$x( "//a[contains(., 'Learn React')]" );

		expect( link ).not.toBeUndefined();
	} );
} );
