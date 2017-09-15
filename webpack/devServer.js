const {dev} = require('./common');

if(dev) {
	// find host
	const os = require('os');
	// find host
	const interfaces = os.networkInterfaces();
	var addresses = [];
	for (var k in interfaces) {
		for (var k2 in interfaces[k]) {
			var address = interfaces[k][k2];
			if (address.family === 'IPv4' && !address.internal) {
				addresses.push(address.address);
			}
		}
	}
	var host = addresses[0];
}

module.exports = dev
? {
	// contentBase: './dev/',
	port: 9000,
	historyApiFallback: true,
	host: host,
	open: true,
	hot: true,
	clientLogLevel: "none",
	compress: true,
	openPage: '',
	// noInfo: true
}
: null;