<?php
/**
 * Plugin Name: LearnDash Quiz Power Pack
 * Plugin URI: https://github.com/sainthkh/wp-react-plugin-boilerplate
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
defined( 'WP_QUIZ_POWER_PACKDEVELOPMENT_MODE' ) or define( 'WP_QUIZ_POWER_PACKDEVELOPMENT_MODE', true );
### END AUTO-GENERATED DEFINES

define( 'WP_QUIZ_POWER_PACKPATH', dirname( __FILE__ ) );
define( 'WP_QUIZ_POWER_PACKURL', plugins_url( '', __FILE__ ) );

require WP_QUIZ_POWER_PACKPATH . '/lib/load.php';

add_shortcode( 'React', 'wpqp_plugin_react' );

/**
 * The shortcode to add React app to WordPress
 */
function wpqp_plugin_react() {
	wp_enqueue_script( 'wp-react-plugin-script' );
	wp_enqueue_script( 'wp-api' );

	return '<div id="wp-react-root"></div>';
}

add_action( 'wp_enqueue_scripts', 'wpqp_plugin_load_react' );

/**
 * Register React Scripts for WordPress
 */
function wpqp_plugin_load_react() {
	wp_register_script( 'wp-react-plugin-script', WP_QUIZ_POWER_PACKURL . '/build/build.js' );
	wp_localize_script( 'wp-react-plugin-script', 'wpReactPlugin', array( 'appId' => 'wp-react-root' ) );
}
