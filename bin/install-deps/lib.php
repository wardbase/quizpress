<?php
/**
 * Functions for installing WordPress dependencies
 *
 * @package WP React Plugin Boilerplate
 */

define( 'WP_DEPS_PLUGINS', WP_DEPS_ROOT . 'plugins/' );
define( 'WP_DEPS_THEMES', WP_DEPS_ROOT . 'themes/' );
define( 'WP_ENV_PATH', __DIR__ . '/../../.wp-env.json' );
define( 'WP_ENV_OVERRIDE_PATH', __DIR__ . '/../../.wp-env.override.json' );
define( 'WP_PLUGINS_ROOT_URL', 'https://downloads.wordpress.org/plugin/' );
define( 'WP_THEMES_ROOT_URL', 'https://downloads.wordpress.org/theme/' );

// Reason for ignore:
// Used at install_deps as a global variable.
$zip = new ZipArchive; // phpcs:ignore VariableAnalysis.CodeAnalysis.VariableAnalysis.UnusedVariable

/**
 * Check if a string is in JSON format
 *
 * @param string $string string to test.
 */
function is_json( $string ) {
	json_decode( $string );
	return ( json_last_error() === JSON_ERROR_NONE );
}

/**
 * Install WordPress dependencies.
 *
 * @param string $dep_category_dir The path to the root of dependency categories (i.e. plugin or theme).
 * @param string $wp_category_url The root url of the official WordPress dependency sites.
 * @param object $deps The list of dependencies to install.
 */
function install_deps( $dep_category_dir, $wp_category_url, $deps ) {
	global $zip;

	if ( count( get_object_vars( $deps ) ) > 0 ) {
		if ( ! file_exists( $dep_category_dir ) ) {
			mkdir( $dep_category_dir );
		}

		foreach ( $deps as $name => $version ) {
			$url = '';
			$key = null;
			if ( is_object( $version ) ) {
				$url = $version->url;
				$key = $version->key;
			} else {
				$url = strpos( $version, '://' ) !== false
					? $version
					: $wp_category_url . $name . '.' . $version . '.zip';
			}

			$filename = $dep_category_dir . $name . '.zip';
			$raw      = false;
			if ( null !== $key ) {
				$curl = curl_init();

				$header = array(
					'Authorization: token ' . $_ENV[ $key ],
					'Accept: application/vnd.github.v3.raw',
				);

				$config              = array();
				$config['useragent'] = 'WP-React-Installer/0.2.0';

				curl_setopt( $curl, CURLOPT_USERAGENT, $config['useragent'] );
				curl_setopt( $curl, CURLOPT_URL, $url );
				curl_setopt( $curl, CURLOPT_HTTPHEADER, $header );
				curl_setopt( $curl, CURLOPT_RETURNTRANSFER, true );

				$raw = curl_exec( $curl );

				if ( is_json( $raw ) ) {
					$raw = false;
				}

				curl_close( $curl );
			} else {
				$raw = @file_get_contents( $url );

				if ( false === $raw ) {
					$raw = @file_get_contents( WP_PLUGINS_ROOT_URL . $name . '.zip' );
				}
			}

			if ( false !== $raw ) {
				if ( is_object( $version ) ) {
					echo 'Downloaded ' . $name . "\n";
				} else {
					echo 'Downloaded ' . $name . ' ' . $version . "\n";
				}
			} else {
				echo 'Failed downloading ' . $name . "\n";
				continue;
			}
			file_put_contents( $filename, $raw );

			// extract file.
			$res = $zip->open( $filename );

			if ( true === $res ) {
				// Check if the root directory of the plugin is included.
				$theme_path = $zip->locateName( $name . '/' ) === false
					? $dep_category_dir . $name
					: $dep_category_dir;

				$zip->extractTo( $theme_path );
				$zip->close();
				echo 'Extracted ' . $name . "\n";
			} else {
				echo 'Failed unzipping ' . $name . "\n";
			}

			unlink( $filename );
		}
	}
}

/**
 * Install themes
 *
 * @param object $themes WordPress themes to install.
 */
function install_themes( $themes ) {
	return install_deps( WP_DEPS_THEMES, WP_THEMES_ROOT_URL, $themes );
}

/**
 * Install plugins
 *
 * @param object $plugins WordPress plugins to install.
 */
function install_plugins( $plugins ) {
	return install_deps( WP_DEPS_PLUGINS, WP_PLUGINS_ROOT_URL, $plugins );
}

/**
 * Generate wp-env.override.json for test.
 *
 * @param object $deps WordPress dependencies.
 */
function generate_wp_env_override_json( $deps ) {
	$wp_env  = json_decode( file_get_contents( WP_ENV_PATH ) );
	$wp_deps = array();

	$deps_plugins = $deps->plugins
		? array_keys( get_object_vars( $deps->plugins ) )
		: array();

	$wp_deps['plugins'] = array_merge(
		$wp_env->plugins,
		array_map(
			function ( $name ) {
				return './wp-deps/plugins/' . $name;
			},
			$deps_plugins
		)
	);

	$env_themes  = $wp_env->themes ? $wp_env->themes : array();
	$deps_themes = $deps->themes
		? array_keys( get_object_vars( $deps->themes ) )
		: array();

	$wp_deps['themes'] = array_merge(
		$env_themes,
		array_map(
			function ( $name ) {
				return './wp-deps/themes/' . $name;
			},
			$deps_themes
		)
	);

	$json = json_encode( $wp_deps, JSON_PRETTY_PRINT );

	file_put_contents( WP_ENV_OVERRIDE_PATH, $json );
}
