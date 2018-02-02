'use strict'

var debug = require('debug')('slack-replies-converter');

function toText(dialogflowMessage) {
    return dialogflowMessage.speech;
};

function toQuickReplies(dialogflowMessage) {
    var buttons = {
        title: dialogflowMessage.title,
        callback_id: null,
        attachment_type: 'default',
        actions: []
    };

    dialogflowMessage.replies.forEach(function (item, index) {
        buttons.actions.push({
            "name": item,
            "text": item,
            "value": item,
            "type": "button"
        });
    });

    return buttons;
};

function isForSlack(item) {
    item.platform === 'slack' ? true : false;
};


var middleware = {};

middleware.receive = function (bot, message, next) {

    if (message.nlpResponse === undefined) {
        debug('bot-kit-middleware-dialogflow was not previously executed');
        next();
    }

    var messages = message.nlpResponse.result.fulfillment.messages;

    var slackResponse = {};

    var slackMessages = messages.filter(isForSlack);

    if (slackMessages.length === 0) {
        slackResponse.text = message.nlpResponse.result.fulfillment.speech;
    }

    slackMessages.forEach(function (item, index) {
        var converted;

        switch (item.type) {
            case 0:
                converted = toText(item);
                slackResponse.text = converted;
                break;

            case 1:
                break;

            case 2:
                converted = toQuickReplies(item);
                slackResponse.attachments = [converted];
                break;

            default:
                break;
        }

    });

    debug('Slack response:', slackResponse);
    message.slackResponse = slackResponse;

    next();
};

module.exports = middleware;