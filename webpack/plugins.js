var {dev, prod, pages, extractPlugin} = require('./common');
const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// var ManifestPlugin = require('webpack-manifest-plugin');

// var ImageminPlugin = require('imagemin-webpack-plugin').default;
// var ImageminPlugin = require('imagemin-webpack-plugin');

var plugins = [
	new webpack.DefinePlugin({
		dev: JSON.stringify(dev),
		prod: JSON.stringify(prod)
	}),
	new webpack.ProvidePlugin({
		$: "jquery",
		jQuery: "jquery"
	})
];
if(dev) {
	var MultiHtmlWebpackPlugin = pages.map(name => 
		new HtmlWebpackPlugin({
			filename: './dev/html/' + name + '.html',
			template: './dev/html/' + name + '.html',
			showErrors: true,
			minify: {
				collapseWhitespace: true,
				preserveLineBreaks: true
			}
		})
	);
	plugins = [
		...plugins,
		...MultiHtmlWebpackPlugin,
		new webpack.HotModuleReplacementPlugin()
	];
} else {
	var MultiHtmlWebpackPlugin = pages.map(name =>
		new HtmlWebpackPlugin({
			filename: './html/' + name + '.html',
			template: './html/' + name + '.html',
			showErrors: true
		})
	);
	plugins = [
		...plugins,
		...MultiHtmlWebpackPlugin,
		extractPlugin,
//		new webpack.SourceMapDevToolPlugin({
//			filename: './js/main.js.map',
//		}),
		new webpack.optimize.UglifyJsPlugin(),
		new CleanWebpackPlugin(['prod'], {
			root: path.resolve(__dirname, "../"),
		}),
		new CopyWebpackPlugin([{
			from: 'images/**/*',
			to: path.resolve(__dirname, '../prod')
		}])
		// , new ImageminPlugin({test: /\.(jpe?g|png|gif|svg)$/i})
	];
};

module.exports = plugins;