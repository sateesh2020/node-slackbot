'use strict';

const express = require('express');
const service = express();
const request = require('superagent');
const moment = require('moment');

service.get('/service/:location', (req, res, next) => {

    request.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + req.params.location + `&key=${process.env.GOOGLE_API_KEY}`, (err, response) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        
        let result = response.body.results;
        if (result.length) {
            console.log('Location', response.body.results[0].geometry);
            const location = response.body.results[0].geometry.location;
            const timestamp = +moment().format('X');

            request.get('https://maps.googleapis.com/maps/api/timezone/json?location=' + location.lat + ',' + location.lng + '&timestamp=' + timestamp + `&key=${process.env.GOOGLE_API_KEY}`, (err, response) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                }

                const result = response.body;
                if (result.errorMessage) {
                    console.log(result.errorMessage);
                    res.json({error: 'Failed at Time API'});
                } else {
                    const timeString = moment
                        .unix(timestamp + result.dstOffset + result.rawOffset)
                        .utc()
                        .format('dddd, MMMM Do YYYY, h:mm:ss a');
                    res.json({result: timeString});
                }

            });
        } else {
            res.json({error: 'Failed at Geo Location API'});
        }

    });

});

module.exports = service;