/**
 * Created by josephat on 10/6/17.
 */

// npm start http://localhost:8181 josephatjulius:Jovan2013
var URL = process.argv[2];
var credentials = process.argv[3];
var request = require('request');
var http = require('http');
var curl = require('curl-cmd');
var querystring = require('querystring');
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./store');
}
var cheerio = require('cheerio'),
    fs = require('fs');

var headers = {
    'Content-Type': 'text/html',
    "Authorization": 'Basic ' + new Buffer(credentials).toString('base64')
}


// post the file
var filename = 'uMV8HPjFpjf';
//   function postHtml(dataContent, filename) {
//       // post string
//
//       var postData = querystring.stringify({
//         'compilation_level': 'ADVANCED_OPTIMIZATIONS',
//           'output_format': 'text/html',
//           'output_info': 'compiled_code',
//           'warning_level' : 'QUIET',
//           'html' : dataContent
//       });
//
//       var post_options = {
//           host: 'http://localhost:8181',
//           path: '/api/26/dataSets/'+ filename +'/form',
//           method: 'POST',
//           headers: {
//               'Content-Type': 'text/html',
//               'Content-Length': Buffer.byteLength(postData)
//           }
//       };
//
//       // Set up the request
//       var post_req = http.request(post_options, function(res) {
//           res.setEncoding('utf8');
//           res.on('data', function (chunk) {
//               console.log('Response: ' + chunk);
//           });
//       });
//
//       // post the data
//
//       post_req.write(postData);
//       post_req.end();
//   }
//
// fs.readFile('newHtmls/' + filename +'.html', 'utf-8', function (err, data) {
//     if (err) {
//         console.log("error occurred trying to read in the file: " + err);
//         process.exit(-2);
//     }
//     // Make sure there's data before we post it
//     if(data) {
//         filename = 'uMV8HPjFpjf';
//         var formName = 'originalHtmls/uMV8HPjFpjf.html';
//         formName = formName.replace("originalHtmls/","").replace(".html","");
//         postHtml(data, filename);
//
//     }
// });
  // curl -d @originalHtmls/PmG9AbWSoGO.html 'http://localhost:8181/api/26/dataSets/PmG9AbWSoGO/form' -H 'Content-Type:text/html' -u josephatjulius:Jovan2017 -X PUT -v


// var POSToptions = {
//     "hostname": 'http://localhost',
//     "port": "8181",
//     "path": '/api/26/dataSets/uMV8HPjFpjf/form',
//     "method": 'POST',
//     "headers": {
//         "Content-Type": "text/html",
//         "Authorization": 'Basic ' + new Buffer(credentials).toString('base64')
//     }
// };
// var req = http.request(POSToptions, function(res) {
//         res.on('data', function(d) {
//         console.log(parseIntArray(d)); // => { success: false, status: 400, message: 'Invalid format' }
// });
// });
// req.write('<p>Josephat</p>');
//
// req.on('error', function(e) {
//     console.error(e);
//     console.log('error');
// });
// req.end();


// Set the headers
var options = {
    hostname: 'localhost',
    port: 8181,
    path: '/api/26/dataSets/PmG9AbWSoGO/form',
    method: 'POST',
    body: '<p>Testing</p>',
    headers: headers
};

console.log('=> %s', curl.cmd(options));

curl.cmd({host: 'http://localhost', port: 8181, method: 'PUT', path: '/api/26/dataSets/PmG9AbWSoGO/form', headers: { 'Content-Type': 'text/html'}, auth: 'josephatjulius:Jovan2017' }, {ssl: false, verbose: false})
// curl -d @originalHtmls/PmG9AbWSoGO.html 'http://localhost:8181/api/26/dataSets/PmG9AbWSoGO/form' -H 'Content-Type:text/html' -u josephatjulius:Jovan2017 -X PUT -v

/* change these variables with your own client id and secret */
var clientId = "YOUR CLIENT ID";
var clientSecret = "YOUR CLIENT SECRET";

/* send the POST request to Autodesk and print the response to console */
fs.readFile('newHtmls/' + filename +'.html', 'utf-8', function (err, data) {

    var options = {
        host: "localhost",
        port: "8181",
        path: "/api/26/dataSets/uMV8HPjFpjf/form",
        method: "POST",
        headers: headers
    };

    var authRequest = http.request(options, function (authResponse) {
        var responseString = "";

        authResponse.on('data', function (data) {
            responseString += data;
        });
        authResponse.on("end", function () {
            console.log(responseString); // print token response to console
        });
    });

    authRequest.on('error', function (error) {
        console.log('error handler' + error);
    });

    authRequest.write(data);
    authRequest.end();
});