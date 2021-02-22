/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require( 'fs' );
const archiver = require( 'archiver' );
const package = require( '../package.json' );

const output = fs.createWriteStream( 'plugin.zip' );
const archive = archiver( 'zip' );

// 1. Set up archiver.
output.on( 'close', function () {
	// eslint-disable-next-line no-console
	console.log( archive.pointer() + ' total bytes' );
	// eslint-disable-next-line no-console
	console.log(
		'archiver has been finalized and the output file descriptor has closed.'
	);
} );

archive.on( 'error', function ( err ) {
	throw err;
} );

archive.pipe( output );

// 2. Replace content.
let content = fs.readFileSync( 'plugin.php' ).toString();

content = content.replace(
	/### BEGIN AUTO-GENERATED DEFINES[\s\S]*### END AUTO-GENERATED DEFINES/m,
	`define( 'WP_REACT_PLUGIN_VERSION', '${ package.version }' );`
);

fs.writeFileSync( 'plugin.temp.php', content );

archive.file( 'plugin.temp.php', { name: 'plugin.php' } );

// 3. Archive folders
const folders = [ 'lib', 'build' ];

folders.forEach( ( folder ) => {
	// append files from a sub-directory, putting its contents at the root of archive
	archive.directory( folder, folder );
} );

// 4. Create zip file.
archive.finalize().then( () => {
	// 5. Remove generated file.
	fs.unlinkSync( 'plugin.temp.php' );
} );
