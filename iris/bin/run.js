'use strict';

const service = require('../server/service');
const slackClient = require('../server/slackClient');
const http = require('http');
require('dotenv').config();

const server = http.createServer(service);

// Should be the Bot Access Token
const SLACK_TOKEN = process.env.SLACK_TOKEN;
const WIT_TOKEN = process.env.WIT_TOKEN;

const wit = require('../server/witClient')(WIT_TOKEN);

const rtm = slackClient.init(SLACK_TOKEN, wit);

rtm.start();

// Start Express Server after Authenticated with Slack. 
slackClient.addAuthenticatedHandler(rtm, () => {
    server.listen(3000);
})

server.on('listening', function() {
    console.log(`IRIS is listening on ${server.address().port} in ${service.get('env')} mode.`);
});