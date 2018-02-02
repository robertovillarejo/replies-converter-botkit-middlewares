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

function isForFacebook(item) {
    item.platform === 'facebook' ? true : false;
};

var middleware = {}; //The middleware

middleware.receive = function (bot, message, next) {

    //Checks if exists a nlpResponse from DialogFlow
    if (message.nlpResponse === undefined) {
        debug('bot-kit-middleware-dialogflow was not previously executed');
        next();
    }

    var fbMessages = [];

    var messages = message.nlpResponse.result.fulfillment.messages.filter(isForFacebook);

    var messages = messages.filter(isForFacebook);

    if (messages.length === 0) {
        fbMessages.push(message.nlpResponse.result.fulfillment.speech);
    }

    messages.forEach(function (item, index) {

        switch (item.type) {
            case 0: //Text
                fbMessages.push(toText(item));
                break;

            case 1: //Card
                break;

            case 2: //Quick replies
                fbMessages.push(toQuickReplies(item));
                break;

            case 3: //Image
                fbMessages.push(toImage(item));
                break;

            default:
                break;
        }

    });

    debug('Web message:', fbMessages);
    message.webMessages = fbMessages;

    next();
};

module.exports = middleware;