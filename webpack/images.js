const {dev} = require('./common');

module.exports = dev
? [
	{
		test: /\.(png|svg|jpg|gif)$/,
		use: [
			{
				loader: 'file-loader'
			}
		]
	}
]
: [
	{
		test: /\.(png|svg|jpg|gif)$/,
		use: [
			{
				loader: 'file-loader',
				options: {
					name: '[name].[ext]',
					publicPath: '..',
					outputPath: '/images/',
				}
			}
		]
	}
];