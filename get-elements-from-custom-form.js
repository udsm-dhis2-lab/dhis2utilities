var URL = process.argv[2];
var credentials = process.argv[3];
var typeOfActivity = process.argv[4];
var request = require("request");
var http = require("http");
var https = require("https");
var querystring = require("querystring");
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./store");
}
var cheerio = require("cheerio"),
  fs = require("fs");
const referenceFolder = "msdqi-custom-forms";
const files = [
  "msdqi-1-opd-new.html",
  "msdqi-2-mrdt-new.html",
  "msdqi-3-rch-new.html",
  "msdqi-4-severe-malaria-new.html",
  "msdqi-5-logistic-supply-new.html",
  "msdqi-6-microscopy-new.html"
];
// var headers = {
//     'Content-Type': 'application/json',
//     "Authorization": 'Basic ' + new Buffer(credentials).toString('base64')
// }

console.log("here");

files.forEach(file => {
  fs.readFile(referenceFolder + "/" + file, "utf8", formatHtml);

  function formatHtml(error, data) {
    $ = cheerio.load("" + data + "");
    $("#msdqi").each(function(i, customForm) {
      $('input[name="entryfield"]').each(function(i, inputElement) {
        console.log(
          $(inputElement)
            .attr("id")
            .split("-")[1]
        );
        $(inputElement).replaceWith(
          $(inputElement)
            .attr("id")
            .split("-")[1]
        );
      });
      var content = $.html(customForm);
      console.log(file);
      console.log(content);
      fs.writeFile("msdqi-custom-forms-formatted/" + file, content, function(
        err
      ) {
        console.log("Error writing to a file", err);
      });
    });
  }
});
