// Definition doesn't exist.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { openPublishPanel } from '@wordpress/e2e-test-utils';

// This API is re-implemented because sometimes '.components-snackbar' isn't found.
export async function publishPost(): Promise< void > {
	await openPublishPanel();

	// Publish the post
	await page.click( '.editor-post-publish-button' );

	await page.waitForXPath( "//div[contains(., 'is now live.')]" );
}
