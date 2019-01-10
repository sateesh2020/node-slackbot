'use strict';
const request = require('superagent');
const serviceThree = require('../server/service');
const http = require('http');
require('dotenv').config();

const server = http.createServer(serviceThree);
server.listen();

server.on('listening', function() {
    console.log(`IRIS-Weather is listening on ${server.address().port} in ${serviceThree.get('env')} mode.`);

    const announce = () => {
        request.put(`http://127.0.0.1:3000/service/weather/${server.address().port}`, (err, res) => {
            if(err) {
                console.log(err);
                console.log("Error connecting to Iris"); 
            }
        });
    };
    announce();
    setInterval(announce, 15*1000);
});