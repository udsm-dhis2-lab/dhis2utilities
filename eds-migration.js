require("dotenv").config();
const axios = require("axios");
// const credentialsSource = process.argv[3];
const tokenSource = new Buffer(process.env.CREDENTIALS_SOURCE).toString(
  "base64"
);
const tokenDestination = new Buffer(
  process.env.CREDENTIALS_DESTINATION
).toString("base64");
const SOURCE_BASE_URL = process.env.SOURCE_BASE_URL;
const DESTINATION_BASE_URL = process.env.DESTINATION_BASE_URL;
console.log(tokenSource);
console.log(tokenDestination);
let headerConfigsSource = {
  headers: {
    Authorization: "Basic " + tokenSource
  }
};

let headerConfigsDestination = {
  headers: {
    Authorization: "Basic " + tokenDestination
  }
};
const programs = [
  "RwVrL1Y8RTH",
  "CT0TNl30rld",
  "Z4szHfJebFL",
  "jYsHdmTJNVh",
  "go4MncVomkQ",
  "R8APevjOH0o"
];

axios
  .get(DESTINATION_BASE_URL + "api/users", {
    headers: headerConfigsDestination.headers
  })
  .then(function(response) {
    // handle success
    console.log(response.data);
  })
  .catch(function(error) {
    // handle error
    console.log(error);
  });
