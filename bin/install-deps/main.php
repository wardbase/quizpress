<?php
/**
 * Install WordPress dependencies (plugins, themes)
 *
 * @package WP React Plugin Boilerplate
 */

define( 'WP_DEPS_FILE', __DIR__ . '/../../wp-deps.json' );
define( 'WP_DEPS_ROOT', __DIR__ . '/../../wp-deps/' );
define( 'WP_REACT_PLUGIN_PATH', __DIR__ . '/../../' );

require_once __DIR__ . '/lib.php';

// Load dotenv for local env.
$dotenv = null;
if ( file_exists( WP_REACT_PLUGIN_PATH . '/.env' ) ) {
	require_once __DIR__ . '/../../vendor/autoload.php';
	$dotenv = Dotenv\Dotenv::createImmutable( WP_REACT_PLUGIN_PATH );
	$dotenv->load();
}

// Step 1. Check wp-deps.json exists.

if ( ! file_exists( WP_DEPS_FILE ) ) {
	echo "wp-deps.json file doesn't exist.\n";
	exit;
}

// Step 2. Create wp-deps folder.

if ( ! file_exists( WP_DEPS_ROOT ) ) {
	mkdir( WP_DEPS_ROOT );
}

// Step 3. Download files and unzip them.

$raw  = file_get_contents( WP_DEPS_FILE );
$deps = json_decode( $raw );

install_plugins( $deps->plugins );
install_themes( $deps->themes );

// Step 4. Generate wp-env.override.json.

generate_wp_env_override_json( $deps );
