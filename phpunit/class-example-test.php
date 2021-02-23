<?php
/**
 * Example test file.
 *
 * @package WP React Plugin Boilerplate
 */

class Example_Test extends WP_UnitTestCase {

	/**
	 * Test add function
	 */
	function test_add() {
		$result = wpqp_plugin_add( 1, 4 );

		$this->assertEquals( 5, $result );
	}
}
