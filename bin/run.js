'use strict';

const service = require('../server/service');
const slackClient = require('../server/slackClient');
const http = require('http');

const server = http.createServer(service);

// Should be the Bot Access Token
const TOKEN = 'xoxb-217507418292-517742500934-wD0yKIKZAQgutkA5EVOksaW9';
const SLACK_LOG_LEVEL = 'debug';

const rtm = slackClient.init(TOKEN, SLACK_LOG_LEVEL);
rtm.start();
server.listen(3000);

server.on('listening', function() {
    console.log(`IRIS is listening on ${server.address().port} in ${service.get('env')} mode.`);
});