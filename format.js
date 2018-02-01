/**
 * Created by josephat on 12/15/17.
 */

var express = require('express');
var app = express();
var request = require('request');
var http = require('http');
var https = require('https');

var cheerio = require('cheerio'),
    fs = require('fs');
var credentials = 'josephatjulius:Jovan2013';

var headers = {
    'Content-Type': 'application/json',
    "Authorization": 'Basic ' + new Buffer(credentials).toString('base64')
}

var URL = 'https://dhis.hisptz.org/dhis';

app.get('/', function (req, res) {
    var formIdsArr = [];
    // /api/dataSets.json?paging=false&fields=id,name,indicators[id,numerator,denominator,indicatorType[factor]],dataEntryForm[htmlCode]&filter=formType:eq:CUSTOM
    // api call for all forms and their respective indicators
    var Path = "/api/dataSets.json?paging=false&fields=id,name&filter=formType:eq:CUSTOM";
    var Promise = require('promise');
    var promise = new Promise(function (resolve, reject) {
        request({
                headers: headers,
                uri: URL + Path,
                method: 'GET'
            },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var resDataSets = JSON.parse(body).dataSets;
                    resDataSets.forEach(function (formIdsAndNames) {
                        formIdsArr.push(formIdsAndNames);
                        resolve(formIdsArr);
                    })
                } else {
                    if (response) {
                        console.log(response.statusCode + ":", JSON.stringify(error));
                        reject();
                    } else {
                        console.log(response);
                    }
                }
            })
    });
    // all forms are downloaded
    promise.then(function(formIdsArr) {
        console.log(formIdsArr);
        var formNamesArr = [];
        var formIds = [];
    });
        res.send('Hello World');
});

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})
