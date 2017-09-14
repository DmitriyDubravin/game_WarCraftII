const {dev} = require('./common');

module.exports = dev
? [
	{
		test: /\.js$/,
		enforce: 'pre',
		exclude: /node_modules/,
		use: [
			{
				loader: 'jshint-loader',
				options: {
					"esversion": 6
				}
			}
		]
	},
	{
		test: /\.js$/,
		exclude: /node_modules/,
		use: [
			{
				loader: 'babel-loader'
			}
		]
	}
]
: [
	{
		test: /\.js$/,
		exclude: /node_modules/,
		use: [
			{
				loader: 'babel-loader'
			}
		]
	}
];