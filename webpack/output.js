const {dev} = require('./common');
const path = require('path');

module.exports = dev
? {
	publicPath: '/',
	filename: 'main.js'
}
: {
	path: path.resolve(__dirname, '../prod'),
	filename: 'js/main.js'
};