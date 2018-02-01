/**
 * Created by josephat on 10/7/17.
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

var headers2 = {
    'Content-Type': 'text/html',
    "Authorization": 'Basic ' + new Buffer(credentials).toString('base64')
}

// backup the forms
if (typeOfActivity === 'backup') {
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
        var formNamesArr = [];
        var formIds = [];

        // localStorage.setItem('allforms', JSON.stringify(formArr));
        if (fs.existsSync('forms')){
            // the forms directory exists
        } else{
            fs.mkdirSync('forms');
        }

        formIdsArr.forEach(function (idAndName, index) {
            formNamesArr.push(idAndName.name);
            formIds.push(idAndName.id + ','+idAndName.name.replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace("  ","").replace(" ","").replace(" ","").replace("/","").replace("  ","").replace("  ","").replace("  ",""));
        });

        localStorage.setItem('formStore',JSON.stringify(formIds));
        localStorage.setItem('formNamesStore',JSON.stringify(formNamesArr));
        console.log('\nWelcome!!');

        console.log('\nThe Total number of datasets for backup is ' + formIdsArr.length);

        console.log('You will have to go ' + Math.round(formIdsArr.length / 10) + ' times');


        for(var countSteps =0; countSteps < Math.round(formIdsArr.length / 10); countSteps++) {
            var idsArr = JSON.parse(localStorage.getItem('formStore'));
            var idsIncluded = '';
            for (var idsCount = 0; idsCount < idsArr.length; idsCount++) {
                if (idsCount < (10*countSteps+10) && idsCount >= 10*countSteps){
                    idsIncluded += idsArr[idsCount].split(',')[0]+',';
                }
            }

            var path = '/api/dataSets.json?paging=false&fields=id,name,indicators[id,name,numerator,denominator,indicatorType[factor]],dataEntryForm[htmlCode]&filter=id:in:['+idsIncluded.substring(0, idsIncluded.length-1)+']';
            var formArr = [];
            var Promise = require('promise');
            var promise = new Promise(function (resolve, reject) {
                request({
                        headers: headers,
                        uri: URL + path,
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
            // all forms downloaded
            promise.then(function(formArr) {
                formArr.forEach(function (form, index) {
                    var formName = form.name.replace(" ","").replace(" ","").replace("  ","").replace(" ","").replace(" ","").replace("/","").replace("  ","").replace("  ","").replace("  ","")
                    if (fs.existsSync('forms/'+ formName)) {
                        // console.log('The dataSet '+ form.name+' already in backup');
                    } else {
                        formNamesArr.push(form.id+','+formName);
                        fs.mkdirSync('forms/'+ formName);
                        var indicatorsInFormArr = [];
                        $ = cheerio.load(form.dataEntryForm.htmlCode);
                        $('input[name="indicator"]').each(function (i, element) {
                            indicatorsInFormArr.push(element.attribs.id.substr(9));
                        });
                        var indicatorsFoundObj = {};
                        for (var indCount=0; indCount < indicatorsInFormArr.length; indCount++) {
                            form.indicators.forEach(function (indicator, i) {
                                if (indicator.id === indicatorsInFormArr[indCount]){
                                    var newNumerator = indicator.numerator.replace(" ","").replace("  ","")+"+";
                                    var newDenominator = indicator.denominator.replace(" ","").replace("  ","")+"+";
                                    if (indicator.numerator.indexOf("+") > 1 && indicator.numerator.split("+")[0].length < 18 && indicator.numerator.split("+")[0].length > 9) {
                                        var newNumerator = '';
                                        var numComponents = indicator.numerator.split("+");
                                        for (var numComponentsCount =0; numComponentsCount < numComponents.length; numComponentsCount++) {
                                            if (numComponents[numComponentsCount].length < 18 && numComponents[numComponentsCount].length > 9) {
                                                $('input[name="entryfield"]').each(function (i, field) {
                                                    var newEntryId = numComponents[numComponentsCount].replace("(","").replace(")","").replace("#{","").replace("}","").replace(" ","").replace(" ","");
                                                    if (field.attribs.id.split("-")[0] === newEntryId) {
                                                        newNumerator += "#{"+field.attribs.id.replace("-",".").replace("-val","").replace(" ","").replace("  ","")+"}+";
                                                    }
                                                });
                                            }
                                        }
                                    } else {
                                        if (indicator.numerator.length < 18 && indicator.numerator.length > 9) {
                                            var newNumerator = '';
                                            $('input[name="entryfield"]').each(function (i, field) {
                                                var newEntryId = indicator.numerator.replace("#{","").replace("}","").replace(" ","").replace(" ","");
                                                if (field.attribs.id.split("-")[0] === newEntryId) {
                                                    newNumerator += "#{"+field.attribs.id.replace("-",".").replace("-val","").replace(" ","").replace("  ","")+"}+";
                                                }
                                            });
                                        }
                                    }

                                    if (indicator.denominator.indexOf("+") > 1  && indicator.denominator.split("+")[0].length < 18 && indicator.denominator.split("+")[0].length > 9) {
                                        var denoComponents = indicator.denominator.split("+");
                                        var newDenominator = '';
                                        for (var denoComponentsCount =0; denoComponentsCount < denoComponents.length; denoComponentsCount++) {
                                            if (denoComponents[denoComponentsCount].length < 18 && denoComponents[denoComponentsCount].length > 9) {
                                                $('input[name="entryfield"]').each(function (i, field) {
                                                    var newEntryId = denoComponents[denoComponentsCount].replace("(","").replace(")","").replace("#{","").replace("}","").replace(" ","").replace(" ","");
                                                    if (field.attribs.id.split("-")[0] === newEntryId) {
                                                        newDenominator += "#{"+field.attribs.id.replace("-",".").replace("-val","").replace(" ","").replace("  ","")+"}+";
                                                    }
                                                });
                                            }
                                        }
                                    } else {
                                        if (indicator.denominator.length < 18 && indicator.denominator.length > 9) {
                                            var newDenominator = '';
                                            $('input[name="entryfield"]').each(function (i, field) {
                                                var newEntryId = indicator.denominator.replace("#{","").replace("}","").replace(" ","").replace(" ","");
                                                if (field.attribs.id.split("-")[0] === newEntryId) {
                                                    newDenominator += "#{"+field.attribs.id.replace("-",".").replace("-val","").replace(" ","").replace("  ","")+"}+";
                                                }
                                            });
                                        }
                                    }
                                    // indicatorsFoundObj[indicator.id] = '('+originalNumerator.substr(0, originalNumerator.length -1)+')/('+newDenominator.substr(0, newDenominator.length -1)+')*('+indicator.indicatorType.factor+')';

                                    indicatorsFoundObj[indicator.id] = '('+newNumerator.substr(0, newNumerator.length -1)+')/('+newDenominator.substr(0, newDenominator.length -1)+')*('+indicator.indicatorType.factor+')';

                                }
                            });
                        }
                        localStorage.setItem(formName,JSON.stringify(indicatorsFoundObj));

                        fs.readFile('scripts/script.html', 'utf8', getScript);
                        function getScript(error, data) {
                            var calculatingScript = '';
                            $ = cheerio.load('' + data + '');
                            $('script').each(function (index, element) {
                                calculatingScript += $.html(element);
                            });
                            localStorage.setItem('script',JSON.stringify(calculatingScript));
                        }

                        fs.writeFile('forms/'+ formName + '/original.html', '<sectionelem>\r\n<script>\r\n\t var indicatorAggregations = '+JSON.stringify(indicatorsFoundObj)+';\r\n</script>\r\n'+form.dataEntryForm.htmlCode +'\r\n</sectionelem>', function (err) {
                            console.log('backup made for the form ' + form.name);
                        });

                        fs.writeFile('forms/'+ formName + '/indicators.json', JSON.stringify(form.indicators), function (err) {
                            // console.log('backup made for ' + form.name + ' indicators');
                            // if (form.indicators.name.indexOf('X ') === 0) {
                            //     console.log('found: '+form.indicators.name);
                            // }

                            function SaveDataToLocalStorage(data)
                            {
                                var a = [];
                                a = JSON.parse(localStorage.getItem('indicators'));
                                a.push(data);
                                localStorage.setItem('indicators', JSON.stringify(a));
                            }
                            form.indicators.forEach(function (indicator) {
                                if (indicator.name.indexOf('X ') === 0) {
                                    data = {
                                        'indicatorId': indicator.id,
                                        'indicatorName': indicator.name
                                    };
                                    SaveDataToLocalStorage(data);
                                    // localStorage.setItem('indicators', JSON.stringify(data));
                                }
                            })
                        });
                    }
                });
            });
        }
    });
} else if (typeOfActivity === 'get-indicators') {
    var dataSetsArr = localStorage.getItem('formStore');
    var indArr = localStorage.getItem('indicators');
    fs.writeFile('X_indicators/indicators.json', indArr, function (err) {
        console.log('indicators starting with X stored');
    });
    var str = '';
    JSON.parse(indArr).forEach(function (val) {
        str += val.indicatorId + ',';
    });
    fs.writeFile('X_indicators/indicatorsIds.json', str, function (err) {
        console.log('indicators starting with X stored');
    });
    JSON.parse(dataSetsArr).forEach(function (dataSetName, index) {
        fs.readFile('forms/' + dataSetName.split(',')[1] + '/indicators.json', 'utf8', getIndicators);
        function getIndicators(error, data) {
            $ = cheerio.load('' + data + '');
            // console.log(data);
        }
    });
} else if (typeOfActivity ==='transform') {

    var dataSetsArr = localStorage.getItem('formStore');
    JSON.parse(dataSetsArr).forEach(function (dataSetName, index) {
        fs.readFile('forms/'+ dataSetName.split(',')[1] +'/original.html', 'utf8', formatHtml);

        function formatHtml(error, data) {
            $ = cheerio.load('' + data + '');
            var totalsArr = [];
            var entryFieldsArr = [];
            var indicatorsInFormArr = [];
            $('input[name="entryfield"]').each(function (i, element) {
                entryFieldsArr.push(element.attribs.id);
            });
            $('input[name="total"]').each(function (i, element) {
                totalsArr.push(element.attribs.id);
            });

            $('input[name="indicator"]').each(function (i, element) {
                indicatorsInFormArr.push(element.attribs.id.substr(9));
            });

            $('sectionelem').each(function(i, elem) {
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

                $('input[dataelementid]').each(function (index, val) {
                    //  var test = $(val).attr('name');
                    for (var aggr in tmpData){
                        if ($(val).attr('id') === aggr){
                            $(val).attr('indicatorFormula', tmpData[aggr]);
                            $(val).attr('id', aggr.substr(5));
                        }
                    }
                    $(val).removeAttr('dataelementid');
                    $(val).removeAttr('value');
                    $(val).attr('name', 'indicatorFormula');
                    $(val).attr('disabled', 'disabled');
                });

                $('input[indicatorid]').each(function (index, val) {
                    var indicatorsData = JSON.parse(localStorage.getItem(dataSetName.split(',')[1]));
                    for (var indicator in indicatorsData) {
                        if (indicator === $(val).attr('id').substr(9)) {
                            $(val).attr('indicatorFormula', '('+indicatorsData[indicator]+ ')');
                            $(val).attr('id', indicator);
                        }
                    }

                    $(val).removeAttr('indicatorid');
                    $(val).removeAttr('value');
                    $(val).attr('name', 'indicatorFormula');
                    $(val).attr('disabled', 'disabled');
                });
                var content = $.html(elem);
                var calculatingScript = JSON.parse(localStorage.getItem('script'));
                fs.writeFile('forms/'+dataSetName.split(',')[1]+'/new.html', ''+calculatingScript+'\r\n'+content.replace('<sectionelem>','').replace('</sectionelem>','')+'', function (err) {
                    console.log('The dataSet '+ dataSetName+' transformed');
                });
            });

        }
    });
} else if (typeOfActivity === 'post') {
    var dataSetsArr = localStorage.getItem('formStore');
    JSON.parse(dataSetsArr).forEach(function (dataSetName, index) {
        fs.readFile('forms/'+dataSetName.split(',')[1]+'/new.html', 'utf-8', function (err, data) {

            var apiPath = "/dhis/api/dataSets/"+ dataSetName.split(',')[0] +"/form";
            var options = {
                host: "test.hisptz.org",
                path: apiPath,
                method: "POST",
                headers: headers2
            };

            var authRequest = https.request(options, function (authResponse) {
                var responseString = "";

                authResponse.on('data', function (data) {
                    responseString += data;
                });
                authResponse.on("end", function () {
                    // console.log('The response string: '+ responseString);
                });
            });

            authRequest.on('error', function (error) {
                console.log('The following error has occured on posting the form '+ dataSetName.split(',')[0]);
                console.log('\n'+ error);
            });

            authRequest.write(data);
            authRequest.end();
        });
    });

    // var bar = new ProgressBar(':bar', { total: 100 });
    // var theInterval = 60;
    // var timer = setInterval(function () {
    //     bar.tick();
    //     if (bar.complete) {
    //         console.log('\ncomplete\n');
    //         clearInterval(timer);
    //     }
    // }, theInterval);
}