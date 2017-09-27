/**
 * Created by josephat on 9/21/17.
 */


// npm start https://dhis.moh.go.tz josephatjulius:Jovan2013
var URL = process.argv[2];
var credentials = process.argv[3];
var request = require('request');
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

fs.readFile('htmls/original.html', 'utf8', dataLoaded);

function dataLoaded(err, data) {
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
        var Path = "/api/indicators.json?paging=false&filter=id:in:[" + indStr.substr(0, indStr.length - 1) + "]&fields=id,numerator,denominator";
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
                        console.log(JSON.parse(body).indicators.length);
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

  $('table').each(function(i, elem) {
      //get indicators from local storage
      var arr = localStorage.getItem('indicatorsData');
      var indAggregations = {};
      // console.log(tmpData);
      for (var counter = 0; counter < Object.keys(JSON.parse(arr)).length; counter++) {
          if (JSON.parse(arr)[counter].numerator.split("+")[0].length < 18){
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
              var beforeReplacement = JSON.parse(arr)[counter].numerator;
              for (var idCount=0; idCount < JSON.parse(arr)[counter].numerator.split("+").length; idCount++) {
                  var inputId = JSON.parse(arr)[counter].numerator.split("+")[idCount].replace("#{","").replace("}","").replace(" ","").replace(" ","").replace(".","-")+"-val";
                  if ($('input[id="' + inputId + '" ]').length > 0) {
                      // the id is in the html file
                  } else {
                      // id not in the html file
                      var AfterReplacement = beforeReplacement.replace(beforeReplacement.split("+")[idCount]+"+","").replace("+"+beforeReplacement.split("+")[idCount],"");
                      beforeReplacement = AfterReplacement;
                      console.log("The id which is not in the inputs but in the indicator formula from api is "+JSON.parse(arr)[counter].numerator.split("+")[idCount].replace("#{","").replace("}","").replace(".","-")+"-val");
                  }
              }
              indAggregations[JSON.parse(arr)[counter].id] = '('+AfterReplacement+ ')/('+JSON.parse(arr)[counter].denominator+')';
          }
      }

      $('input[dataelementid]').each(function (index, val) {
         //  var test = $(val).attr('name');
          for (var aggr in tmpData){
              if ($(val).attr('id') === aggr){
                  $(val).attr('id', tmpData[aggr]);
              }
          }
          $(val).removeAttr('dataelementid');
          $(val).removeAttr('value');
          $(val).attr('name', 'indicatorFormula');
          $(val).attr('disabled','disabled');
      });
      $('input[indicatorid]').each(function (index, val) {
          for (var indAggr in indAggregations){
              if ($(val).attr('id').substr(9) === indAggr){
                  $(val).attr('id', indAggregations[indAggr]);
              }
          }
          $(val).removeAttr('indicatorid');
          $(val).removeAttr('value');
          $(val).attr('name', 'indicatorFormula');
          $(val).attr('disabled','disabled');
      });

    var id = $(elem).attr('id'),
        filename = 'htmls/new.html',
        content = $.html(elem);
      // console.log(indAggregations);
    fs.writeFile(filename, content, function (err) {
        console.log('Written html to ' + filename);
    });
  });
}

// loadIndicators();