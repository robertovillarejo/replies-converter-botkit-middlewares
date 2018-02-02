var facebookConverter = require(__dirname + '/FacebookConverter.js');
var webConverter = require(__dirname + '/WebConverter.js');

module.exports = {
    facebook: facebookConverter,
    web: webConverter
};