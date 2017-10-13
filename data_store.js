/**
 * Created by josephat on 10/13/17.
 */

var URL = process.argv[2];
var credentials = process.argv[3];
var typeOfActivity = process.argv[4];
var request = require('request');
var http = require('http');
var https = require('https');
var querystring = require('querystring');
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./store');
}
var cheerio = require('cheerio'),
    fs = require('fs');

var headers = {
    'Content-Type': 'application/json',
    "Authorization": 'Basic ' + new Buffer(credentials).toString('base64')
}

    var formArr = [];
    var Path = "/api/dataStore/malaria/favoriteOptions";
    var Promise = require('promise');
    var promise = new Promise(function (resolve, reject) {
        request({
                headers: headers,
                uri: URL + Path,
                method: 'GET'
            },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var result = JSON.parse(body);
                        resolve(result);
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

    promise.then(function (results) {
        localStorage.setItem('data_store_favourites',JSON.stringify(results));
    });

var dataSetsArr = localStorage.getItem('data_store_favourites');
    fs.readFile('store/data_malaria.json', 'utf-8', function (err, data) {

        var apiPath = "/dhis/api/dataStore/malaria/favoriteOptions";
        var options = {
            host: "test.hisptz.org",
            path: apiPath,
            method: "PUT",
            headers: headers
        };

        var authRequest = https.request(options, function (authResponse) {
            var responseString = "";

            authResponse.on('data', function (data) {
                responseString += data;
            });
            authResponse.on("end", function () {
                console.log('The response string: '+ responseString);
            });
        });

        authRequest.on('error', function (error) {
            console.log('\n' + error);
        });

        authRequest.write(data);
        authRequest.end();
    });