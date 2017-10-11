/**
 * Created by josephat on 9/21/17.
 */

// npm start https://test.hisptz.org/dhis josephatjulius:Jovan2013
var URL = process.argv[2];
var credentials = process.argv[3];
var request = require('request');
var http = require('http');
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

var headers2 = {
    'Content-Type': 'text/html',
    "Authorization": 'Basic ' + new Buffer(credentials).toString('base64')
}

// call and store dataSets
function storeDataSets(headers) {
    var formArr = [];
    var Path = "/api/dataSets.json?paging=false&fields=id,name,indicators[id,numerator,denominator,indicatorType[factor]],dataEntryForm[htmlCode]&filter=formType:eq:CUSTOM";
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
                    resDataSets.forEach(function (form) {
                        formArr.push(form);
                        resolve(formArr);
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
    promise.then(function(formArr) {
        localStorage.setItem('formStore',JSON.stringify(formArr));
    });
}

// backup the dataSets and return their names
function retrieveDataSetsObjectsAndStoreBackup() {
    var filesArr =[]; // to hold file Names
    var arr = localStorage.getItem('formStore');
    JSON.parse(arr).forEach(function (dataSet) {
        fs.readFile('scripts/script.html', 'utf8', getScript);
        function getScript(error, data) {
            var calculatingScript = '';
            $ = cheerio.load('' + data + '');
            $('script').each(function (index, element) {
                calculatingScript += $.html(element);
            });
            var filename = 'originalHtmls/'+dataSet.id+'.html';
            var content = '<sectionelem>\r\n<div class="toBeRemoved"><input dataSetName ="dataSetName" name = "'+ filename +'" /></div>\r\n'+calculatingScript + dataSet.dataEntryForm.htmlCode+'</sectionelem>';
            filesArr.push(filename);
            fs.writeFile(filename, content, function (err) {
                console.log('backup made for ' + 'originalHtmls/'+dataSet.name+'.html');
            });
            fs.readFile(filename, 'utf8', formatHtml);
        }
    });
}


function formatHtml(error, data) {
    $ = cheerio.load('' + data + '');
    var totalsArr = []; var entryFieldsArr = []; var indStr = '';
    $('input[name="entryfield"]').each(function (i, element) {
        entryFieldsArr.push(element.attribs.id);
    });
    $('input[name="total"]').each(function (i, element) {
        totalsArr.push(element.attribs.id);
    });

    $('input[name="indicator"]').each(function (i, element) {
        indStr += element.attribs.id.substr(9) +',';
    });

    var calledIndArr = [];

        var Path = "/api/indicators.json?paging=false&filter=id:in:[TiQcFefdkM3]&fields=id,numerator,denominator";
        console.log('THE PATH: '+ URL + Path);
        var Promise = require('promise');
        var promise = new Promise(function (resolve, reject) {
            request({
                    headers: headers,
                    uri: URL + Path,
                    method: 'GET'
                },
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var res = JSON.parse(body).indicators;
                        res.forEach(function (indicator) {
                            calledIndArr.push(indicator);
                            resolve(calledIndArr);
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
        promise.then(function(calledIndArr) {
            localStorage.setItem('indicatorsData',JSON.stringify(calledIndArr));
        });
    var tmpData = {};
    for (var index in totalsArr) {
        var arrIndId = '';
        entryFieldsArr.forEach(function (entryId, j) {
            if (entryId.split("-")[0] === totalsArr[index].substr(5)) {
                arrIndId += '#{'+entryId.split("-")[0] + "." + entryId.split("-")[1]+'},';
            }
        });
        tmpData[totalsArr[index]] = '('+arrIndId.substring(0, arrIndId.length - 1).split(",").join("+")+')';
    }

  $('sectionElem').each(function(i, elem) {
      //get indicators from local storage
      var arr = localStorage.getItem('indicatorsData');
      var indAggregations = {};
      // console.log(tmpData);
      var formName = '';
      $('input[dataSetName = "dataSetName"]').each(function (index, obj) {
          formName += obj.attribs.name
      });

      var dataSetArr = localStorage.getItem('formStore');
      JSON.parse(dataSetArr).forEach(function (dataSet) {
          if (dataSet.name === formName.replace('originalHtmls/','').replace('.html','')) {
              // console.log(dataSet.name);
          }
      });

      for (var counter = 0; counter < Object.keys(JSON.parse(arr)).length; counter++) {
          if (JSON.parse(arr)[counter].numerator.split("+")[0].length < 18) {
              var originalNumerator = JSON.parse(arr)[counter].numerator;
              for (var elementCounter = 0; elementCounter < JSON.parse(arr)[counter].numerator.split("+").length; elementCounter++) {
                  for (var index in tmpData) {
                      if (index.substr(5) === JSON.parse(arr)[counter].numerator.split("+")[elementCounter].replace("#{", "").replace("}", "")) {
                          originalNumerator = originalNumerator.replace(JSON.parse(arr)[counter].numerator.split("+")[elementCounter], tmpData[index].replace("(","").replace(")",""));
                      }
                  }
              }
              // Recheck if there is still dataelements in the indicator definition
              var finalRes = originalNumerator;
              for (var orCounter =0; orCounter < originalNumerator.replace("(","").replace(")","").split("+").length; orCounter++) {
                  var newIndDefStr = '';
                  // console.log("CHECK "+originalNumerator.replace("(","").replace(")","").split("+")[orCounter].replace("#{","").replace("}",""))
                  if (originalNumerator.replace("(","").replace(")","").split("+")[orCounter].length < 18) {
                      $('input[name="entryfield"]').each(function (i, field) {
                          // console.log(field.attribs.id.split("-")[0]+ "  "+i);
                          if (field.attribs.id.split("-")[0] === originalNumerator.replace("(","").replace(")","").split("+")[orCounter].replace("#{","").replace("}","").replace(" ","").replace(" ","")) {
                              newIndDefStr += "#{"+field.attribs.id.replace("-",".").replace("-val","")+"}+";
                          }
                      });
                      finalRes  = finalRes.replace(originalNumerator.replace("(","").replace(")","").split("+")[orCounter],newIndDefStr.substr(0,newIndDefStr.length - 1));
                  }
              }
              indAggregations[JSON.parse(arr)[counter].id] = '('+finalRes+')';
          } else {
              //remove input ids which are not in the form
              var check =false;
              var beforeReplacement = JSON.parse(arr)[counter].numerator;
              for (var idCount=0; idCount < beforeReplacement.split("+").length; idCount++) {
                  var inputId = beforeReplacement.split("+")[idCount].replace("#{","").replace("}","").replace(" ","").replace(" ","").replace(".","-")+"-val";
                  if ($('input[id="' + inputId + '" ]').length > 0) {
                      // the id is in the html file
                  } else {
                      // id not in the html file
                      check = true;
                      var AfterReplacement = beforeReplacement.replace(beforeReplacement.split("+")[idCount]+"+","").replace("+"+beforeReplacement.split("+")[idCount],"");
                      beforeReplacement = AfterReplacement;
                      console.log("The id which is not in the inputs but in the indicator formula from api is "+JSON.parse(arr)[counter].numerator.split("+")[idCount].replace("#{","").replace("}","").replace(".","-")+"-val");
                  }
              }
              indAggregations[JSON.parse(arr)[counter].id] = '('+beforeReplacement+ ')/('+JSON.parse(arr)[counter].denominator+')';
              // console.log("THAT "+beforeReplacement);
          }
      }

      $('input[dataelementid]').each(function (index, val) {
         //  var test = $(val).attr('name');
          for (var aggr in tmpData){
              if ($(val).attr('id') === aggr){
                  $(val).attr('indicatorFormula', tmpData[aggr]);
              }
          }
          $(val).removeAttr('dataelementid');
          $(val).removeAttr('value');
          $(val).attr('name', 'indicatorFormula');
      });
      $('input[indicatorid]').each(function (index, val) {
          for (var indAggr in indAggregations){
              if ($(val).attr('id').substr(9) === indAggr){
                  $(val).attr('indicatorFormula', indAggregations[indAggr]);
              }
          }
          $(val).removeAttr('indicatorid');
          $(val).removeAttr('value');
          $(val).attr('name', 'indicatorFormula');
      });

      $('div[class = "toBeRemoved"]').each(function (index, val) {
          $(val).attr('style','display: none');
      });

      var formName = '';
      $('input[dataSetName = "dataSetName"]').each(function (index, obj) {
          formName += obj.attribs.name
      });

        filename = formName.replace('originalHtmls','newHtmls');
        content = $.html(elem);
      // console.log(indAggregations);
    fs.writeFile(filename, content, function (err) {
        console.log('Written html to ' + filename);
    });

      fs.readFile(filename, 'utf-8', function (err, data) {
          data = data.replace('<sectionelem>',"").replace('</sectionelem>',"");

          var formName = '';
          $('input[dataSetName = "dataSetName"]').each(function (index, obj) {
              formName += obj.attribs.name
          });
          console.log(formName.replace("originalHtmls","").replace(".html",""))
          var apiPath = "/api/26/dataSets/"+ formName.replace("originalHtmls","").replace(".html","")+"/form"
          var options = {
              host: "localhost",
              port: "8181",
              path: apiPath,
              method: "POST",
              headers: headers2
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
  });
}

function readAndFormat() {
    // Store DataSets
    storeDataSets(headers);
    
    // Retrieve the dataSets and their names
    retrieveDataSetsObjectsAndStoreBackup();
}

readAndFormat();