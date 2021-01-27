<?php
/**
 * Plugin Name: WordPress React Plugin Boilerplate
 * Plugin URI: https://github.com/sainthkh/wp-react-plugin-boilerplate
 * Description: The good starting point for WordPress and React fans.
 * Requires at least: 5.3
 * Requires PHP: 5.6
 * Version: 1.0.0
 * Author: sainthkh
 * Text Domain: wp-react-plugin
 *
 * @package wp-react-plugin
 */

### BEGIN AUTO-GENERATED DEFINES
defined( 'WP_REACT_PLUGIN_DEVELOPMENT_MODE' ) or define( 'WP_REACT_PLUGIN_DEVELOPMENT_MODE', true );
### END AUTO-GENERATED DEFINES

define( 'WP_REACT_PLUGIN_PATH', dirname( __FILE__ ) );
define( 'WP_REACT_PLUGIN_URL', plugins_url( '', __FILE__ ) );

require WP_REACT_PLUGIN_PATH . '/lib/load.php';

add_shortcode( 'React', 'wp_react_plugin_react' );

/**
 * The shortcode to add React app to WordPress
 */
function wp_react_plugin_react() {
	wp_enqueue_script( 'wp-react-plugin-script' );
	wp_enqueue_script( 'wp-api' );

	return '<div id="wp-react-root"></div>';
}

add_action( 'wp_enqueue_scripts', 'wp_react_plugin_load_react' );

/**
 * Register React Scripts for WordPress
 */
function wp_react_plugin_load_react() {
	wp_register_script( 'wp-react-plugin-script', WP_REACT_PLUGIN_URL . '/build/build.js' );
	wp_localize_script( 'wp-react-plugin-script', 'wpReactPlugin', array( 'appId' => 'wp-react-root' ) );
}
