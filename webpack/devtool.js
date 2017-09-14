const {dev} = require('./common');

module.exports = dev
? 'cheap-module-eval-source-map'
//: 'source-map';
: '';