<?php
/**
 * SQL utils for e2e tests.
 *
 * @package WP React Plugin Boilerplate
 */

define( 'QUERY_FILE_ROOT', __DIR__ . '/../../query/' );

/**
 * Execute SQL files
 *
 * @param string[] $filenames SQL files to execute.
 */
function wp_react_execute_sql( $filenames ) {
	global $wpdb;

	foreach ( $filenames as $filename ) {
		$wpdb->query(
			// Reason for ignore:
			// Executing raw SQL is necessary for test.
			// And this file is only included in the development version.
			file_get_contents( SQL_FILE_ROOT . $filename ) // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
		);
	}
}

/**
 * Generate SQL files
 *
 * @param string[] $filenames SQL insert files will be generated based on these files.
 */
function wp_react_generate_sql( $filenames ) {
	global $wpdb;

	foreach ( $filenames as $filename ) {
		$raw        = file_get_contents( QUERY_FILE_ROOT . $filename );
		$statements = explode( ';', $raw );

		$content = '';

		foreach ( $statements as $sql ) {
			if ( preg_match( '/\S/', $sql ) ) {
				$content .= '-- ' . $sql . "\n";

				preg_match( '/from\s+([^ ]+)/i', $sql, $m );
				$table_name = $m[1];

				// Reason for ignore:
				// Executing raw SQL is necessary for test.
				// And this file is only included in the development version.
				$result = $wpdb->get_results( $sql ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared

				foreach ( $result as $r ) {
					$values = array();

					$maxlength = max(
						array_map(
							function ( $c ) {
								return strlen( $c );
							},
							array_keys( get_object_vars( $r ) ) // Object keys.
						)
					);

					foreach ( $r as $column => $value ) {
						$whitespace = str_repeat( ' ', $maxlength + 4 - strlen( $column ) );
						$values[]   = "\t/* " . $column . ' */' . $whitespace . "'" . $value . "'";
					}

					$content .= 'insert into ' . $table_name . ' values(' . "\n" .
						implode( ",\n", $values ) . "\n" .
						');' . "\n";
				}

				$content .= "\n";
			}
		}

		file_put_contents( SQL_FILE_ROOT . $filename, $content );
	}
}
