const {dev} = require('./common');
const path = require('path');

module.exports = dev
? null
: path.resolve(__dirname, '../dev');