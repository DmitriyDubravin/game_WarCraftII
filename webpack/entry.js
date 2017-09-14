const {dev} = require('./common');

module.exports = dev
? './dev/js/main.js'
: './js/main.js';