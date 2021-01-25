import path from 'path';
import webpack, { Configuration } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import { name, version } from './package.json';

interface Config {
	production: boolean;
	development: boolean;
}

const APP_ROOT = './packages/app';

const webpackConfig = ( env: Config ): Configuration => ( {
	entry: path.join( APP_ROOT, 'src/index.tsx' ),
	...( env.production || ! env.development
		? {}
		: { devtool: 'eval-source-map' } ),
	resolve: {
		extensions: [ '.ts', '.tsx', '.js' ],
		//TODO waiting on https://github.com/dividab/tsconfig-paths-webpack-plugin/issues/61
		/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
		//@ts-ignore
		plugins: [ new TsconfigPathsPlugin() ],
	},
	output: {
		path: path.join( __dirname, '/build' ),
		filename: 'build.js',
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				options: {
					transpileOnly: true,
				},
				exclude: /dist/,
			},
			{
				test: /\.svg$/,
				type: 'asset/resource',
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					// Creates `style` nodes from JS strings
					'style-loader',
					// Translates CSS into CommonJS
					'css-loader',
					// Compiles Sass to CSS
					'sass-loader',
				],
			},
			{
				test: /\.css$/i,
				use: [
					// Creates `style` nodes from JS strings
					'style-loader',
					// Translates CSS into CommonJS
					'css-loader',
				],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin( {
			template: path.join( APP_ROOT, './public/index.html' ),
		} ),
		new webpack.DefinePlugin( {
			'process.env.PRODUCTION': env.production || ! env.development,
			'process.env.NAME': JSON.stringify( name ),
			'process.env.VERSION': JSON.stringify( version ),
		} ),
		new ForkTsCheckerWebpackPlugin( {
			eslint: {
				files: path.join( APP_ROOT, './src/**/*.{ts,tsx,js,jsx}' ), // required - same as command `eslint ./src/**/*.{ts,tsx,js,jsx} --ext .ts,.tsx,.js,.jsx`
			},
		} ),
	],
} );

export default webpackConfig;
