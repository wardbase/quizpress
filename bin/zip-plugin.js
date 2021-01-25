/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require( 'fs' );
const archiver = require( 'archiver' );

const output = fs.createWriteStream( 'plugin.zip' );
const archive = archiver( 'zip' );

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

const files = [ 'plugin.php' ];

files.forEach( ( file ) => {
	archive.file( file, { name: file } );
} );

const folders = [ 'lib', 'build' ];

folders.forEach( ( folder ) => {
	// append files from a sub-directory, putting its contents at the root of archive
	archive.directory( folder, folder );
} );

archive.finalize();
