const {dev} = require('./common');
const extractPlugin = require('./common').extractPlugin;

module.exports = dev
? [
	{
		test: /\.scss$/,
		exclude: /node_modules/,
		use: [
			{
				loader: 'style-loader'
			},
			{
				loader: 'css-loader',
				options: {
					url: false, // ?
					sourceMap: true, // ! expose a runtime overhead and increase in bundle size
					minimize: true // ! In some cases the minification is destructive to the css; ! relative paths could be buggy
				}
			},
			// 'postcss-loader'
			{
				loader: 'sass-loader',
				options: {
					sourceMap: true
				}
			}
		]
	}
]
: [
	{
		test: /\.scss$/,
		use: extractPlugin.extract({
			use: [
				{
					loader: 'css-loader',
					options: {
						sourceMap: true,
						minimize: true
						
					}
				},
				{
					loader: 'sass-loader'
				}
			]
		})
	}
];