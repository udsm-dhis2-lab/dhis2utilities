const URL = process.argv[2];
const credentialsSource = process.argv[3];
const typeOfActivity = process.argv[4];
const request = require("request");
const http = require("http");
const https = require("https");
const tokenSource = btoa();
const credentialsDestination = "";
let headerConfigsSource = {
  headers: {
    Authorization: "Bearer " + tokenSource
  }
};
