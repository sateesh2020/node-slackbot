'use strict';

const {RTMClient, LogLevel} = require('@slack/client');
let RTM = null;
let nlp = null;

function handleOnAuthenticated(rtmStartData) {
    console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to channel`);
}

function handleOnMessage(message) {
    console.log(message);
    let {channel, user, text} = message;
    nlp.ask(text, (err, res) => {
        if (err) {
            console.log(err);
            return;
        }
        try {
            if (!res.intent || !res.intent[0] || !res.intent[0].value) {
                throw new Error("Could not extract intent.");
            } 

            const intent = require('./intents/' + res.intent[0].value + 'Intent');

            intent.process(res, function(error, response) {
                if(error) {
                    console.log(error.message);
                    return;
                }

                return RTM.sendMessage(response, channel);
            });

        } catch (err) {
            console.log(err);
            console.log(res);
            return RTM.sendMessage("Sorry, I don't know what you are talking about");
        }

        if (!res.intent) {
            return RTM.sendMessage("Sorry, I don't know what you are talking about.", channel);
        } else if (res.intent[0].value == 'time' && res.location) {
            return RTM.sendMessage(`I don't yet know the time in ${res.location[0].value}`, channel);
        } else {
            console.log(res);
            return RTM.sendMessage("Sorry, I don't know what you are talking about.", channel);
        }
    });

}

function addAuthenticatedHandler(rtm, handler) {
    RTM.on('authenticated', handler);
}

module.exports.init = function slackClient(token, nlpClient) {
    // The client is initialized and then started to get an active connection to the
    // platform
    RTM = new RTMClient(token, {logLevel: LogLevel.INFO});
    addAuthenticatedHandler(RTM, handleOnAuthenticated);
    RTM.on('message', handleOnMessage);

    nlp = nlpClient;
    return RTM;
}

module.exports.addAuthenticatedHandler = addAuthenticatedHandler;
