var fs = require( 'fs' );
var path = require( 'path' );

if ( process.argv.length <= 2 ) {

	console.log( "Usage: " + path.basename( __filename ) + " model.obj" );
	process.exit( - 1 );

}

//

var PRECISION = 6;

function parseNumber( key, value ) {

	return typeof value === 'number' ? parseFloat( value.toFixed( PRECISION ) ) : value;

}

THREE = require( './build/three.js' );
require( './build/OBJLoader.js' );

var file = process.argv[ 2 ];
var loader = new THREE.OBJLoader();

var text = fs.readFileSync( 'obj/' + file, 'utf8' );

var content = JSON.stringify( loader.parse( text ).toJSON(), parseNumber );
fs.writeFileSync( 'json/' + path.basename( file, '.obj' ) + '.json', content, 'utf8' );
