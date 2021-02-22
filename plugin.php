<?php
/**
 * Plugin Name: LearnDash Quiz Power Pack
 * Plugin URI: https://github.com/wardbase/learndash-quiz-power-pack
 * Description: The powerup for learndash quiz system.
 * Requires at least: 5.4
 * Requires PHP: 5.6
 * Version: 1.0.0
 * Author: sainthkh
 * Text Domain: ld-quiz-power-pack
 *
 * @package ld-quiz-power-pack
 */

### BEGIN AUTO-GENERATED DEFINES
defined( 'WP_QUIZ_POWER_PACK_DEVELOPMENT_MODE' ) or define( 'WP_QUIZ_POWER_PACK_DEVELOPMENT_MODE', true );
### END AUTO-GENERATED DEFINES

define( 'WP_QUIZ_POWER_PACK_PATH', dirname( __FILE__ ) );
define( 'WP_QUIZ_POWER_PACK_URL', plugins_url( '', __FILE__ ) );

require WP_QUIZ_POWER_PACK_PATH . '/lib/load.php';

add_shortcode( 'React', 'wpqp_plugin_react' );

/**
 * The shortcode to add React app to WordPress
 */
function wpqp_plugin_react() {
	wp_enqueue_script( 'wp-react-plugin-script' );

	return '<div id="wp-react-root"></div>';
}

add_action( 'wp_enqueue_scripts', 'wpqp_plugin_load_react' );

/**
 * Register React Scripts for WordPress
 */
function wpqp_plugin_load_react() {
	wp_register_script( 'wp-react-plugin-script', WP_QUIZ_POWER_PACK_URL . '/build/build.js' );
	wp_localize_script( 'wp-react-plugin-script', 'wpReactPlugin', array( 'appId' => 'wp-react-root' ) );
	wp_enqueue_script( 'wp-api' );
}

// Load APIs for tests.
if ( WP_QUIZ_POWER_PACK_DEVELOPMENT_MODE ) {
	require_once WP_QUIZ_POWER_PACK_PATH . '/test/e2e/api/load.php';
}
