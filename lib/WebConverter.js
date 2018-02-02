'use strict'

var debug = require('debug')('web-replies-converter');

function toText(dialogflowMessage) {
    return dialogflowMessage.speech;
};

function toImage(dialogflowMessage) {
    return {
        url: dialogflowMessage.imageUrl,
        image: true
    };
}

function toQuickReplies(dialogflowMessage) {

    var quickReplies = {
        text: dialogflowMessage.title || 'Choose an item',
        quick_replies: []
    };

    dialogflowMessage.replies.forEach(function (item) {
        quickReplies.quick_replies.push({
            title: item,
            payload: item
        });
    });
    return quickReplies;
};

var middleware = {}; //The middleware

middleware.receive = function (bot, message, next) {

    //Checks if exists a nlpResponse from DialogFlow
    if (!message.nlpResponse) {
        debug('bot-kit-middleware-dialogflow was not previously executed');
        next();
    }

    var webMessages = [];

    var messages = message.nlpResponse.result.fulfillment.messages.filter(item => item.platform === 'facebook' ? true : false);

    if (messages.length === 0) {
        webMessages.push(message.nlpResponse.result.fulfillment.speech);
    }

    messages.forEach(function (item, index) {

        switch (item.type) {
            case 0: //Text
                webMessages.push(toText(item));
                break;

            case 1: //Card
                break;

            case 2: //Quick replies
                webMessages.push(toQuickReplies(item));
                break;

            case 3: //Image
                webMessages.push(toImage(item));
                break;

            default:
                break;
        }

    });

    message.webMessages = webMessages;

    next();
};

module.exports = middleware;