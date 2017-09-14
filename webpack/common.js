const dev = process.env.NODE_ENV === 'development';
const prod = process.env.NODE_ENV === 'production';
const fs = require('fs');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// create pages list
const pages = fs.readdirSync('dev/html').filter(page => /\.html$/.test(page)).map(page => page.slice(0,-5));

// create file pages.json
fs.writeFile('pages.json', JSON.stringify([dev ? 'dev' : 'prod', ...pages]), err => {if(err) throw err});

module.exports = {
	dev: dev,
	prod: prod,
	pages: pages,
	extractPlugin: new ExtractTextPlugin({
		filename: 'css/style.css'
	})
}