<?php
/**
 * E2E test DB APIs.
 *
 * @package WP React Plugin Boilerplate
 */

// Load files.
require_once __DIR__ . '/lib/sql.php';

/**
 * Register Test Database APIs.
 */
function wp_react_db_api() {
	register_rest_route(
		'wp-react/test/v1',
		'/reset-table',
		array(
			'methods'             => 'POST',
			'callback'            => 'wp_react_plugin_reset_table',
			'permission_callback' => '__return_true',
		)
	);

	register_rest_route(
		'wp-react/test/v1',
		'/run-sql',
		array(
			'methods'             => 'POST',
			'callback'            => 'wp_react_plugin_run_sql',
			'permission_callback' => '__return_true',
		)
	);
}

add_action( 'rest_api_init', 'wp_react_db_api' );

/**
 * Reset Table endpoint.
 *
 * @param WP_REST_Request $request user request.
 */
function wp_react_plugin_reset_table( WP_REST_Request $request ) {
	global $wpdb;

	$tables = json_decode( $request->get_body(), true );

	foreach ( $tables as $table ) {
		$wpdb->query(
			// Reason for ignore:
			// If complex placeholder is not used, table name is wrapped with quotes and query fails.
			// @see https://github.com/WordPress/WordPress-Coding-Standards/issues/1903.
			$wpdb->prepare( 'DELETE FROM %1$s', array( $table ) ) // phpcs:ignore WordPress.DB.PreparedSQLPlaceholders.UnquotedComplexPlaceholder
		);
	}

	return 'Reset succeeded';
}

define( 'SQL_FILE_ROOT', dirname( __DIR__ ) . '/sql/' ); /* => test/e2e/sql */

/**
 * Run SQL files.
 *
 * @param WP_REST_Request $request user request.
 */
function wp_react_plugin_run_sql( WP_REST_Request $request ) {
	$filenames = json_decode( $request->get_body(), true );

	wp_react_execute_sql( $filenames );

	return 'SQL run succeeded';
}
