var facebookConverter = require(__dirname + '/FacebookConverter.js');
var webConverter = require(__dirname + '/WebConverter.js');
var slackConverter = require(__dirname + '/SlackConverter.js');

module.exports = {
    facebook: facebookConverter,
    web: webConverter,
    slack: slackConverter
};