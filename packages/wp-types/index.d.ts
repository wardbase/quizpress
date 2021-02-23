interface Window {
	// Values added when wp_enqueue_script( 'wp-api' ) is called.
	wpApiSettings: {
		root: string;
		nonce: string;
		versionString: string;
	};
}
