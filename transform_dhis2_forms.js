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
            // var path = '/api/dataSets.json?paging=false&fields=id,name,indicators[id,name,numerator,denominator,indicatorType[factor]],dataEntryForm[htmlCode]&filter=id:in:[qpcwPcj8D6u,v6wdME3ouXu]';
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
                            // console.log('backup made for the form ' + form.name);
                        });

                        fs.writeFile('forms/'+ formName + '/indicators.json', JSON.stringify(form.indicators), function (err) {
                            // console.log('backup made for ' + form.name + ' indicators');
                            // if (form.indicators.name.indexOf('X ') === 0) {
                            //     console.log('found: '+form.indicators.name);
                            // }

                            // function SaveDataToLocalStorage(data)
                            // {
                            //     var a = [];
                            //     a = JSON.parse(localStorage.getItem('indicators'));
                            //     a.push(data);
                            //     localStorage.setItem('indicators', JSON.stringify(a));
                            // }
                            // form.indicators.forEach(function (indicator) {
                            //     if (indicator.name.indexOf('X ') === 0) {
                            //         data = {
                            //             'indicatorId': indicator.id,
                            //             'indicatorName': indicator.name
                            //         };
                            //         SaveDataToLocalStorage(data);
                            //         // localStorage.setItem('indicators', JSON.stringify(data));
                            //     }
                            // })
                        });
                    }
                });
            });
        }
    });
} else if (typeOfActivity === 'transform-opd') {
    // transform OPD

    fs.readFile('opd/cbhs.html', 'utf8', formatHtml);

        function formatHtml(error, data) {
            $ = cheerio.load('' + data + '');
            var totalsArr = [];
            var entryFieldsArr = [];


        var aggregations = {"i58pkoss2vC":"(#{Vlm8JaQ0lyv.kSQNoVK6lfT}+ #{Vlm8JaQ0lyv.FXWh7WhyZsI} + #{Vlm8JaQ0lyv.TezJzpvcYYf} + #{Vlm8JaQ0lyv.YzJqv1Gsvd3} + #{Vlm8JaQ0lyv.OqBKGCPqT7w} + #{Vlm8JaQ0lyv.MlKDX74Cxl8}+#{Vlm8JaQ0lyv.IwuCRTr2yV2} + #{Vlm8JaQ0lyv.XmxKxXOnSQ6})/(1)*(1)","wW149UtUUzl":"(#{Vlm8JaQ0lyv.tvGcfb7qeoT}+#{Vlm8JaQ0lyv.cJknjgjXpl0}+#{Vlm8JaQ0lyv.Bth7pHOTg15}+#{Vlm8JaQ0lyv.Fc3CZmfCjN3}+#{Vlm8JaQ0lyv.myGoTv7iDvI}+#{Vlm8JaQ0lyv.flqExJgAWAc}+#{Vlm8JaQ0lyv.xPDENc2lOYf}+#{Vlm8JaQ0lyv.PfcygnSbFiT})/(1)*(1)","XRWcsccJfBN":"(#{YV63uqii8pc.X0Me7ygpiUT}+#{Vlm8JaQ0lyv.kSQNoVK6lfT}+ #{Vlm8JaQ0lyv.FXWh7WhyZsI} + #{Vlm8JaQ0lyv.TezJzpvcYYf} + #{Vlm8JaQ0lyv.YzJqv1Gsvd3} + #{Vlm8JaQ0lyv.OqBKGCPqT7w} + #{Vlm8JaQ0lyv.MlKDX74Cxl8}+#{Vlm8JaQ0lyv.IwuCRTr2yV2} + #{Vlm8JaQ0lyv.XmxKxXOnSQ6})/(1)*(1)","TwHzbjGd7h0":"(#{YV63uqii8pc.MqMQnGOqLuY}+#{Vlm8JaQ0lyv.tvGcfb7qeoT}+#{Vlm8JaQ0lyv.cJknjgjXpl0}+#{Vlm8JaQ0lyv.Bth7pHOTg15}+#{Vlm8JaQ0lyv.Fc3CZmfCjN3}+#{Vlm8JaQ0lyv.myGoTv7iDvI}+#{Vlm8JaQ0lyv.flqExJgAWAc}+#{Vlm8JaQ0lyv.xPDENc2lOYf}+#{Vlm8JaQ0lyv.PfcygnSbFiT})/(1)*(1)","oiyuh4Wrw2c":"(#{qrMJijoQIuh.X0Me7ygpiUT}+#{Vlm8JaQ0lyv.kSQNoVK6lfT}+#{Vlm8JaQ0lyv.FXWh7WhyZsI}+#{Vlm8JaQ0lyv.TezJzpvcYYf}+#{Vlm8JaQ0lyv.YzJqv1Gsvd3}+#{Vlm8JaQ0lyv.OqBKGCPqT7w}+#{Vlm8JaQ0lyv.MlKDX74Cxl8}+#{Vlm8JaQ0lyv.IwuCRTr2yV2}+#{Vlm8JaQ0lyv.XmxKxXOnSQ6})/(1)*(1)","KoZXR1bqmfD":"(#{qrMJijoQIuh.MqMQnGOqLuY}+#{Vlm8JaQ0lyv.tvGcfb7qeoT}+#{Vlm8JaQ0lyv.cJknjgjXpl0}+#{Vlm8JaQ0lyv.Bth7pHOTg15}+#{Vlm8JaQ0lyv.Fc3CZmfCjN3}+#{Vlm8JaQ0lyv.myGoTv7iDvI}+#{Vlm8JaQ0lyv.flqExJgAWAc}+#{Vlm8JaQ0lyv.xPDENc2lOYf}+#{Vlm8JaQ0lyv.PfcygnSbFiT})/(1)*(1)","LQiymdmudQd":"(#{PSQqneeq5rN.uGIJ6IdkP7Q}+#{DFkza0nrfp5.uGIJ6IdkP7Q}+#{DX5KJ8JKBsK.uGIJ6IdkP7Q}+#{LI7eCodZVG2.uGIJ6IdkP7Q}+#{JP63QANaai8.uGIJ6IdkP7Q})/(1)*(1)","DoBsACeBjpa":"(#{wQTcejmXZQZ.uGIJ6IdkP7Q}+#{e9OPODWMmwi.uGIJ6IdkP7Q}+#{ZTkfbUW6jaG.uGIJ6IdkP7Q}+#{sTFGaMwwaZL.uGIJ6IdkP7Q})/(1)*(1)","PkksCGhl2rc":"(#{xbBBEv5aVfk.uGIJ6IdkP7Q}+#{pcYSoX0Kqkk.uGIJ6IdkP7Q}+#{zBf5IyVxnv0.uGIJ6IdkP7Q}+#{DtvkMwPhdAo.uGIJ6IdkP7Q}+#{bs6JeeBOViB.uGIJ6IdkP7Q}+#{hB45AqUmtbN.uGIJ6IdkP7Q}+#{Bi4VeQHLBpb.uGIJ6IdkP7Q})/(1)*(1)","jpjmSekvERQ":"(#{WfFkA1Rybse.uGIJ6IdkP7Q}+ #{Uu6OY2lf6Qp.uGIJ6IdkP7Q}+#{HWqbvke0cl5.uGIJ6IdkP7Q}+#{QOhiEv3aUd0.uGIJ6IdkP7Q}+#{IRcy0sxaJMh.uGIJ6IdkP7Q}+#{iC2dOiUx6Wf.uGIJ6IdkP7Q}+#{W0elTqXjTKY.uGIJ6IdkP7Q}+#{odVwICwGsKz.uGIJ6IdkP7Q}+#{dCXxyeeUVbG.uGIJ6IdkP7Q}+#{sU7o4vijRlO.uGIJ6IdkP7Q}+#{HKNsMAiNSAM.uGIJ6IdkP7Q}+#{VwEmwFvI6cZ.uGIJ6IdkP7Q}+#{RE1BMCtBF3J.uGIJ6IdkP7Q}+#{JxnTDeS00o7.uGIJ6IdkP7Q})/(1)*(1)","NGaAoqkgkeE":"(#{KLCAWPOgkNB.uGIJ6IdkP7Q}+#{VmfFKZpBB0N.uGIJ6IdkP7Q}+#{b9jT4lI3osS.uGIJ6IdkP7Q}+#{jmyB46TVxIF.uGIJ6IdkP7Q}+#{Ln6gipOrW7b.uGIJ6IdkP7Q}+#{SBjTqPtc3fB.uGIJ6IdkP7Q}+#{E1CzPsjTqrn.uGIJ6IdkP7Q}+#{cGpDilmz4iT.uGIJ6IdkP7Q}+#{W2IGTUKeoV0.uGIJ6IdkP7Q}+#{eqleNn5DVyE.uGIJ6IdkP7Q}+#{Qd1YxZ3NY6b.uGIJ6IdkP7Q}+#{DMr4vpBEZJX.uGIJ6IdkP7Q}+#{Wi1bNSrziNY.uGIJ6IdkP7Q}+#{XLoriVwipEK.uGIJ6IdkP7Q})/(1)*(1)","AxVSDvCt2Cz":"(#{KtM6art1x9d.uGIJ6IdkP7Q}+#{nR3pODWXDrZ.uGIJ6IdkP7Q})/(1)*(1)"};
        $('selectelem').each(function(i, elem) {
            Object.keys(aggregations).forEach(function (key) {
            // console.log(key);
            $('input[name="indicator"]').each(function (i, element) {
                if (key === $(element).attr('indicatorid')) {
                    var indForm = aggregations[key].split('/')[0].replace('(','').replace(')',''); var newForm = '';
                    indForm.split('+').forEach(function (valKey) {
                        aggregations[key].replace(valKey,valKey);
                        newForm += valKey +'+'
                    });
                    $(element).attr('indicatorFormula', '('+newForm.substring(0,newForm.length-1)+')/(1)');
                    $(element).removeAttr('value');
                    $(element).removeAttr('oldid');
                    $(element).attr('name', 'indicatorFormula');
                    $(element).attr('disabled', 'disabled');
                }
            });
        });

        var content = $.html(elem);
                var calculatingScript = JSON.parse(localStorage.getItem('script'));
                fs.writeFile('opd/new_cbhs.html', ''+calculatingScript+'\r\n'+content+'', function (err) {
                    console.log('OPD has been transformed');
                });
        });
        }

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
} else if (typeOfActivity ==='transform-ipd') {
    fs.readFile('opd/ipd.html', 'utf8', formatHtml);

        function formatHtml(error, data) {
            $ = cheerio.load('' + data + '');
            var totalsArr = [];
            var entryFieldsArr = [];

        $('selectelem').each(function(i, elem) {
            // console.log(key);
            var indicatorsOjb = {
indicators: [
{
id: "dOQIhN53jbp",
numerator: "#{NRmqyxps5ZA.MQKsgFxCtJ7}+#{NRmqyxps5ZA.awkJLkKHr7a}",
denominator: "1"
},
{
id: "S554UZP337f",
numerator: "#{NRmqyxps5ZA.o9Oj5Cjekej}+#{NRmqyxps5ZA.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "MNXZpxyGwLs",
numerator: "#{SgeSIiqTN2l.uuidY4WdJml}+#{SgeSIiqTN2l.oliDewHdUdd}+#{SgeSIiqTN2l.awkJLkKHr7a}+#{SgeSIiqTN2l.MQKsgFxCtJ7}+#{SgeSIiqTN2l.dtdut9EncYH}+#{SgeSIiqTN2l.R33m4bJ5OcC}+#{SgeSIiqTN2l.e0RdqwlP1Xj}+#{SgeSIiqTN2l.iaPGviZZIky}+#{SgeSIiqTN2l.o9Oj5Cjekej}+#{SgeSIiqTN2l.ZU3sKDB9i2o} + #{SgeSIiqTN2l.o9Oj5Cjekej}+#{SgeSIiqTN2l.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "GBFTFNbojDw",
numerator: "#{n611GaZn5Xr.awkJLkKHr7a}+#{n611GaZn5Xr.MQKsgFxCtJ7}+#{n611GaZn5Xr.dtdut9EncYH}+#{n611GaZn5Xr.R33m4bJ5OcC}+#{n611GaZn5Xr.e0RdqwlP1Xj}+#{n611GaZn5Xr.iaPGviZZIky}+#{n611GaZn5Xr.oliDewHdUdd}+#{n611GaZn5Xr.uuidY4WdJml}",
denominator: "1"
},
{
id: "tuncApWdS2k",
numerator: "#{q3ELeLciuTh.R33m4bJ5OcC}+#{q3ELeLciuTh.dtdut9EncYH}",
denominator: "1"
},
{
id: "CtIjMYxpvyo",
numerator: "#{q3ELeLciuTh.MQKsgFxCtJ7}+#{q3ELeLciuTh.awkJLkKHr7a}",
denominator: "1"
},
{
id: "bV9ut14y3xw",
numerator: "#{q3ELeLciuTh.o9Oj5Cjekej}+#{q3ELeLciuTh.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "SPNEci80u5R",
numerator: "#{q3ELeLciuTh.iaPGviZZIky}+#{q3ELeLciuTh.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "xCcvlKYmhDa",
numerator: "#{TsLGQxidpbn.oliDewHdUdd}+#{TsLGQxidpbn.uuidY4WdJml}+#{TsLGQxidpbn.iaPGviZZIky}+#{TsLGQxidpbn.e0RdqwlP1Xj}+#{TsLGQxidpbn.R33m4bJ5OcC}+#{TsLGQxidpbn.dtdut9EncYH}+#{TsLGQxidpbn.MQKsgFxCtJ7}+#{TsLGQxidpbn.awkJLkKHr7a}+#{TsLGQxidpbn.o9Oj5Cjekej}+#{TsLGQxidpbn.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "o533IAhsTpi",
numerator: "#{TsLGQxidpbn.oliDewHdUdd}+#{TsLGQxidpbn.uuidY4WdJml}",
denominator: "1"
},
{
id: "pPejawAzSJL",
numerator: "#{TsLGQxidpbn.R33m4bJ5OcC}+#{TsLGQxidpbn.dtdut9EncYH}",
denominator: "1"
},
{
id: "litq56saV29",
numerator: "#{TsLGQxidpbn.MQKsgFxCtJ7}+#{TsLGQxidpbn.awkJLkKHr7a}",
denominator: "1"
},
{
id: "WIfVTzxF0oD",
numerator: "#{TsLGQxidpbn.o9Oj5Cjekej}+#{TsLGQxidpbn.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "QpZ2UNiHOil",
numerator: "#{TsLGQxidpbn.iaPGviZZIky}+#{TsLGQxidpbn.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "EqIKmAuDGl0",
numerator: "#{X0TXADJv7GA.oliDewHdUdd}+#{X0TXADJv7GA.uuidY4WdJml}",
denominator: "1"
},
{
id: "Nc4kCY4wg1D",
numerator: "#{X0TXADJv7GA.R33m4bJ5OcC}+#{X0TXADJv7GA.dtdut9EncYH}",
denominator: "1"
},
{
id: "LtTCRG4Sp98",
numerator: "#{avzBnVwWlV9.MQKsgFxCtJ7}+#{avzBnVwWlV9.awkJLkKHr7a}",
denominator: "1"
},
{
id: "S5LaJ1xjrkh",
numerator: "#{X0TXADJv7GA.o9Oj5Cjekej}+#{X0TXADJv7GA.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "QkQALopj7Vk",
numerator: "#{X0TXADJv7GA.iaPGviZZIky}+#{X0TXADJv7GA.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "iGTgvaWZEVh",
numerator: "#{avzBnVwWlV9.oliDewHdUdd}+#{avzBnVwWlV9.uuidY4WdJml}",
denominator: "1"
},
{
id: "Hhmm9HntU64",
numerator: "#{avzBnVwWlV9.R33m4bJ5OcC}+#{avzBnVwWlV9.dtdut9EncYH}",
denominator: "1"
},
{
id: "V3hE8jpiTrK",
numerator: "#{avzBnVwWlV9.MQKsgFxCtJ7}+#{avzBnVwWlV9.awkJLkKHr7a}",
denominator: "1"
},
{
id: "xp0qN6IgWXL",
numerator: "#{avzBnVwWlV9.o9Oj5Cjekej}+#{avzBnVwWlV9.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "d6Ro0Px337e",
numerator: "#{avzBnVwWlV9.iaPGviZZIky}+#{avzBnVwWlV9.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "NpwAG67TQES",
numerator: "#{fWq6ZXy0Uzp.oliDewHdUdd}+#{fWq6ZXy0Uzp.uuidY4WdJml}",
denominator: "1"
},
{
id: "xChQkPgBNJI",
numerator: "#{fWq6ZXy0Uzp.R33m4bJ5OcC}+#{fWq6ZXy0Uzp.dtdut9EncYH}",
denominator: "1"
},
{
id: "WbBK2O7bq3M",
numerator: "#{fWq6ZXy0Uzp.o9Oj5Cjekej}+#{fWq6ZXy0Uzp.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "JqoRh4VBB8q",
numerator: "#{fWq6ZXy0Uzp.o9Oj5Cjekej}+#{fWq6ZXy0Uzp.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "t3FlU4WnDYv",
numerator: " #{fWq6ZXy0Uzp.iaPGviZZIky}+#{fWq6ZXy0Uzp.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "spUKa6jtYhI",
numerator: "#{fWq6ZXy0Uzp.R33m4bJ5OcC}+#{fWq6ZXy0Uzp.dtdut9EncYH}",
denominator: "1"
},
{
id: "hFkpey2JYFk",
numerator: "#{fWq6ZXy0Uzp.MQKsgFxCtJ7}+#{fWq6ZXy0Uzp.awkJLkKHr7a}",
denominator: "1"
},
{
id: "jXlmpos6eLs",
numerator: "#{Wa3cm09YbsP.o9Oj5Cjekej}+#{Wa3cm09YbsP.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "Brbw91YZWgX",
numerator: "#{Wa3cm09YbsP.iaPGviZZIky}+#{Wa3cm09YbsP.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "GNvOTtqqjj4",
numerator: "#{AKeayZWILrh.R33m4bJ5OcC}+#{AKeayZWILrh.dtdut9EncYH}",
denominator: "1"
},
{
id: "DAav0n4dGJp",
numerator: "#{AKeayZWILrh.MQKsgFxCtJ7}+#{AKeayZWILrh.awkJLkKHr7a}",
denominator: "1"
},
{
id: "oxoFc2xVuuu",
numerator: "#{AKeayZWILrh.o9Oj5Cjekej}+#{AKeayZWILrh.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "EYhTd0EPu06",
numerator: "#{AKeayZWILrh.iaPGviZZIky}+#{AKeayZWILrh.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "PCiPQ5aKx66",
numerator: "#{CWXG9lBSI7Y.oliDewHdUdd}+#{CWXG9lBSI7Y.uuidY4WdJml}",
denominator: "1"
},
{
id: "W0lMgrZVd0j",
numerator: "#{HWZmyu3j4NX.oliDewHdUdd}+#{HWZmyu3j4NX.uuidY4WdJml}",
denominator: "1"
},
{
id: "w2a7NmJfJZ1",
numerator: "#{HWZmyu3j4NX.R33m4bJ5OcC}+#{HWZmyu3j4NX.dtdut9EncYH}",
denominator: "1"
},
{
id: "BGlFOZLACyO",
numerator: "#{HWZmyu3j4NX.MQKsgFxCtJ7}+#{HWZmyu3j4NX.awkJLkKHr7a}",
denominator: "1"
},
{
id: "I8KHskoYj9G",
numerator: "#{HWZmyu3j4NX.o9Oj5Cjekej}+#{HWZmyu3j4NX.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "VpnWQhFbmpO",
numerator: "#{HWZmyu3j4NX.iaPGviZZIky}+#{HWZmyu3j4NX.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "bqKskyObkT2",
numerator: "#{zqaHIXl6j7c.oliDewHdUdd}+#{zqaHIXl6j7c.uuidY4WdJml}",
denominator: "1"
},
{
id: "b49f5bT8Uyu",
numerator: "#{zqaHIXl6j7c.R33m4bJ5OcC}+#{zqaHIXl6j7c.dtdut9EncYH}",
denominator: "1"
},
{
id: "Y0IgoCr322S",
numerator: "#{zqaHIXl6j7c.MQKsgFxCtJ7}+#{zqaHIXl6j7c.awkJLkKHr7a}",
denominator: "1"
},
{
id: "qu2NqKC1GWj",
numerator: "#{zqaHIXl6j7c.o9Oj5Cjekej}+#{zqaHIXl6j7c.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "vW189MBHWUc",
numerator: "#{zqaHIXl6j7c.iaPGviZZIky}+#{zqaHIXl6j7c.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "uGWQzbJxIIz",
numerator: "#{mE81BaLRP29.awkJLkKHr7a}+#{mE81BaLRP29.MQKsgFxCtJ7}+#{mE81BaLRP29.dtdut9EncYH}+#{mE81BaLRP29.R33m4bJ5OcC}+#{mE81BaLRP29.e0RdqwlP1Xj}+#{mE81BaLRP29.iaPGviZZIky}+#{mE81BaLRP29.oliDewHdUdd}+#{mE81BaLRP29.uuidY4WdJml}+#{mE81BaLRP29.o9Oj5Cjekej}+#{mE81BaLRP29.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "jxGBiXBxZt7",
numerator: "#{mE81BaLRP29.oliDewHdUdd}+#{mE81BaLRP29.uuidY4WdJml}",
denominator: "1"
},
{
id: "PdAAdogUxhf",
numerator: "#{mE81BaLRP29.R33m4bJ5OcC}+#{mE81BaLRP29.dtdut9EncYH}",
denominator: "1"
},
{
id: "ma2IGuoqrt9",
numerator: "#{mE81BaLRP29.MQKsgFxCtJ7}+#{mE81BaLRP29.awkJLkKHr7a}",
denominator: "1"
},
{
id: "yDr51H8EuC0",
numerator: "#{mE81BaLRP29.o9Oj5Cjekej}+#{mE81BaLRP29.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "bDuXmFga3vY",
numerator: "#{mE81BaLRP29.iaPGviZZIky}+#{mE81BaLRP29.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "Mfu4kCFqgQ8",
numerator: "#{qwFz1atKnbC.R33m4bJ5OcC}+#{qwFz1atKnbC.dtdut9EncYH}",
denominator: "1"
},
{
id: "IINaYannWWy",
numerator: "#{qwFz1atKnbC.MQKsgFxCtJ7}+#{qwFz1atKnbC.awkJLkKHr7a}",
denominator: "1"
},
{
id: "vXa0ZTx50cD",
numerator: "#{qwFz1atKnbC.o9Oj5Cjekej}+#{qwFz1atKnbC.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "zsNv9VA9DQ2",
numerator: "#{qwFz1atKnbC.iaPGviZZIky}+#{qwFz1atKnbC.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "dBQKRNyyFfk",
numerator: "#{QPCEJmazWgv.awkJLkKHr7a}+#{QPCEJmazWgv.MQKsgFxCtJ7}+#{QPCEJmazWgv.dtdut9EncYH}+#{QPCEJmazWgv.R33m4bJ5OcC}+#{QPCEJmazWgv.e0RdqwlP1Xj}+#{QPCEJmazWgv.iaPGviZZIky}+#{QPCEJmazWgv.o9Oj5Cjekej}+#{QPCEJmazWgv.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "fjc3IGlHHlX",
numerator: "#{QPCEJmazWgv.oliDewHdUdd}+#{QPCEJmazWgv.uuidY4WdJml}",
denominator: "1"
},
{
id: "VrBxwBKby0S",
numerator: "#{QPCEJmazWgv.R33m4bJ5OcC}+#{QPCEJmazWgv.dtdut9EncYH}",
denominator: "1"
},
{
id: "YbzHxFVjnEP",
numerator: "#{QPCEJmazWgv.MQKsgFxCtJ7}+#{QPCEJmazWgv.awkJLkKHr7a}",
denominator: "1"
},
{
id: "TLtrNt9JkiA",
numerator: "#{QPCEJmazWgv.o9Oj5Cjekej}+#{QPCEJmazWgv.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "PFfYKy66rIR",
numerator: "#{QPCEJmazWgv.iaPGviZZIky}+#{QPCEJmazWgv.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "blCztXHNgH3",
numerator: "#{CsYfybuaSgc.oliDewHdUdd}+#{CsYfybuaSgc.uuidY4WdJml}",
denominator: "1"
},
{
id: "AnopejapfyO",
numerator: "#{CsYfybuaSgc.R33m4bJ5OcC}+#{CsYfybuaSgc.dtdut9EncYH}",
denominator: "1"
},
{
id: "fsw6HOquDiG",
numerator: "#{CsYfybuaSgc.MQKsgFxCtJ7}+#{CsYfybuaSgc.awkJLkKHr7a}",
denominator: "1"
},
{
id: "f0wKDZRqqfa",
numerator: "#{CsYfybuaSgc.o9Oj5Cjekej}+#{CsYfybuaSgc.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "Uf2ky9gdRNx",
numerator: "#{CsYfybuaSgc.iaPGviZZIky}+#{CsYfybuaSgc.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "nRjPNPR7zqD",
numerator: "#{f6Q9p6uSWtS.awkJLkKHr7a}+#{f6Q9p6uSWtS.MQKsgFxCtJ7}+#{f6Q9p6uSWtS.dtdut9EncYH}+#{f6Q9p6uSWtS.R33m4bJ5OcC}+#{f6Q9p6uSWtS.e0RdqwlP1Xj}+#{f6Q9p6uSWtS.iaPGviZZIky}+#{f6Q9p6uSWtS.oliDewHdUdd}+#{f6Q9p6uSWtS.uuidY4WdJml}",
denominator: "1"
},
{
id: "m3Wu5YQNKjX",
numerator: "#{MOYDHlGVOZi.uuidY4WdJml}+#{MOYDHlGVOZi.oliDewHdUdd}+#{MOYDHlGVOZi.awkJLkKHr7a}+#{MOYDHlGVOZi.MQKsgFxCtJ7}+#{MOYDHlGVOZi.dtdut9EncYH}+#{MOYDHlGVOZi.R33m4bJ5OcC}+#{MOYDHlGVOZi.e0RdqwlP1Xj}+#{MOYDHlGVOZi.iaPGviZZIky}+#{MOYDHlGVOZi.o9Oj5Cjekej}+#{MOYDHlGVOZi.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "Ifs4TueT4JO",
numerator: "#{MOYDHlGVOZi.oliDewHdUdd}+#{MOYDHlGVOZi.uuidY4WdJml}",
denominator: "1"
},
{
id: "icng8nDy8Vy",
numerator: "#{MOYDHlGVOZi.R33m4bJ5OcC}+#{MOYDHlGVOZi.dtdut9EncYH}",
denominator: "1"
},
{
id: "T5V4Bg2Wsjv",
numerator: " #{MOYDHlGVOZi.MQKsgFxCtJ7}+#{MOYDHlGVOZi.awkJLkKHr7a}",
denominator: "1"
},
{
id: "wpeHCqOzf5B",
numerator: "#{MOYDHlGVOZi.o9Oj5Cjekej}+#{MOYDHlGVOZi.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "QMv1a425odu",
numerator: "#{MOYDHlGVOZi.iaPGviZZIky}+#{MOYDHlGVOZi.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "LBL1ESIW3Qm",
numerator: "#{zfhmMA4HeJn.awkJLkKHr7a}+#{zfhmMA4HeJn.MQKsgFxCtJ7}+#{zfhmMA4HeJn.dtdut9EncYH}+#{zfhmMA4HeJn.R33m4bJ5OcC}+#{zfhmMA4HeJn.e0RdqwlP1Xj}+#{zfhmMA4HeJn.iaPGviZZIky}+#{zfhmMA4HeJn.oliDewHdUdd}+#{zfhmMA4HeJn.uuidY4WdJml}+#{zfhmMA4HeJn.o9Oj5Cjekej}+#{zfhmMA4HeJn.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "xv0eH3m4gOQ",
numerator: "#{zfhmMA4HeJn.oliDewHdUdd}+#{zfhmMA4HeJn.uuidY4WdJml}",
denominator: "1"
},
{
id: "iuNJBxXjkRM",
numerator: "#{zfhmMA4HeJn.R33m4bJ5OcC}+#{zfhmMA4HeJn.dtdut9EncYH}",
denominator: "1"
},
{
id: "W1PyZhIOAF6",
numerator: "#{zfhmMA4HeJn.MQKsgFxCtJ7}+#{zfhmMA4HeJn.awkJLkKHr7a}",
denominator: "1"
},
{
id: "hS9BRAHPHcP",
numerator: "#{zfhmMA4HeJn.o9Oj5Cjekej}+#{zfhmMA4HeJn.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "lIqXsddBJ8Q",
numerator: "#{zfhmMA4HeJn.iaPGviZZIky}+#{zfhmMA4HeJn.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "MPhs1v8h2Uj",
numerator: " #{HMEUM6T2dxF.oliDewHdUdd}+#{HMEUM6T2dxF.uuidY4WdJml}",
denominator: "1"
},
{
id: "SNCjSV0v1yv",
numerator: "#{HMEUM6T2dxF.R33m4bJ5OcC}+#{HMEUM6T2dxF.dtdut9EncYH}",
denominator: "1"
},
{
id: "A9SgovW4tLV",
numerator: "#{HMEUM6T2dxF.MQKsgFxCtJ7}+#{HMEUM6T2dxF.awkJLkKHr7a}",
denominator: "1"
},
{
id: "JE0kldIgrcg",
numerator: "#{HMEUM6T2dxF.o9Oj5Cjekej}+#{HMEUM6T2dxF.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "TuWNDWNQTGT",
numerator: "#{HMEUM6T2dxF.iaPGviZZIky}+#{HMEUM6T2dxF.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "yLEJuicSTgD",
numerator: "#{SgeSIiqTN2l.oliDewHdUdd}+#{SgeSIiqTN2l.uuidY4WdJml}",
denominator: "1"
},
{
id: "teO29yaV9QZ",
numerator: "#{SgeSIiqTN2l.R33m4bJ5OcC}+#{SgeSIiqTN2l.dtdut9EncYH}",
denominator: "1"
},
{
id: "jbeqq7Iu4hE",
numerator: "#{SgeSIiqTN2l.MQKsgFxCtJ7}+#{SgeSIiqTN2l.awkJLkKHr7a}",
denominator: "1"
},
{
id: "F3GFGve1Bht",
numerator: " #{SgeSIiqTN2l.o9Oj5Cjekej}+#{SgeSIiqTN2l.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "mwaxQ2xL1YO",
numerator: "#{SgeSIiqTN2l.iaPGviZZIky}+#{SgeSIiqTN2l.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "IbBes0uyGf4",
numerator: "#{C2Rg2uPfbhs.oliDewHdUdd}+#{C2Rg2uPfbhs.uuidY4WdJml}",
denominator: "1"
},
{
id: "WPvTiAyb5E9",
numerator: "#{C2Rg2uPfbhs.R33m4bJ5OcC}+#{C2Rg2uPfbhs.dtdut9EncYH}",
denominator: "1"
},
{
id: "AuH7l3Unft1",
numerator: "#{C2Rg2uPfbhs.MQKsgFxCtJ7}+#{C2Rg2uPfbhs.awkJLkKHr7a}",
denominator: "1"
},
{
id: "ZjSlj1qLrjw",
numerator: "#{C2Rg2uPfbhs.o9Oj5Cjekej}+#{C2Rg2uPfbhs.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "Bn4LB3eR8Ps",
numerator: "#{C2Rg2uPfbhs.iaPGviZZIky}+#{C2Rg2uPfbhs.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "N15t5wSetjr",
numerator: "#{v6sdLtxvY1K.oliDewHdUdd}+#{v6sdLtxvY1K.uuidY4WdJml}",
denominator: "1"
},
{
id: "yv0XtdFnRfg",
numerator: "#{v6sdLtxvY1K.R33m4bJ5OcC}+#{v6sdLtxvY1K.dtdut9EncYH}",
denominator: "1"
},
{
id: "QALJoNqhK3j",
numerator: "#{v6sdLtxvY1K.MQKsgFxCtJ7}+#{v6sdLtxvY1K.awkJLkKHr7a}",
denominator: "1"
},
{
id: "sfwKgHQ6cvf",
numerator: "#{SgeSIiqTN2l.o9Oj5Cjekej}+#{SgeSIiqTN2l.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "UZbBDKKgRo7",
numerator: "#{v6sdLtxvY1K.iaPGviZZIky}+#{v6sdLtxvY1K.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "RnxeV34kFZ7",
numerator: "#{d8FSoimbeKH.R33m4bJ5OcC}+#{d8FSoimbeKH.dtdut9EncYH}",
denominator: "1"
},
{
id: "GBJVHVbRZT6",
numerator: "#{d8FSoimbeKH.MQKsgFxCtJ7}+#{d8FSoimbeKH.awkJLkKHr7a}",
denominator: "1"
},
{
id: "iNUhQZPqY1w",
numerator: "#{d8FSoimbeKH.o9Oj5Cjekej}+#{d8FSoimbeKH.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "KQAfpe31Wtd",
numerator: "#{n611GaZn5Xr.oliDewHdUdd}+#{n611GaZn5Xr.uuidY4WdJml}",
denominator: "1"
},
{
id: "H0SRcHl6cZr",
numerator: "#{n611GaZn5Xr.R33m4bJ5OcC}+#{n611GaZn5Xr.dtdut9EncYH}",
denominator: "1"
},
{
id: "nKadheqj7Yj",
numerator: "#{n611GaZn5Xr.iaPGviZZIky}+#{n611GaZn5Xr.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "a0U9ByBeUFd",
numerator: "#{f6Q9p6uSWtS.oliDewHdUdd}+#{f6Q9p6uSWtS.uuidY4WdJml}",
denominator: "1"
},
{
id: "KlenQNg96dB",
numerator: "#{f6Q9p6uSWtS.R33m4bJ5OcC}+#{f6Q9p6uSWtS.dtdut9EncYH}",
denominator: "1"
},
{
id: "Gt7xPMcv1pB",
numerator: "#{f6Q9p6uSWtS.iaPGviZZIky}+#{f6Q9p6uSWtS.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "eX17BgNVw4W",
numerator: "#{d8FSoimbeKH.awkJLkKHr7a}+#{d8FSoimbeKH.MQKsgFxCtJ7}+#{d8FSoimbeKH.dtdut9EncYH}+#{d8FSoimbeKH.R33m4bJ5OcC}+#{d8FSoimbeKH.e0RdqwlP1Xj}+#{d8FSoimbeKH.iaPGviZZIky}+#{d8FSoimbeKH.o9Oj5Cjekej}+#{d8FSoimbeKH.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "S3mNuNlQICn",
numerator: "#{MVwfJmuBh42.MQKsgFxCtJ7}+#{MVwfJmuBh42.awkJLkKHr7a}",
denominator: "1"
},
{
id: "SgrHpLg77F8",
numerator: "#{MVwfJmuBh42.o9Oj5Cjekej}+#{MVwfJmuBh42.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "rUusWYCF10F",
numerator: "#{x5cswY9qs7m.R33m4bJ5OcC}+#{x5cswY9qs7m.dtdut9EncYH}",
denominator: "1"
},
{
id: "uivn2QccZnn",
numerator: "#{x5cswY9qs7m.MQKsgFxCtJ7}+#{x5cswY9qs7m.awkJLkKHr7a}",
denominator: "1"
},
{
id: "WDhkxT0GwUS",
numerator: "#{x5cswY9qs7m.o9Oj5Cjekej}+ #{x5cswY9qs7m.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "IAxbs5OdJJn",
numerator: "#{x5cswY9qs7m.iaPGviZZIky}+#{x5cswY9qs7m.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "RqA7b0ILrWK",
numerator: " #{Wyorktq1rUA.oliDewHdUdd}+#{Wyorktq1rUA.uuidY4WdJml}",
denominator: "1"
},
{
id: "xh8e68fXo6K",
numerator: "#{anYwhLJV58B.R33m4bJ5OcC}+#{anYwhLJV58B.dtdut9EncYH}",
denominator: "1"
},
{
id: "PwM83lTvY1a",
numerator: "#{anYwhLJV58B.MQKsgFxCtJ7}+#{anYwhLJV58B.awkJLkKHr7a}",
denominator: "1"
},
{
id: "bq0kxh2vvcJ",
numerator: "#{anYwhLJV58B.o9Oj5Cjekej}+#{anYwhLJV58B.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "N1q3IZbMdiE",
numerator: " #{Wyorktq1rUA.iaPGviZZIky}+#{Wyorktq1rUA.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "f5S0fBk3Yux",
numerator: "#{fYO2JUHPdul.oliDewHdUdd}+#{fYO2JUHPdul.uuidY4WdJml}+#{fYO2JUHPdul.iaPGviZZIky}+#{fYO2JUHPdul.e0RdqwlP1Xj}+#{fYO2JUHPdul.R33m4bJ5OcC}+#{fYO2JUHPdul.dtdut9EncYH}+#{fYO2JUHPdul.MQKsgFxCtJ7}+#{fYO2JUHPdul.awkJLkKHr7a}+#{fYO2JUHPdul.o9Oj5Cjekej}+#{fYO2JUHPdul.ZU3sKDB9i2o}+#{fYO2JUHPdul.o9Oj5Cjekej}+#{fYO2JUHPdul.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "DbuVyv5rbP4",
numerator: "#{fYO2JUHPdul.oliDewHdUdd}+#{fYO2JUHPdul.uuidY4WdJml}",
denominator: "1"
},
{
id: "EbykDIw2iqN",
numerator: "#{fYO2JUHPdul.R33m4bJ5OcC}+#{fYO2JUHPdul.dtdut9EncYH}",
denominator: "1"
},
{
id: "bQW3L369EiY",
numerator: "#{fYO2JUHPdul.MQKsgFxCtJ7}+#{fYO2JUHPdul.awkJLkKHr7a}",
denominator: "1"
},
{
id: "GGDMOLNM15k",
numerator: "#{fYO2JUHPdul.o9Oj5Cjekej}+#{fYO2JUHPdul.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "obSSzUtHzs1",
numerator: "#{fYO2JUHPdul.iaPGviZZIky}+#{fYO2JUHPdul.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "eH8dtAzKPB2",
numerator: "#{anYwhLJV58B.oliDewHdUdd}+#{anYwhLJV58B.uuidY4WdJml}",
denominator: "1"
},
{
id: "fGAu7O4wKZv",
numerator: "#{anYwhLJV58B.R33m4bJ5OcC}+#{anYwhLJV58B.dtdut9EncYH}",
denominator: "1"
},
{
id: "bX2lh3g6HbR",
numerator: "#{anYwhLJV58B.MQKsgFxCtJ7}+#{anYwhLJV58B.awkJLkKHr7a}",
denominator: "1"
},
{
id: "sexJlTvFyW9",
numerator: "#{anYwhLJV58B.o9Oj5Cjekej}+#{anYwhLJV58B.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "HYaHQpqEoQm",
numerator: "#{anYwhLJV58B.iaPGviZZIky}+#{anYwhLJV58B.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "ydPYpd7kNQG",
numerator: "#{uqno4prZX61.oliDewHdUdd}+#{uqno4prZX61.uuidY4WdJml}+#{uqno4prZX61.iaPGviZZIky}+#{uqno4prZX61.e0RdqwlP1Xj}+#{uqno4prZX61.R33m4bJ5OcC}+#{uqno4prZX61.dtdut9EncYH}+#{uqno4prZX61.MQKsgFxCtJ7}+#{uqno4prZX61.awkJLkKHr7a}+#{Wyorktq1rUA.o9Oj5Cjekej}+#{Wyorktq1rUA.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "awsJQpv9w9p",
numerator: "#{o0KObJuu9Yu.oliDewHdUdd}+#{o0KObJuu9Yu.uuidY4WdJml}",
denominator: "1"
},
{
id: "mmAcwqHPgKI",
numerator: "#{o0KObJuu9Yu.R33m4bJ5OcC}+#{o0KObJuu9Yu.dtdut9EncYH}",
denominator: "1"
},
{
id: "AIVsWyRYQz5",
numerator: "#{o0KObJuu9Yu.MQKsgFxCtJ7}+#{o0KObJuu9Yu.awkJLkKHr7a}",
denominator: "1"
},
{
id: "aI75w49azlp",
numerator: "#{o0KObJuu9Yu.o9Oj5Cjekej}+#{o0KObJuu9Yu.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "VQsS3zkLwmV",
numerator: "#{o0KObJuu9Yu.iaPGviZZIky}+#{o0KObJuu9Yu.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "iBoA0RDYMKE",
numerator: "#{Rlr4Y8hOejL.awkJLkKHr7a}+#{Rlr4Y8hOejL.MQKsgFxCtJ7}+#{Rlr4Y8hOejL.dtdut9EncYH}+#{Rlr4Y8hOejL.R33m4bJ5OcC}+#{Rlr4Y8hOejL.e0RdqwlP1Xj}+#{Rlr4Y8hOejL.iaPGviZZIky}+#{Rlr4Y8hOejL.oliDewHdUdd}+#{Rlr4Y8hOejL.uuidY4WdJml}+#{Rlr4Y8hOejL.o9Oj5Cjekej}+#{Rlr4Y8hOejL.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "gCGmukhShia",
numerator: "#{Rlr4Y8hOejL.oliDewHdUdd}+#{Rlr4Y8hOejL.uuidY4WdJml}",
denominator: "1"
},
{
id: "nfTXP9rTBcS",
numerator: "#{Rlr4Y8hOejL.R33m4bJ5OcC}+#{Rlr4Y8hOejL.dtdut9EncYH}",
denominator: "1"
},
{
id: "bI926bZUHwV",
numerator: "#{Rlr4Y8hOejL.MQKsgFxCtJ7}+#{Rlr4Y8hOejL.awkJLkKHr7a}",
denominator: "1"
},
{
id: "A9ZadRiZhzE",
numerator: "#{Rlr4Y8hOejL.o9Oj5Cjekej}+#{Rlr4Y8hOejL.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "gNnaMkpxNkh",
numerator: "#{Rlr4Y8hOejL.iaPGviZZIky}+#{Rlr4Y8hOejL.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "R6avbaN6qQb",
numerator: "#{kzj3RYX536Y.R33m4bJ5OcC}+#{kzj3RYX536Y.dtdut9EncYH}",
denominator: "1"
},
{
id: "mj4OzHbfAGk",
numerator: "#{kzj3RYX536Y.MQKsgFxCtJ7}+#{kzj3RYX536Y.awkJLkKHr7a}",
denominator: "1"
},
{
id: "IyRXWCz8rwG",
numerator: "#{kzj3RYX536Y.o9Oj5Cjekej}+#{kzj3RYX536Y.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "QqzCvpYGRzy",
numerator: "#{wEPDo9ZpwLq.R33m4bJ5OcC}+#{wEPDo9ZpwLq.dtdut9EncYH}",
denominator: "1"
},
{
id: "WQAVj5d2pP4",
numerator: "#{wEPDo9ZpwLq.MQKsgFxCtJ7}+#{wEPDo9ZpwLq.awkJLkKHr7a}",
denominator: "1"
},
{
id: "oMWiwP4QNsu",
numerator: "#{wEPDo9ZpwLq.o9Oj5Cjekej}+#{wEPDo9ZpwLq.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "etOo3EgWcT6",
numerator: "#{wEPDo9ZpwLq.iaPGviZZIky}+#{wEPDo9ZpwLq.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "rJqXJidMyW7",
numerator: "#{ZAyi6JITD9w.awkJLkKHr7a}+#{ZAyi6JITD9w.MQKsgFxCtJ7}+#{ZAyi6JITD9w.dtdut9EncYH}+#{ZAyi6JITD9w.R33m4bJ5OcC}+#{ZAyi6JITD9w.e0RdqwlP1Xj}+#{ZAyi6JITD9w.iaPGviZZIky}+#{ZAyi6JITD9w.oliDewHdUdd}+#{ZAyi6JITD9w.uuidY4WdJml}+#{ZAyi6JITD9w.o9Oj5Cjekej}+#{ZAyi6JITD9w.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "hrRvDNjt16x",
numerator: "#{ZAyi6JITD9w.oliDewHdUdd}+#{ZAyi6JITD9w.uuidY4WdJml}",
denominator: "1"
},
{
id: "BhvHEvXDNqA",
numerator: "#{ZAyi6JITD9w.R33m4bJ5OcC}+#{ZAyi6JITD9w.dtdut9EncYH}",
denominator: "1"
},
{
id: "Qtw9CdraPvQ",
numerator: "#{ZAyi6JITD9w.MQKsgFxCtJ7}+#{ZAyi6JITD9w.awkJLkKHr7a}",
denominator: "1"
},
{
id: "L1WrFUvyEmq",
numerator: "#{ZAyi6JITD9w.o9Oj5Cjekej}+#{ZAyi6JITD9w.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "qOoIVVr8xOu",
numerator: "#{ZAyi6JITD9w.iaPGviZZIky}+#{ZAyi6JITD9w.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "IHGXjMjakwX",
numerator: "#{ItK93OX9wyu.oliDewHdUdd}+#{ItK93OX9wyu.uuidY4WdJml}",
denominator: "1"
},
{
id: "UJtyqjRjgcb",
numerator: "#{ItK93OX9wyu.R33m4bJ5OcC}+#{ItK93OX9wyu.dtdut9EncYH}",
denominator: "1"
},
{
id: "tHVcSItXRvb",
numerator: "#{ItK93OX9wyu.MQKsgFxCtJ7}+#{ItK93OX9wyu.awkJLkKHr7a}",
denominator: "1"
},
{
id: "Usr0SrJpNIa",
numerator: "#{ItK93OX9wyu.o9Oj5Cjekej}+#{ItK93OX9wyu.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "uMIZ85S2A1g",
numerator: "#{ItK93OX9wyu.iaPGviZZIky}+#{ItK93OX9wyu.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "Zwz7fAmpS9P",
numerator: "#{eoZtkUbfrmF.R33m4bJ5OcC}+#{eoZtkUbfrmF.dtdut9EncYH}",
denominator: "1"
},
{
id: "kTqh0Hq4tDa",
numerator: "#{eoZtkUbfrmF.MQKsgFxCtJ7}+#{eoZtkUbfrmF.awkJLkKHr7a}",
denominator: "1"
},
{
id: "ZTn4QytfHyI",
numerator: "#{eoZtkUbfrmF.o9Oj5Cjekej}+#{eoZtkUbfrmF.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "PT8gSSdE4cU",
numerator: "#{eoZtkUbfrmF.iaPGviZZIky}+#{eoZtkUbfrmF.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "tz3hHSQ13lN",
numerator: "#{Yut5amdi7iw.awkJLkKHr7a}+#{Yut5amdi7iw.MQKsgFxCtJ7}+#{Yut5amdi7iw.dtdut9EncYH}+#{Yut5amdi7iw.R33m4bJ5OcC}+#{Yut5amdi7iw.e0RdqwlP1Xj}+#{Yut5amdi7iw.iaPGviZZIky}+#{Yut5amdi7iw.oliDewHdUdd}+#{Yut5amdi7iw.uuidY4WdJml} + #{Yut5amdi7iw.o9Oj5Cjekej} + #{Yut5amdi7iw.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "G1MvAH5BmVW",
numerator: "#{FkKfVoslpKi.iaPGviZZIky}+#{FkKfVoslpKi.e0RdqwlP1Xj}+#{FkKfVoslpKi.R33m4bJ5OcC}+#{FkKfVoslpKi.dtdut9EncYH}+#{FkKfVoslpKi.MQKsgFxCtJ7}+#{FkKfVoslpKi.awkJLkKHr7a}+#{FkKfVoslpKi.o9Oj5Cjekej}+#{FkKfVoslpKi.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "X2jPek2z5DR",
numerator: "#{FkKfVoslpKi.R33m4bJ5OcC}+#{FkKfVoslpKi.dtdut9EncYH}",
denominator: "1"
},
{
id: "bV3q1mwX0Y2",
numerator: "#{FkKfVoslpKi.MQKsgFxCtJ7}+#{FkKfVoslpKi.awkJLkKHr7a}",
denominator: "1"
},
{
id: "c6nKWwkJ6QF",
numerator: "#{FkKfVoslpKi.o9Oj5Cjekej}+#{FkKfVoslpKi.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "stPJ8zH6jTA",
numerator: "#{FkKfVoslpKi.iaPGviZZIky}+#{FkKfVoslpKi.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "PaPUKuzsFmI",
numerator: "#{l1GL5Tmn22E.MQKsgFxCtJ7}+#{l1GL5Tmn22E.awkJLkKHr7a}",
denominator: "1"
},
{
id: "VwQcomD2oua",
numerator: "#{l1GL5Tmn22E.o9Oj5Cjekej}+#{l1GL5Tmn22E.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "UsXqXCqLrZH",
numerator: "#{lJry1lLp3dJ.awkJLkKHr7a}+#{lJry1lLp3dJ.MQKsgFxCtJ7}+#{lJry1lLp3dJ.dtdut9EncYH}+#{lJry1lLp3dJ.R33m4bJ5OcC}+#{lJry1lLp3dJ.e0RdqwlP1Xj}+#{lJry1lLp3dJ.iaPGviZZIky}+#{lJry1lLp3dJ.oliDewHdUdd}+#{lJry1lLp3dJ.uuidY4WdJml}+#{lJry1lLp3dJ.o9Oj5Cjekej}+#{lJry1lLp3dJ.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "v4oGUVM3kBH",
numerator: "#{lJry1lLp3dJ.oliDewHdUdd}+#{lJry1lLp3dJ.uuidY4WdJml}",
denominator: "1"
},
{
id: "rnVliIfDgTI",
numerator: "#{lJry1lLp3dJ.R33m4bJ5OcC}+#{lJry1lLp3dJ.dtdut9EncYH}",
denominator: "1"
},
{
id: "U4C8k3cS7xg",
numerator: "#{lJry1lLp3dJ.MQKsgFxCtJ7}+#{lJry1lLp3dJ.awkJLkKHr7a}",
denominator: "1"
},
{
id: "YOePHuJp1gz",
numerator: "#{lJry1lLp3dJ.o9Oj5Cjekej}+#{lJry1lLp3dJ.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "xN99ScILo1t",
numerator: "#{lJry1lLp3dJ.iaPGviZZIky}+#{lJry1lLp3dJ.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "UVG7piM0kzL",
numerator: "#{Y7upeLGM36C.oliDewHdUdd}+#{Y7upeLGM36C.uuidY4WdJml}",
denominator: "1"
},
{
id: "KiDiQdzR9N1",
numerator: "#{tfDgtMmh9TU.R33m4bJ5OcC}+#{tfDgtMmh9TU.dtdut9EncYH}",
denominator: "1"
},
{
id: "oyGcH83r4ve",
numerator: "#{tfDgtMmh9TU.MQKsgFxCtJ7}+#{tfDgtMmh9TU.awkJLkKHr7a}",
denominator: "1"
},
{
id: "NrT1cB1LXpM",
numerator: "#{tfDgtMmh9TU.o9Oj5Cjekej}+#{tfDgtMmh9TU.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "Z7Ris4QR9YQ",
numerator: "#{tfDgtMmh9TU.iaPGviZZIky}+#{tfDgtMmh9TU.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "NbJ30l4GBBM",
numerator: "#{SjNEefHqcz4.oliDewHdUdd}+#{SjNEefHqcz4.uuidY4WdJml}",
denominator: "1"
},
{
id: "fL6STuIi7Uh",
numerator: "#{SjNEefHqcz4.R33m4bJ5OcC}+#{SjNEefHqcz4.dtdut9EncYH}",
denominator: "1"
},
{
id: "fgbB5dgdmOw",
numerator: "#{SjNEefHqcz4.MQKsgFxCtJ7}+#{SjNEefHqcz4.awkJLkKHr7a}",
denominator: "1"
},
{
id: "Zsc1J42Av1r",
numerator: "#{SjNEefHqcz4.o9Oj5Cjekej}+#{SjNEefHqcz4.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "DLXhLLognPT",
numerator: "#{SjNEefHqcz4.iaPGviZZIky}+#{SjNEefHqcz4.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "Xd8edDnS2C4",
numerator: "#{H2R0UdSYRPn.oliDewHdUdd}+#{H2R0UdSYRPn.uuidY4WdJml}",
denominator: "1"
},
{
id: "eHQVYvr6K6H",
numerator: "#{H2R0UdSYRPn.R33m4bJ5OcC}+#{H2R0UdSYRPn.dtdut9EncYH}",
denominator: "1"
},
{
id: "vjDvigPLRDI",
numerator: "#{H2R0UdSYRPn.MQKsgFxCtJ7}+#{H2R0UdSYRPn.awkJLkKHr7a}",
denominator: "1"
},
{
id: "l7nysIMSsDZ",
numerator: "#{H2R0UdSYRPn.o9Oj5Cjekej}+#{H2R0UdSYRPn.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "qob0JuYJ3Xh",
numerator: "#{H2R0UdSYRPn.iaPGviZZIky}+#{H2R0UdSYRPn.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "mPnyCekyueO",
numerator: "#{RlEchOC92Yr.awkJLkKHr7a}+#{RlEchOC92Yr.MQKsgFxCtJ7}+#{RlEchOC92Yr.dtdut9EncYH}+#{RlEchOC92Yr.R33m4bJ5OcC}+#{RlEchOC92Yr.e0RdqwlP1Xj}+#{RlEchOC92Yr.iaPGviZZIky}+#{RlEchOC92Yr.o9Oj5Cjekej}+#{RlEchOC92Yr.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "oC11eDc73XD",
numerator: "#{RlEchOC92Yr.o9Oj5Cjekej}+#{RlEchOC92Yr.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "B21navphvBa",
numerator: "#{RlEchOC92Yr.R33m4bJ5OcC}+#{RlEchOC92Yr.dtdut9EncYH}",
denominator: "1"
},
{
id: "uDrIhKcpqXS",
numerator: "#{RlEchOC92Yr.MQKsgFxCtJ7}+#{RlEchOC92Yr.awkJLkKHr7a}",
denominator: "1"
},
{
id: "dAZ7IjArFhl",
numerator: "#{RlEchOC92Yr.iaPGviZZIky}+#{RlEchOC92Yr.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "a6IYpEcfpDW",
numerator: "#{SAD8J9zO6MF.awkJLkKHr7a}+#{SAD8J9zO6MF.MQKsgFxCtJ7}+#{SAD8J9zO6MF.dtdut9EncYH}+#{SAD8J9zO6MF.R33m4bJ5OcC}+#{SAD8J9zO6MF.e0RdqwlP1Xj}+#{SAD8J9zO6MF.iaPGviZZIky}+#{SAD8J9zO6MF.oliDewHdUdd}+#{SAD8J9zO6MF.uuidY4WdJml}+#{SAD8J9zO6MF.o9Oj5Cjekej}+#{SAD8J9zO6MF.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "oxQRPHm7rV6",
numerator: "#{SAD8J9zO6MF.oliDewHdUdd}+#{SAD8J9zO6MF.uuidY4WdJml}",
denominator: "1"
},
{
id: "lRZTYi8K0PJ",
numerator: "#{SAD8J9zO6MF.R33m4bJ5OcC}+#{SAD8J9zO6MF.dtdut9EncYH}",
denominator: "1"
},
{
id: "WRMc9RuANgQ",
numerator: "#{SAD8J9zO6MF.MQKsgFxCtJ7}+#{SAD8J9zO6MF.awkJLkKHr7a}",
denominator: "1"
},
{
id: "BbjwuRN3lNO",
numerator: "#{SAD8J9zO6MF.o9Oj5Cjekej}+#{SAD8J9zO6MF.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "BF7MNTsezge",
numerator: "#{SAD8J9zO6MF.iaPGviZZIky}+#{SAD8J9zO6MF.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "bSJ2F8DWL0x",
numerator: "#{qMHYsWwYgo6.R33m4bJ5OcC}+#{qMHYsWwYgo6.dtdut9EncYH}",
denominator: "1"
},
{
id: "FRLXdWAXn8x",
numerator: "#{qMHYsWwYgo6.MQKsgFxCtJ7}+#{qMHYsWwYgo6.awkJLkKHr7a}",
denominator: "1"
},
{
id: "HyvmgDuxv2A",
numerator: "#{qMHYsWwYgo6.o9Oj5Cjekej}+#{qMHYsWwYgo6.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "wM0Lz10TaMU",
numerator: "#{qMHYsWwYgo6.iaPGviZZIky}+#{qMHYsWwYgo6.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "aGgPnHPXJPe",
numerator: "#{bC64bIily9n.oliDewHdUdd}+#{bC64bIily9n.uuidY4WdJml}",
denominator: "1"
},
{
id: "fzT1gaK7xgO",
numerator: "#{bC64bIily9n.R33m4bJ5OcC}+#{bC64bIily9n.dtdut9EncYH}",
denominator: "1"
},
{
id: "YAHoiP1QnkT",
numerator: "#{bC64bIily9n.MQKsgFxCtJ7}+#{bC64bIily9n.awkJLkKHr7a}",
denominator: "1"
},
{
id: "hvkhqHz1Obz",
numerator: "#{bC64bIily9n.o9Oj5Cjekej}+#{bC64bIily9n.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "GJrAf9IvqJE",
numerator: "#{bC64bIily9n.iaPGviZZIky}+#{bC64bIily9n.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "dXDgCfFVAhB",
numerator: "#{X0TXADJv7GA.awkJLkKHr7a}+#{X0TXADJv7GA.MQKsgFxCtJ7}+#{X0TXADJv7GA.dtdut9EncYH}+#{X0TXADJv7GA.R33m4bJ5OcC}+#{X0TXADJv7GA.e0RdqwlP1Xj}+#{X0TXADJv7GA.iaPGviZZIky}+#{X0TXADJv7GA.oliDewHdUdd}+#{X0TXADJv7GA.uuidY4WdJml}+#{X0TXADJv7GA.o9Oj5Cjekej}+#{X0TXADJv7GA.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "G04kT9xwjHS",
numerator: "#{CNzWVlVeOdx.iaPGviZZIky}+#{CNzWVlVeOdx.e0RdqwlP1Xj}+#{CNzWVlVeOdx.R33m4bJ5OcC}+#{CNzWVlVeOdx.dtdut9EncYH}+#{CNzWVlVeOdx.MQKsgFxCtJ7}+#{CNzWVlVeOdx.awkJLkKHr7a}+#{CNzWVlVeOdx.o9Oj5Cjekej}+#{CNzWVlVeOdx.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "FJqjCzqzeXz",
numerator: "#{CNzWVlVeOdx.R33m4bJ5OcC}+#{CNzWVlVeOdx.dtdut9EncYH}",
denominator: "1"
},
{
id: "vBcowO3WIeN",
numerator: "#{CNzWVlVeOdx.MQKsgFxCtJ7}+#{CNzWVlVeOdx.awkJLkKHr7a}",
denominator: "1"
},
{
id: "N9PgEX1B3Sj",
numerator: "#{CNzWVlVeOdx.o9Oj5Cjekej}+#{CNzWVlVeOdx.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "ny2jyF0zCJl",
numerator: "#{CNzWVlVeOdx.iaPGviZZIky}+#{CNzWVlVeOdx.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "KZZSDSh8s9h",
numerator: "#{s1GFhwCZaWq.uuidY4WdJml}+#{s1GFhwCZaWq.oliDewHdUdd}",
denominator: "1"
},
{
id: "ydyHZI43ClU",
numerator: "#{s1GFhwCZaWq.oliDewHdUdd}+#{s1GFhwCZaWq.uuidY4WdJml}",
denominator: "1"
},
{
id: "kQLb6GNfl1u",
numerator: "#{EEeh0pyQISB.awkJLkKHr7a}+#{EEeh0pyQISB.MQKsgFxCtJ7}+#{EEeh0pyQISB.dtdut9EncYH}+#{EEeh0pyQISB.R33m4bJ5OcC}+#{EEeh0pyQISB.e0RdqwlP1Xj}+#{EEeh0pyQISB.iaPGviZZIky}+#{EEeh0pyQISB.oliDewHdUdd}+#{EEeh0pyQISB.uuidY4WdJml}+#{EEeh0pyQISB.o9Oj5Cjekej}+#{EEeh0pyQISB.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "jzmAgrYu6lj",
numerator: "#{EEeh0pyQISB.oliDewHdUdd}+#{EEeh0pyQISB.uuidY4WdJml}",
denominator: "1"
},
{
id: "mBj8G5eGOF7",
numerator: "#{EEeh0pyQISB.R33m4bJ5OcC}+#{EEeh0pyQISB.dtdut9EncYH}",
denominator: "1"
},
{
id: "ppJsOQEcgti",
numerator: "#{EEeh0pyQISB.MQKsgFxCtJ7}+#{EEeh0pyQISB.awkJLkKHr7a}",
denominator: "1"
},
{
id: "YzKXPHaKH4D",
numerator: "#{EEeh0pyQISB.o9Oj5Cjekej}+#{EEeh0pyQISB.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "LoocbLIoTlF",
numerator: "#{EEeh0pyQISB.iaPGviZZIky}+#{EEeh0pyQISB.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "lyDFZ026SAJ",
numerator: "#{PxPfeeZz5eI.oliDewHdUdd}+#{PxPfeeZz5eI.uuidY4WdJml}+#{PxPfeeZz5eI.iaPGviZZIky}+#{PxPfeeZz5eI.e0RdqwlP1Xj}+#{PxPfeeZz5eI.R33m4bJ5OcC}+#{PxPfeeZz5eI.dtdut9EncYH}+#{PxPfeeZz5eI.MQKsgFxCtJ7}+#{PxPfeeZz5eI.awkJLkKHr7a}+#{PxPfeeZz5eI.o9Oj5Cjekej}+#{PxPfeeZz5eI.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "oapYMwiHy2n",
numerator: "#{PxPfeeZz5eI.oliDewHdUdd}+#{PxPfeeZz5eI.uuidY4WdJml}",
denominator: "1"
},
{
id: "TCKYUiM3qRd",
numerator: "#{PxPfeeZz5eI.R33m4bJ5OcC}+#{PxPfeeZz5eI.dtdut9EncYH}",
denominator: "1"
},
{
id: "zE0DcYrMT9R",
numerator: "#{PxPfeeZz5eI.MQKsgFxCtJ7}+#{PxPfeeZz5eI.awkJLkKHr7a}",
denominator: "1"
},
{
id: "pnq7YoVtHOF",
numerator: "#{PxPfeeZz5eI.o9Oj5Cjekej}+#{PxPfeeZz5eI.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "fqWJaIj3jn5",
numerator: "#{PxPfeeZz5eI.iaPGviZZIky}+#{PxPfeeZz5eI.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "dQfYfcwpTS0",
numerator: "#{eTOV59Rcv4F.MQKsgFxCtJ7}+#{eTOV59Rcv4F.awkJLkKHr7a}",
denominator: "1"
},
{
id: "udhgGLpLqk0",
numerator: "#{eTOV59Rcv4F.o9Oj5Cjekej}+#{eTOV59Rcv4F.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "SP0mWEq8eSn",
numerator: "#{UlFUBEpJsSs.awkJLkKHr7a}+#{UlFUBEpJsSs.MQKsgFxCtJ7}+#{UlFUBEpJsSs.dtdut9EncYH}+#{UlFUBEpJsSs.R33m4bJ5OcC}+#{UlFUBEpJsSs.e0RdqwlP1Xj}+#{UlFUBEpJsSs.iaPGviZZIky}+#{UlFUBEpJsSs.oliDewHdUdd}+#{UlFUBEpJsSs.uuidY4WdJml}+#{UlFUBEpJsSs.o9Oj5Cjekej}+#{UlFUBEpJsSs.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "tjvIqrVNsMU",
numerator: "#{Lcj8osNjKQx.oliDewHdUdd}+#{Lcj8osNjKQx.uuidY4WdJml}",
denominator: "1"
},
{
id: "Yubj2P0qRAT",
numerator: "#{Lcj8osNjKQx.R33m4bJ5OcC}+#{Lcj8osNjKQx.dtdut9EncYH}",
denominator: "1"
},
{
id: "NrwZIPFwFpi",
numerator: "#{Lcj8osNjKQx.MQKsgFxCtJ7}+#{Lcj8osNjKQx.awkJLkKHr7a}",
denominator: "1"
},
{
id: "lBgJflNPBYk",
numerator: "#{Lcj8osNjKQx.o9Oj5Cjekej}+#{Lcj8osNjKQx.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "vFkBFTHmoSF",
numerator: "#{Lcj8osNjKQx.iaPGviZZIky}+#{Lcj8osNjKQx.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "q2MdzffKlDs",
numerator: "#{NwzMLHAFMSC.awkJLkKHr7a}+#{NwzMLHAFMSC.MQKsgFxCtJ7}+#{NwzMLHAFMSC.dtdut9EncYH}+#{NwzMLHAFMSC.R33m4bJ5OcC}+#{NwzMLHAFMSC.e0RdqwlP1Xj}+#{NwzMLHAFMSC.iaPGviZZIky}+#{NwzMLHAFMSC.oliDewHdUdd}+#{NwzMLHAFMSC.uuidY4WdJml}+#{NwzMLHAFMSC.o9Oj5Cjekej}+#{NwzMLHAFMSC.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "NbCS916nxB5",
numerator: "#{NwzMLHAFMSC.oliDewHdUdd}+#{NwzMLHAFMSC.uuidY4WdJml}",
denominator: "1"
},
{
id: "YNEIru6TtiN",
numerator: "#{NwzMLHAFMSC.R33m4bJ5OcC}+#{NwzMLHAFMSC.dtdut9EncYH}",
denominator: "1"
},
{
id: "lrOztOvmiJQ",
numerator: "#{NwzMLHAFMSC.MQKsgFxCtJ7}+#{NwzMLHAFMSC.awkJLkKHr7a}",
denominator: "1"
},
{
id: "yssyZcwGKO7",
numerator: "#{NwzMLHAFMSC.o9Oj5Cjekej}+#{NwzMLHAFMSC.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "n6YLFe5AS4s",
numerator: "#{NwzMLHAFMSC.iaPGviZZIky}+#{NwzMLHAFMSC.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "ECQzKMjTo2o",
numerator: "#{qwFz1atKnbC.awkJLkKHr7a}+#{qwFz1atKnbC.MQKsgFxCtJ7}+#{qwFz1atKnbC.dtdut9EncYH}+#{qwFz1atKnbC.R33m4bJ5OcC}+#{qwFz1atKnbC.e0RdqwlP1Xj}+#{qwFz1atKnbC.iaPGviZZIky}+#{qwFz1atKnbC.oliDewHdUdd}+#{qwFz1atKnbC.uuidY4WdJml}+#{qwFz1atKnbC.o9Oj5Cjekej}+#{qwFz1atKnbC.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "x9JbuUZ6CVA",
numerator: "#{NlXYR3IJWCl.R33m4bJ5OcC}+#{NlXYR3IJWCl.dtdut9EncYH}",
denominator: "1"
},
{
id: "hdQ6gIrfLSz",
numerator: "#{NlXYR3IJWCl.MQKsgFxCtJ7}+#{NlXYR3IJWCl.awkJLkKHr7a}",
denominator: "1"
},
{
id: "D9pb1cRHb98",
numerator: "#{NlXYR3IJWCl.o9Oj5Cjekej}+#{NlXYR3IJWCl.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "tXGNKrFzluj",
numerator: "#{NlXYR3IJWCl.iaPGviZZIky}+#{NlXYR3IJWCl.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "VI8XCDeTxDO",
numerator: "#{anYwhLJV58B.awkJLkKHr7a}+#{anYwhLJV58B.MQKsgFxCtJ7}+#{anYwhLJV58B.dtdut9EncYH}+#{anYwhLJV58B.R33m4bJ5OcC}+#{anYwhLJV58B.e0RdqwlP1Xj}+#{anYwhLJV58B.iaPGviZZIky}+#{anYwhLJV58B.oliDewHdUdd}+#{anYwhLJV58B.uuidY4WdJml}+#{anYwhLJV58B.o9Oj5Cjekej}+#{anYwhLJV58B.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "LDS2XSaYaIt",
numerator: "#{qoeOTJT0x6o.R33m4bJ5OcC}+#{qoeOTJT0x6o.dtdut9EncYH}",
denominator: "1"
},
{
id: "P3y0nE61a7o",
numerator: "#{qoeOTJT0x6o.o9Oj5Cjekej}+#{qoeOTJT0x6o.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "lhlN21nLdIQ",
numerator: "#{qoeOTJT0x6o.o9Oj5Cjekej}+#{qoeOTJT0x6o.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "cAAlljIPYud",
numerator: "#{qoeOTJT0x6o.iaPGviZZIky}+#{qoeOTJT0x6o.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "iPKYiioFA36",
numerator: "#{BwJsDwQayqN.R33m4bJ5OcC}+#{BwJsDwQayqN.dtdut9EncYH}",
denominator: "1"
},
{
id: "p5tZK7XqCui",
numerator: "#{BwJsDwQayqN.MQKsgFxCtJ7}+#{BwJsDwQayqN.awkJLkKHr7a}",
denominator: "1"
},
{
id: "rlRBXx9PNOx",
numerator: "#{BwJsDwQayqN.o9Oj5Cjekej}+#{BwJsDwQayqN.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "P6Qqy3THRpp",
numerator: "#{BwJsDwQayqN.iaPGviZZIky}+#{BwJsDwQayqN.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "hdMgHDlFLKL",
numerator: "#{sr87SW2uEmt.oliDewHdUdd}+#{sr87SW2uEmt.uuidY4WdJml}",
denominator: "1"
},
{
id: "o7AcPZKZb92",
numerator: "#{sr87SW2uEmt.R33m4bJ5OcC}+#{sr87SW2uEmt.dtdut9EncYH}",
denominator: "1"
},
{
id: "uETUVU2QbFT",
numerator: "#{sr87SW2uEmt.MQKsgFxCtJ7}+#{sr87SW2uEmt.awkJLkKHr7a}",
denominator: "1"
},
{
id: "cLyBsfUQHHb",
numerator: "#{sr87SW2uEmt.o9Oj5Cjekej}+#{sr87SW2uEmt.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "l0yBVCE3ruo",
numerator: "#{sr87SW2uEmt.iaPGviZZIky}+#{sr87SW2uEmt.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "ekDblA8aiCc",
numerator: "#{fLjZYZB3tuB.oliDewHdUdd}+#{fLjZYZB3tuB.uuidY4WdJml}",
denominator: "1"
},
{
id: "glamgIzCmuu",
numerator: "#{fLjZYZB3tuB.R33m4bJ5OcC}+#{fLjZYZB3tuB.dtdut9EncYH}",
denominator: "1"
},
{
id: "O6ur0GpoLjt",
numerator: "#{fLjZYZB3tuB.MQKsgFxCtJ7}+#{fLjZYZB3tuB.awkJLkKHr7a}",
denominator: "1"
},
{
id: "P8SGx5hfxPI",
numerator: "#{fLjZYZB3tuB.o9Oj5Cjekej}+#{fLjZYZB3tuB.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "cz7L614B3SF",
numerator: "#{fLjZYZB3tuB.iaPGviZZIky}+#{fLjZYZB3tuB.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "p2uteFjb5SC",
numerator: "#{ShxnDczlruP.oliDewHdUdd}+#{ShxnDczlruP.uuidY4WdJml}",
denominator: "1"
},
{
id: "UbuqtQyv0Hi",
numerator: "#{ShxnDczlruP.R33m4bJ5OcC}+#{ShxnDczlruP.dtdut9EncYH}",
denominator: "1"
},
{
id: "uanagb8uviV",
numerator: "#{ShxnDczlruP.MQKsgFxCtJ7}+#{ShxnDczlruP.awkJLkKHr7a}",
denominator: "1"
},
{
id: "L0bUlCpQJXW",
numerator: "#{ShxnDczlruP.o9Oj5Cjekej}+#{ShxnDczlruP.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "qvQ2IPV2iDf",
numerator: "#{ShxnDczlruP.iaPGviZZIky}+#{ShxnDczlruP.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "QsOOC9I6Jzy",
numerator: "#{LD4thW4OmXi.R33m4bJ5OcC}+#{LD4thW4OmXi.dtdut9EncYH}",
denominator: "1"
},
{
id: "MxrOh1CN71y",
numerator: "#{LD4thW4OmXi.MQKsgFxCtJ7}+#{LD4thW4OmXi.awkJLkKHr7a}",
denominator: "1"
},
{
id: "KeBZcCg4g3O",
numerator: "#{LD4thW4OmXi.o9Oj5Cjekej}+#{LD4thW4OmXi.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "nopRjVIVePV",
numerator: "#{Wa3cm09YbsP.oliDewHdUdd}+#{Wa3cm09YbsP.uuidY4WdJml}+#{Wa3cm09YbsP.iaPGviZZIky}+#{Wa3cm09YbsP.e0RdqwlP1Xj}+#{Wa3cm09YbsP.R33m4bJ5OcC}+#{Wa3cm09YbsP.dtdut9EncYH}+#{Wa3cm09YbsP.MQKsgFxCtJ7}+#{Wa3cm09YbsP.awkJLkKHr7a}+#{Wa3cm09YbsP.o9Oj5Cjekej}+#{Wa3cm09YbsP.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "NTFD0SJBvKP",
numerator: "#{ccIfQsrfWeL.R33m4bJ5OcC}+#{ccIfQsrfWeL.dtdut9EncYH}",
denominator: "1"
},
{
id: "pWduY0E7G6O",
numerator: "#{ccIfQsrfWeL.MQKsgFxCtJ7}+#{ccIfQsrfWeL.awkJLkKHr7a}",
denominator: "1"
},
{
id: "LbosjKiTKyA",
numerator: "#{ccIfQsrfWeL.o9Oj5Cjekej}+#{ccIfQsrfWeL.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "cgGpOb5wPdz",
numerator: "#{ccIfQsrfWeL.iaPGviZZIky}+#{ccIfQsrfWeL.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "srRrD3no6pL",
numerator: "#{ClHcTEiVMpb.oliDewHdUdd}+#{ClHcTEiVMpb.uuidY4WdJml}",
denominator: "1"
},
{
id: "lu6fgWkYXgo",
numerator: "#{ClHcTEiVMpb.R33m4bJ5OcC}+#{ClHcTEiVMpb.dtdut9EncYH}",
denominator: "1"
},
{
id: "YmvU6dHx5ZI",
numerator: "#{ClHcTEiVMpb.MQKsgFxCtJ7}+#{ClHcTEiVMpb.awkJLkKHr7a}",
denominator: "1"
},
{
id: "EdFBTJvtq47",
numerator: "#{ClHcTEiVMpb.o9Oj5Cjekej}+#{ClHcTEiVMpb.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "JOBpqpEERwr",
numerator: "#{ClHcTEiVMpb.iaPGviZZIky}+#{ClHcTEiVMpb.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "xOKUvMiu1kl",
numerator: "#{c4ZuqcOCyix.R33m4bJ5OcC}+#{c4ZuqcOCyix.dtdut9EncYH}",
denominator: "1"
},
{
id: "g6xPV5C36YA",
numerator: "#{c4ZuqcOCyix.MQKsgFxCtJ7}+#{c4ZuqcOCyix.awkJLkKHr7a}",
denominator: "1"
},
{
id: "dnHWKv4xqYL",
numerator: "#{c4ZuqcOCyix.o9Oj5Cjekej}+#{c4ZuqcOCyix.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "rXR3CX0BdA3",
numerator: "#{c4ZuqcOCyix.iaPGviZZIky}+#{c4ZuqcOCyix.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "W9A0ZIF80GG",
numerator: "#{Kpa6sheYah0.oliDewHdUdd}+#{Kpa6sheYah0.uuidY4WdJml}",
denominator: "1"
},
{
id: "gRDW3Yrna1r",
numerator: "#{Kpa6sheYah0.R33m4bJ5OcC}+#{Kpa6sheYah0.dtdut9EncYH}",
denominator: "1"
},
{
id: "gQstmzwSxON",
numerator: "#{Kpa6sheYah0.MQKsgFxCtJ7}+#{Kpa6sheYah0.awkJLkKHr7a}",
denominator: "1"
},
{
id: "xsXt9mh3kx4",
numerator: "#{Kpa6sheYah0.o9Oj5Cjekej}+#{Kpa6sheYah0.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "FU7jcEwMAjK",
numerator: "#{Kpa6sheYah0.iaPGviZZIky}+#{Kpa6sheYah0.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "TClEaHwGDgp",
numerator: "#{ctT1j57B2OL.R33m4bJ5OcC}+#{ctT1j57B2OL.dtdut9EncYH}",
denominator: "1"
},
{
id: "x1YcVwYS3o7",
numerator: "#{ctT1j57B2OL.MQKsgFxCtJ7}+#{ctT1j57B2OL.awkJLkKHr7a}",
denominator: "1"
},
{
id: "QwEroBaVJWW",
numerator: "#{ctT1j57B2OL.o9Oj5Cjekej}+#{ctT1j57B2OL.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "bWAo7bJB6eH",
numerator: "#{ctT1j57B2OL.iaPGviZZIky}+#{ctT1j57B2OL.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "cnE6ZEGXc7i",
numerator: "#{avzBnVwWlV9.awkJLkKHr7a}+#{avzBnVwWlV9.MQKsgFxCtJ7}+#{avzBnVwWlV9.dtdut9EncYH}+#{avzBnVwWlV9.R33m4bJ5OcC}+#{avzBnVwWlV9.e0RdqwlP1Xj}+#{avzBnVwWlV9.iaPGviZZIky}+#{avzBnVwWlV9.oliDewHdUdd}+#{avzBnVwWlV9.uuidY4WdJml}+#{avzBnVwWlV9.o9Oj5Cjekej}+#{avzBnVwWlV9.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "Ed97eTU9TSL",
numerator: "#{SjNEefHqcz4.awkJLkKHr7a}+#{SjNEefHqcz4.MQKsgFxCtJ7}+#{SjNEefHqcz4.dtdut9EncYH}+#{SjNEefHqcz4.R33m4bJ5OcC}+#{SjNEefHqcz4.e0RdqwlP1Xj}+#{SjNEefHqcz4.iaPGviZZIky}+#{SjNEefHqcz4.oliDewHdUdd}+#{SjNEefHqcz4.uuidY4WdJml}+#{SjNEefHqcz4.o9Oj5Cjekej}+#{SjNEefHqcz4.ZU3sKDB9i2o} +#{SjNEefHqcz4.o9Oj5Cjekej}+#{SjNEefHqcz4.ZU3sKDB9i2o} ",
denominator: "1"
},
{
id: "zLLVxK4Tz2J",
numerator: "#{H2R0UdSYRPn.awkJLkKHr7a}+#{H2R0UdSYRPn.MQKsgFxCtJ7}+#{H2R0UdSYRPn.dtdut9EncYH}+#{H2R0UdSYRPn.R33m4bJ5OcC}+#{H2R0UdSYRPn.e0RdqwlP1Xj}+#{H2R0UdSYRPn.iaPGviZZIky}+#{H2R0UdSYRPn.oliDewHdUdd}+#{H2R0UdSYRPn.uuidY4WdJml}+#{H2R0UdSYRPn.o9Oj5Cjekej}+#{H2R0UdSYRPn.ZU3sKDB9i2o} + #{H2R0UdSYRPn.o9Oj5Cjekej}+#{H2R0UdSYRPn.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "fmwJx85Bvnh",
numerator: "#{WXuqsXyNq4K.awkJLkKHr7a}+#{WXuqsXyNq4K.MQKsgFxCtJ7}+#{WXuqsXyNq4K.dtdut9EncYH}+#{WXuqsXyNq4K.R33m4bJ5OcC}+#{WXuqsXyNq4K.iaPGviZZIky}+#{WXuqsXyNq4K.e0RdqwlP1Xj}+#{WXuqsXyNq4K.o9Oj5Cjekej}+#{WXuqsXyNq4K.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "Jw9aspjdZCr",
numerator: "#{WXuqsXyNq4K.R33m4bJ5OcC}+#{WXuqsXyNq4K.dtdut9EncYH}",
denominator: "1"
},
{
id: "hprXtyIUoiW",
numerator: "#{WXuqsXyNq4K.MQKsgFxCtJ7}+#{WXuqsXyNq4K.awkJLkKHr7a}",
denominator: "1"
},
{
id: "U80EcU3GgST",
numerator: "#{WXuqsXyNq4K.o9Oj5Cjekej}+#{WXuqsXyNq4K.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "joY5JgeQfzt",
numerator: "#{WXuqsXyNq4K.iaPGviZZIky}+#{WXuqsXyNq4K.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "lWw4DF2rp1P",
numerator: "#{fVzXb5qPrCp.R33m4bJ5OcC}+#{fVzXb5qPrCp.dtdut9EncYH}",
denominator: "1"
},
{
id: "wfRHShfRSyg",
numerator: "#{fVzXb5qPrCp.MQKsgFxCtJ7}+#{fVzXb5qPrCp.awkJLkKHr7a}",
denominator: "1"
},
{
id: "X1NdoJrIYBb",
numerator: "#{fVzXb5qPrCp.o9Oj5Cjekej}+#{fVzXb5qPrCp.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "LBthYTWcQjD",
numerator: "#{fVzXb5qPrCp.iaPGviZZIky}+#{fVzXb5qPrCp.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "CbZDrLXnMzk",
numerator: "#{UlFUBEpJsSs.oliDewHdUdd}+#{UlFUBEpJsSs.uuidY4WdJml}",
denominator: "1"
},
{
id: "rnmbMqeKXvM",
numerator: "#{UlFUBEpJsSs.R33m4bJ5OcC}+#{UlFUBEpJsSs.dtdut9EncYH}",
denominator: "1"
},
{
id: "daRgVtXK9HH",
numerator: "#{UlFUBEpJsSs.MQKsgFxCtJ7}+#{UlFUBEpJsSs.awkJLkKHr7a}",
denominator: "1"
},
{
id: "Kl4TF4nWIja",
numerator: "#{UlFUBEpJsSs.o9Oj5Cjekej}+#{UlFUBEpJsSs.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "o9mCMXAabRr",
numerator: "#{UlFUBEpJsSs.iaPGviZZIky}+#{UlFUBEpJsSs.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "DNcXu8knyit",
numerator: "#{s74ccDa9ZDM.awkJLkKHr7a}+#{s74ccDa9ZDM.MQKsgFxCtJ7}+#{s74ccDa9ZDM.dtdut9EncYH}+#{s74ccDa9ZDM.R33m4bJ5OcC}+#{s74ccDa9ZDM.e0RdqwlP1Xj}+#{s74ccDa9ZDM.iaPGviZZIky}+#{s74ccDa9ZDM.oliDewHdUdd}+#{s74ccDa9ZDM.uuidY4WdJml}+#{s74ccDa9ZDM.o9Oj5Cjekej}+#{s74ccDa9ZDM.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "hNbImG2vGlR",
numerator: "#{s74ccDa9ZDM.oliDewHdUdd}+#{s74ccDa9ZDM.uuidY4WdJml}",
denominator: "1"
},
{
id: "nwgXf1SDGXM",
numerator: "#{s74ccDa9ZDM.R33m4bJ5OcC}+#{s74ccDa9ZDM.dtdut9EncYH}",
denominator: "1"
},
{
id: "Y5pQyIJKdTH",
numerator: "#{s74ccDa9ZDM.MQKsgFxCtJ7}+#{s74ccDa9ZDM.awkJLkKHr7a}",
denominator: "1"
},
{
id: "MzsV47RMnS9",
numerator: "#{s74ccDa9ZDM.o9Oj5Cjekej}+#{s74ccDa9ZDM.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "rFFCjX8oHU1",
numerator: "#{s74ccDa9ZDM.iaPGviZZIky}+#{s74ccDa9ZDM.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "SscgnCkSvkm",
numerator: "#{GqSZits9IeK.R33m4bJ5OcC}+#{GqSZits9IeK.dtdut9EncYH}",
denominator: "1"
},
{
id: "dNBh7spa0Zn",
numerator: "#{GqSZits9IeK.MQKsgFxCtJ7}+#{GqSZits9IeK.awkJLkKHr7a}",
denominator: "1"
},
{
id: "dYlJEAxIdco",
numerator: "#{GqSZits9IeK.o9Oj5Cjekej}+#{GqSZits9IeK.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "t8G0oepQILG",
numerator: "#{GqSZits9IeK.iaPGviZZIky}+#{GqSZits9IeK.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "dq3sAY3bSkp",
numerator: "#{W5GuP81V3Zf.MQKsgFxCtJ7}+#{W5GuP81V3Zf.awkJLkKHr7a}",
denominator: "1"
},
{
id: "D6b4IrEGt2p",
numerator: "#{MOYDHlGVOZi.o9Oj5Cjekej}+#{MOYDHlGVOZi.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "POHUQb5XpFV",
numerator: "#{aruodm4tcnY.MQKsgFxCtJ7}+#{aruodm4tcnY.awkJLkKHr7a}",
denominator: "1"
},
{
id: "eDT7yPKHkEz",
numerator: "#{aruodm4tcnY.o9Oj5Cjekej}+#{aruodm4tcnY.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "iVYx5IleIpx",
numerator: "#{WSaSCvJTnfQ.MQKsgFxCtJ7}+#{WSaSCvJTnfQ.awkJLkKHr7a}",
denominator: "1"
},
{
id: "XBd9sO7rWIZ",
numerator: "#{WSaSCvJTnfQ.o9Oj5Cjekej}+#{WSaSCvJTnfQ.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "v4kVwx8GKAl",
numerator: "#{tM1ecc8qcsJ.oliDewHdUdd}+#{tM1ecc8qcsJ.uuidY4WdJml}+#{tM1ecc8qcsJ.iaPGviZZIky}+#{tM1ecc8qcsJ.e0RdqwlP1Xj}+#{tM1ecc8qcsJ.R33m4bJ5OcC}+#{tM1ecc8qcsJ.dtdut9EncYH}+#{tM1ecc8qcsJ.MQKsgFxCtJ7}+#{tM1ecc8qcsJ.awkJLkKHr7a}+#{tM1ecc8qcsJ.o9Oj5Cjekej}+#{tM1ecc8qcsJ.ZU3sKDB9i2o}+#{tM1ecc8qcsJ.o9Oj5Cjekej}+#{tM1ecc8qcsJ.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "LwBnwjmYaJF",
numerator: "#{tM1ecc8qcsJ.MQKsgFxCtJ7}+#{tM1ecc8qcsJ.awkJLkKHr7a}",
denominator: "1"
},
{
id: "Pqt6UHlYpvI",
numerator: "#{tM1ecc8qcsJ.o9Oj5Cjekej}+#{tM1ecc8qcsJ.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "RjQitbZsG1M",
numerator: "#{cGVl8WkpBTL.oliDewHdUdd}+#{cGVl8WkpBTL.uuidY4WdJml}",
denominator: "1"
},
{
id: "gzpPRD6ebAN",
numerator: "#{pP6BsR5KiRM.awkJLkKHr7a}+#{pP6BsR5KiRM.MQKsgFxCtJ7}+#{pP6BsR5KiRM.dtdut9EncYH}+#{pP6BsR5KiRM.R33m4bJ5OcC}+#{pP6BsR5KiRM.e0RdqwlP1Xj}+#{pP6BsR5KiRM.iaPGviZZIky}+#{pP6BsR5KiRM.oliDewHdUdd}+#{pP6BsR5KiRM.uuidY4WdJml}+#{pP6BsR5KiRM.o9Oj5Cjekej}+#{pP6BsR5KiRM.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "fCxIcBsKwsm",
numerator: "#{pP6BsR5KiRM.R33m4bJ5OcC}+#{pP6BsR5KiRM.dtdut9EncYH}",
denominator: "1"
},
{
id: "q9fPLwC7S0T",
numerator: "#{pP6BsR5KiRM.MQKsgFxCtJ7}+#{pP6BsR5KiRM.awkJLkKHr7a}",
denominator: "1"
},
{
id: "Rxp5cOgPSQ2",
numerator: "#{pP6BsR5KiRM.o9Oj5Cjekej}+#{pP6BsR5KiRM.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "Ldgeykuxq5q",
numerator: "#{pP6BsR5KiRM.iaPGviZZIky}+#{pP6BsR5KiRM.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "SwS0xc8b8aR",
numerator: "#{ACM4BHrKZNQ.awkJLkKHr7a}+#{ACM4BHrKZNQ.MQKsgFxCtJ7}+#{ACM4BHrKZNQ.dtdut9EncYH}+#{ACM4BHrKZNQ.R33m4bJ5OcC}+#{ACM4BHrKZNQ.e0RdqwlP1Xj}+#{ACM4BHrKZNQ.iaPGviZZIky}+#{ACM4BHrKZNQ.oliDewHdUdd}+#{ACM4BHrKZNQ.uuidY4WdJml}+#{ACM4BHrKZNQ.o9Oj5Cjekej}+#{ACM4BHrKZNQ.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "CUwY4qpkYeo",
numerator: "#{ACM4BHrKZNQ.oliDewHdUdd}+#{ACM4BHrKZNQ.uuidY4WdJml}",
denominator: "1"
},
{
id: "foKjtNmwy2K",
numerator: "#{ACM4BHrKZNQ.R33m4bJ5OcC}+#{ACM4BHrKZNQ.dtdut9EncYH}",
denominator: "1"
},
{
id: "hMMObZY1URK",
numerator: "#{ACM4BHrKZNQ.MQKsgFxCtJ7}+#{ACM4BHrKZNQ.awkJLkKHr7a}",
denominator: "1"
},
{
id: "PztJY2kvpvC",
numerator: "#{ACM4BHrKZNQ.o9Oj5Cjekej}+#{ACM4BHrKZNQ.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "VwQFaaahEy4",
numerator: "#{ACM4BHrKZNQ.iaPGviZZIky}+#{ACM4BHrKZNQ.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "YdZwDTRdpcd",
numerator: "#{mcVhgPQtLLX.R33m4bJ5OcC}+#{mcVhgPQtLLX.dtdut9EncYH}",
denominator: "1"
},
{
id: "oEcutZtlz54",
numerator: "#{mcVhgPQtLLX.MQKsgFxCtJ7}+#{mcVhgPQtLLX.awkJLkKHr7a}",
denominator: "1"
},
{
id: "ojJtnMD2Vb1",
numerator: "#{mcVhgPQtLLX.o9Oj5Cjekej}+#{mcVhgPQtLLX.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "i6WLbC60XBl",
numerator: "#{mcVhgPQtLLX.iaPGviZZIky}+#{mcVhgPQtLLX.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "N9eOnIXfmOY",
numerator: "#{pZr0OzykmJB.R33m4bJ5OcC}+#{pZr0OzykmJB.dtdut9EncYH}",
denominator: "1"
},
{
id: "vbfDKwsyliZ",
numerator: "#{pZr0OzykmJB.MQKsgFxCtJ7}+#{pZr0OzykmJB.awkJLkKHr7a}",
denominator: "1"
},
{
id: "KNBdC6LGhyo",
numerator: "#{pZr0OzykmJB.o9Oj5Cjekej}+#{pZr0OzykmJB.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "bQDENGD47Is",
numerator: "#{pZr0OzykmJB.iaPGviZZIky}+#{pZr0OzykmJB.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "vT7rBPZOgqs",
numerator: "#{QtBqSDM3YCN.oliDewHdUdd}+#{QtBqSDM3YCN.uuidY4WdJml}",
denominator: "1"
},
{
id: "qmODFxc43pa",
numerator: "#{QtBqSDM3YCN.R33m4bJ5OcC}+#{QtBqSDM3YCN.dtdut9EncYH}",
denominator: "1"
},
{
id: "NMeaiaH15Nh",
numerator: "#{QtBqSDM3YCN.MQKsgFxCtJ7}+#{QtBqSDM3YCN.awkJLkKHr7a}",
denominator: "1"
},
{
id: "NongJVSA1mC",
numerator: "#{QtBqSDM3YCN.iaPGviZZIky}+#{QtBqSDM3YCN.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "nM5MoNOeu2h",
numerator: "#{QtBqSDM3YCN.o9Oj5Cjekej}+#{QtBqSDM3YCN.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "AZrgOsGv0J5",
numerator: "#{xCl76XUXHb9.oliDewHdUdd}+#{xCl76XUXHb9.uuidY4WdJml}+#{xCl76XUXHb9.iaPGviZZIky}+#{xCl76XUXHb9.e0RdqwlP1Xj}+#{xCl76XUXHb9.R33m4bJ5OcC}+#{xCl76XUXHb9.dtdut9EncYH}+#{xCl76XUXHb9.MQKsgFxCtJ7}+#{xCl76XUXHb9.awkJLkKHr7a}+#{xCl76XUXHb9.o9Oj5Cjekej}+#{xCl76XUXHb9.ZU3sKDB9i2o}+#{wEPDo9ZpwLq.o9Oj5Cjekej}+#{wEPDo9ZpwLq.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "sssrjZgyw6S",
numerator: "#{xCl76XUXHb9.oliDewHdUdd}+#{xCl76XUXHb9.uuidY4WdJml}",
denominator: "1"
},
{
id: "gwpmIXnTQvT",
numerator: "#{xCl76XUXHb9.R33m4bJ5OcC}+#{xCl76XUXHb9.dtdut9EncYH}",
denominator: "1"
},
{
id: "ba13TssYexe",
numerator: "#{xCl76XUXHb9.MQKsgFxCtJ7}+#{xCl76XUXHb9.awkJLkKHr7a}",
denominator: "1"
},
{
id: "eWVvp41OVYR",
numerator: "#{xCl76XUXHb9.o9Oj5Cjekej}+#{xCl76XUXHb9.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "mw8xKya9U0T",
numerator: "#{xCl76XUXHb9.iaPGviZZIky}+#{xCl76XUXHb9.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "pMDutBNwzaL",
numerator: "#{Yut5amdi7iw.oliDewHdUdd}+#{Yut5amdi7iw.uuidY4WdJml}",
denominator: "1"
},
{
id: "lIEsmoGxZGM",
numerator: "#{Yut5amdi7iw.R33m4bJ5OcC}+#{Yut5amdi7iw.dtdut9EncYH}",
denominator: "1"
},
{
id: "ANAYctZjxje",
numerator: "#{Yut5amdi7iw.MQKsgFxCtJ7}+#{Yut5amdi7iw.awkJLkKHr7a}",
denominator: "1"
},
{
id: "gPsXcFFcvwo",
numerator: "#{Yut5amdi7iw.o9Oj5Cjekej}+#{Yut5amdi7iw.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "GUuknYcUZKI",
numerator: "#{Yut5amdi7iw.iaPGviZZIky}+#{Yut5amdi7iw.e0RdqwlP1Xj}",
denominator: "1"
},
{
id: "F2RfqIvWWgG",
numerator: "#{q3ELeLciuTh.awkJLkKHr7a}+#{q3ELeLciuTh.MQKsgFxCtJ7}+#{q3ELeLciuTh.dtdut9EncYH}+#{q3ELeLciuTh.R33m4bJ5OcC}+#{q3ELeLciuTh.e0RdqwlP1Xj}+#{q3ELeLciuTh.iaPGviZZIky}+#{q3ELeLciuTh.oliDewHdUdd}+#{q3ELeLciuTh.uuidY4WdJml}+#{q3ELeLciuTh.ZU3sKDB9i2o}+#{q3ELeLciuTh.o9Oj5Cjekej} + #{q3ELeLciuTh.o9Oj5Cjekej}+#{q3ELeLciuTh.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "kOvtogWpca4",
numerator: "#{CWXG9lBSI7Y.uuidY4WdJml}+#{CWXG9lBSI7Y.oliDewHdUdd}",
denominator: "1"
},
{
id: "py9zAfWvEz1",
numerator: "#{HWZmyu3j4NX.awkJLkKHr7a}+#{HWZmyu3j4NX.MQKsgFxCtJ7}+#{HWZmyu3j4NX.dtdut9EncYH}+#{HWZmyu3j4NX.R33m4bJ5OcC}+#{HWZmyu3j4NX.e0RdqwlP1Xj}+#{HWZmyu3j4NX.iaPGviZZIky}+#{HWZmyu3j4NX.o9Oj5Cjekej}+#{HWZmyu3j4NX.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "f6VVNVXwuO0",
numerator: "#{zqaHIXl6j7c.uuidY4WdJml}+#{zqaHIXl6j7c.oliDewHdUdd}+#{zqaHIXl6j7c.awkJLkKHr7a}+#{zqaHIXl6j7c.MQKsgFxCtJ7}+#{zqaHIXl6j7c.dtdut9EncYH}+#{zqaHIXl6j7c.R33m4bJ5OcC}+#{zqaHIXl6j7c.e0RdqwlP1Xj}+#{zqaHIXl6j7c.iaPGviZZIky}+#{zqaHIXl6j7c.o9Oj5Cjekej}+#{zqaHIXl6j7c.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "fWPbWqn043S",
numerator: "#{CsYfybuaSgc.awkJLkKHr7a}+#{CsYfybuaSgc.MQKsgFxCtJ7}+#{CsYfybuaSgc.dtdut9EncYH}+#{CsYfybuaSgc.R33m4bJ5OcC}+#{CsYfybuaSgc.e0RdqwlP1Xj}+#{CsYfybuaSgc.iaPGviZZIky}+#{CsYfybuaSgc.oliDewHdUdd}+#{CsYfybuaSgc.uuidY4WdJml}+#{CsYfybuaSgc.o9Oj5Cjekej}+#{CsYfybuaSgc.ZU3sKDB9i2o} + #{CsYfybuaSgc.o9Oj5Cjekej}+#{CsYfybuaSgc.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "xLp1LdHEuiM",
numerator: "#{Y7upeLGM36C.uuidY4WdJml}+#{Y7upeLGM36C.oliDewHdUdd}",
denominator: "1"
},
{
id: "yxoiPqPkFQF",
numerator: "#{v6sdLtxvY1K.awkJLkKHr7a}+#{v6sdLtxvY1K.MQKsgFxCtJ7}+#{v6sdLtxvY1K.dtdut9EncYH}+#{v6sdLtxvY1K.R33m4bJ5OcC}+#{v6sdLtxvY1K.e0RdqwlP1Xj}+#{v6sdLtxvY1K.iaPGviZZIky}+#{v6sdLtxvY1K.oliDewHdUdd}+#{v6sdLtxvY1K.uuidY4WdJml}+#{v6sdLtxvY1K.o9Oj5Cjekej}+#{v6sdLtxvY1K.ZU3sKDB9i2o} + #{SgeSIiqTN2l.o9Oj5Cjekej}+#{SgeSIiqTN2l.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "dGU5CaxQcAV",
numerator: "#{x5cswY9qs7m.awkJLkKHr7a}+#{x5cswY9qs7m.MQKsgFxCtJ7}+#{x5cswY9qs7m.dtdut9EncYH}+#{x5cswY9qs7m.R33m4bJ5OcC}+#{x5cswY9qs7m.e0RdqwlP1Xj}+#{x5cswY9qs7m.iaPGviZZIky}+#{x5cswY9qs7m.o9Oj5Cjekej}+ #{x5cswY9qs7m.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "v6H5yVi5RiG",
numerator: "#{o0KObJuu9Yu.uuidY4WdJml}+#{o0KObJuu9Yu.oliDewHdUdd}+#{o0KObJuu9Yu.awkJLkKHr7a}+#{o0KObJuu9Yu.MQKsgFxCtJ7}+#{o0KObJuu9Yu.dtdut9EncYH}+#{o0KObJuu9Yu.R33m4bJ5OcC}+#{o0KObJuu9Yu.e0RdqwlP1Xj}+#{o0KObJuu9Yu.iaPGviZZIky}+#{o0KObJuu9Yu.o9Oj5Cjekej}+#{o0KObJuu9Yu.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "W31sUds4BN5",
numerator: "#{eoZtkUbfrmF.awkJLkKHr7a}+#{eoZtkUbfrmF.MQKsgFxCtJ7}+#{eoZtkUbfrmF.dtdut9EncYH}+#{eoZtkUbfrmF.R33m4bJ5OcC}+#{eoZtkUbfrmF.e0RdqwlP1Xj}+#{eoZtkUbfrmF.iaPGviZZIky}+#{eoZtkUbfrmF.o9Oj5Cjekej}+#{eoZtkUbfrmF.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "FE6UzzDeYPu",
numerator: "#{l1GL5Tmn22E.awkJLkKHr7a}+#{l1GL5Tmn22E.MQKsgFxCtJ7}+#{l1GL5Tmn22E.o9Oj5Cjekej}+#{l1GL5Tmn22E.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "SOvRvg1Iepu",
numerator: "+#{qMHYsWwYgo6.awkJLkKHr7a}+#{qMHYsWwYgo6.MQKsgFxCtJ7}+#{qMHYsWwYgo6.dtdut9EncYH}+#{qMHYsWwYgo6.R33m4bJ5OcC}+#{qMHYsWwYgo6.e0RdqwlP1Xj}+#{qMHYsWwYgo6.iaPGviZZIky}+#{qMHYsWwYgo6.oliDewHdUdd}+#{qMHYsWwYgo6.uuidY4WdJml}+#{qMHYsWwYgo6.o9Oj5Cjekej}+#{qMHYsWwYgo6.ZU3sKDB9i2o} + #{qMHYsWwYgo6.o9Oj5Cjekej}+#{qMHYsWwYgo6.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "xtzOFpXUiXa",
numerator: "#{bC64bIily9n.awkJLkKHr7a}+#{bC64bIily9n.MQKsgFxCtJ7}+#{bC64bIily9n.dtdut9EncYH}+#{bC64bIily9n.R33m4bJ5OcC}+#{bC64bIily9n.e0RdqwlP1Xj}+#{bC64bIily9n.iaPGviZZIky}+#{bC64bIily9n.oliDewHdUdd}+#{bC64bIily9n.uuidY4WdJml}+#{bC64bIily9n.o9Oj5Cjekej}+#{bC64bIily9n.ZU3sKDB9i2o} + #{bC64bIily9n.o9Oj5Cjekej}+#{bC64bIily9n.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "UZqlzdO7POc",
numerator: "#{cGVl8WkpBTL.uuidY4WdJml}+#{cGVl8WkpBTL.oliDewHdUdd}",
denominator: "1"
},
{
id: "pClrmX6f8LL",
numerator: "#{eTOV59Rcv4F.awkJLkKHr7a}+#{eTOV59Rcv4F.MQKsgFxCtJ7}+#{eTOV59Rcv4F.dtdut9EncYH}+#{eTOV59Rcv4F.R33m4bJ5OcC}+#{eTOV59Rcv4F.o9Oj5Cjekej}+#{eTOV59Rcv4F.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "NTuu387Vlrz",
numerator: "#{fLjZYZB3tuB.awkJLkKHr7a}+#{fLjZYZB3tuB.MQKsgFxCtJ7}+#{fLjZYZB3tuB.dtdut9EncYH}+#{fLjZYZB3tuB.R33m4bJ5OcC}+#{fLjZYZB3tuB.e0RdqwlP1Xj}+#{fLjZYZB3tuB.iaPGviZZIky}+#{fLjZYZB3tuB.oliDewHdUdd}+#{fLjZYZB3tuB.uuidY4WdJml}+#{fLjZYZB3tuB.o9Oj5Cjekej}+#{fLjZYZB3tuB.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "EfeMHF8bEnM",
numerator: "#{HMEUM6T2dxF.uuidY4WdJml}+#{HMEUM6T2dxF.oliDewHdUdd}+#{HMEUM6T2dxF.awkJLkKHr7a}+#{HMEUM6T2dxF.MQKsgFxCtJ7}+#{HMEUM6T2dxF.dtdut9EncYH}+#{HMEUM6T2dxF.R33m4bJ5OcC}+#{HMEUM6T2dxF.e0RdqwlP1Xj}+#{HMEUM6T2dxF.iaPGviZZIky}+#{HMEUM6T2dxF.o9Oj5Cjekej}+#{HMEUM6T2dxF.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "GNleoBQzx3O",
numerator: "#{kzj3RYX536Y.dtdut9EncYH}+#{kzj3RYX536Y.awkJLkKHr7a}+#{kzj3RYX536Y.o9Oj5Cjekej}+#{kzj3RYX536Y.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "mrCc3swBxNL",
numerator: "#{Lcj8osNjKQx.awkJLkKHr7a}+#{Lcj8osNjKQx.MQKsgFxCtJ7}+#{Lcj8osNjKQx.dtdut9EncYH}+#{Lcj8osNjKQx.R33m4bJ5OcC}+#{Lcj8osNjKQx.e0RdqwlP1Xj}+#{Lcj8osNjKQx.iaPGviZZIky}",
denominator: "1"
},
{
id: "DX2GLI2bzVF",
numerator: "#{qoeOTJT0x6o.awkJLkKHr7a}+#{qoeOTJT0x6o.MQKsgFxCtJ7}+#{qoeOTJT0x6o.dtdut9EncYH}+#{qoeOTJT0x6o.R33m4bJ5OcC}+#{qoeOTJT0x6o.e0RdqwlP1Xj}+#{qoeOTJT0x6o.iaPGviZZIky}+#{qoeOTJT0x6o.o9Oj5Cjekej}+#{qoeOTJT0x6o.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "Bp5VTMxDCnM",
numerator: "#{C2Rg2uPfbhs.awkJLkKHr7a}+#{C2Rg2uPfbhs.MQKsgFxCtJ7}+#{C2Rg2uPfbhs.dtdut9EncYH}+#{C2Rg2uPfbhs.R33m4bJ5OcC}+#{C2Rg2uPfbhs.e0RdqwlP1Xj}+#{C2Rg2uPfbhs.iaPGviZZIky}+#{C2Rg2uPfbhs.ZU3sKDB9i2o}+#{C2Rg2uPfbhs.o9Oj5Cjekej} + #{C2Rg2uPfbhs.o9Oj5Cjekej}+#{C2Rg2uPfbhs.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "t5nYI6Wfv2J",
numerator: "#{BwJsDwQayqN.awkJLkKHr7a}+#{BwJsDwQayqN.MQKsgFxCtJ7}+#{BwJsDwQayqN.dtdut9EncYH}+#{BwJsDwQayqN.R33m4bJ5OcC}+#{BwJsDwQayqN.e0RdqwlP1Xj}+#{BwJsDwQayqN.iaPGviZZIky}+#{BwJsDwQayqN.o9Oj5Cjekej}+#{BwJsDwQayqN.ZU3sKDB9i2o} + #{BwJsDwQayqN.o9Oj5Cjekej}+#{BwJsDwQayqN.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "rEdiabeWfeJ",
numerator: "#{ShxnDczlruP.uuidY4WdJml}+#{ShxnDczlruP.oliDewHdUdd}+#{ShxnDczlruP.awkJLkKHr7a}+#{ShxnDczlruP.MQKsgFxCtJ7}+#{ShxnDczlruP.dtdut9EncYH}+#{ShxnDczlruP.R33m4bJ5OcC}+#{ShxnDczlruP.e0RdqwlP1Xj}+#{ShxnDczlruP.iaPGviZZIky}+#{ShxnDczlruP.o9Oj5Cjekej}+#{ShxnDczlruP.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "W5GOdzpoYML",
numerator: "#{LD4thW4OmXi.awkJLkKHr7a}+#{LD4thW4OmXi.MQKsgFxCtJ7}+#{LD4thW4OmXi.dtdut9EncYH}+#{LD4thW4OmXi.R33m4bJ5OcC}+#{LD4thW4OmXi.o9Oj5Cjekej}+#{LD4thW4OmXi.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "NDff90R0fFV",
numerator: "#{ccIfQsrfWeL.awkJLkKHr7a}+#{ccIfQsrfWeL.MQKsgFxCtJ7}+#{ccIfQsrfWeL.dtdut9EncYH}+#{ccIfQsrfWeL.R33m4bJ5OcC}+#{ccIfQsrfWeL.e0RdqwlP1Xj}+#{ccIfQsrfWeL.iaPGviZZIky}+#{ccIfQsrfWeL.o9Oj5Cjekej}+#{ccIfQsrfWeL.ZU3sKDB9i2o} + #{ccIfQsrfWeL.o9Oj5Cjekej}+#{ccIfQsrfWeL.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "rtiUTZ80S4E",
numerator: "#{NlXYR3IJWCl.awkJLkKHr7a}+#{NlXYR3IJWCl.MQKsgFxCtJ7}+#{NlXYR3IJWCl.dtdut9EncYH}+#{NlXYR3IJWCl.R33m4bJ5OcC}+#{NlXYR3IJWCl.e0RdqwlP1Xj}+#{NlXYR3IJWCl.iaPGviZZIky}+#{NlXYR3IJWCl.o9Oj5Cjekej}+#{NlXYR3IJWCl.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "qJ9lSItd5pI",
numerator: "#{c4ZuqcOCyix.awkJLkKHr7a}+#{c4ZuqcOCyix.MQKsgFxCtJ7}+#{c4ZuqcOCyix.dtdut9EncYH}+#{c4ZuqcOCyix.R33m4bJ5OcC}+#{c4ZuqcOCyix.e0RdqwlP1Xj}+#{c4ZuqcOCyix.iaPGviZZIky}+#{c4ZuqcOCyix.o9Oj5Cjekej}+#{c4ZuqcOCyix.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "Tji7W1lON6j",
numerator: "#{Kpa6sheYah0.uuidY4WdJml}+#{Kpa6sheYah0.oliDewHdUdd}+#{Kpa6sheYah0.awkJLkKHr7a}+#{Kpa6sheYah0.MQKsgFxCtJ7}+#{Kpa6sheYah0.dtdut9EncYH}+#{Kpa6sheYah0.R33m4bJ5OcC}+#{Kpa6sheYah0.e0RdqwlP1Xj}+#{Kpa6sheYah0.iaPGviZZIky}+#{Kpa6sheYah0.o9Oj5Cjekej}+#{Kpa6sheYah0.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "XdrcROEAZQE",
numerator: "#{ctT1j57B2OL.awkJLkKHr7a}+#{ctT1j57B2OL.MQKsgFxCtJ7}+#{ctT1j57B2OL.dtdut9EncYH}+#{ctT1j57B2OL.R33m4bJ5OcC}+#{ctT1j57B2OL.e0RdqwlP1Xj}+#{ctT1j57B2OL.iaPGviZZIky}+#{ctT1j57B2OL.o9Oj5Cjekej}+#{ctT1j57B2OL.ZU3sKDB9i2o} + #{ctT1j57B2OL.o9Oj5Cjekej}+#{ctT1j57B2OL.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "pq26xhgqUle",
numerator: "#{sr87SW2uEmt.awkJLkKHr7a}+#{sr87SW2uEmt.MQKsgFxCtJ7}+#{sr87SW2uEmt.dtdut9EncYH}+#{sr87SW2uEmt.R33m4bJ5OcC}+#{sr87SW2uEmt.e0RdqwlP1Xj}+#{sr87SW2uEmt.iaPGviZZIky}+#{sr87SW2uEmt.oliDewHdUdd}+#{sr87SW2uEmt.uuidY4WdJml}+#{sr87SW2uEmt.o9Oj5Cjekej}+#{sr87SW2uEmt.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "ItHVLgKoGCt",
numerator: "#{fVzXb5qPrCp.awkJLkKHr7a}+#{fVzXb5qPrCp.MQKsgFxCtJ7}+#{fVzXb5qPrCp.dtdut9EncYH}+#{fVzXb5qPrCp.R33m4bJ5OcC}+#{fVzXb5qPrCp.e0RdqwlP1Xj}+#{fVzXb5qPrCp.iaPGviZZIky}+#{fVzXb5qPrCp.o9Oj5Cjekej}+#{fVzXb5qPrCp.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "w3A30An6KEl",
numerator: "#{W5GuP81V3Zf.awkJLkKHr7a}+#{W5GuP81V3Zf.MQKsgFxCtJ7}+#{MOYDHlGVOZi.o9Oj5Cjekej}+#{MOYDHlGVOZi.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "uwM6VBkmAtP",
numerator: "#{aruodm4tcnY.awkJLkKHr7a}+#{aruodm4tcnY.MQKsgFxCtJ7}+#{aruodm4tcnY.o9Oj5Cjekej}+#{aruodm4tcnY.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "XCPewGvoA4T",
numerator: "#{WSaSCvJTnfQ.awkJLkKHr7a}+#{WSaSCvJTnfQ.MQKsgFxCtJ7}+#{WSaSCvJTnfQ.o9Oj5Cjekej}+#{WSaSCvJTnfQ.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "yHJJrZ72jdL",
numerator: "#{ItK93OX9wyu.uuidY4WdJml}+#{ItK93OX9wyu.oliDewHdUdd}+#{ItK93OX9wyu.awkJLkKHr7a}+#{ItK93OX9wyu.MQKsgFxCtJ7}+#{ItK93OX9wyu.dtdut9EncYH}+#{ItK93OX9wyu.R33m4bJ5OcC}+#{ItK93OX9wyu.e0RdqwlP1Xj}+#{ItK93OX9wyu.iaPGviZZIky}+#{ItK93OX9wyu.o9Oj5Cjekej}+#{ItK93OX9wyu.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "EHPlq9fFCyu",
numerator: "#{mcVhgPQtLLX.awkJLkKHr7a}+#{mcVhgPQtLLX.MQKsgFxCtJ7}+#{mcVhgPQtLLX.dtdut9EncYH}+#{mcVhgPQtLLX.R33m4bJ5OcC}+#{mcVhgPQtLLX.e0RdqwlP1Xj}+#{mcVhgPQtLLX.iaPGviZZIky}+#{mcVhgPQtLLX.o9Oj5Cjekej}+#{mcVhgPQtLLX.ZU3sKDB9i2o} + #{mcVhgPQtLLX.o9Oj5Cjekej}+#{mcVhgPQtLLX.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "yGix17luh2l",
numerator: "#{pZr0OzykmJB.awkJLkKHr7a}+#{pZr0OzykmJB.MQKsgFxCtJ7}+#{pZr0OzykmJB.dtdut9EncYH}+#{pZr0OzykmJB.R33m4bJ5OcC}+#{pZr0OzykmJB.e0RdqwlP1Xj}+#{pZr0OzykmJB.iaPGviZZIky}+#{pZr0OzykmJB.o9Oj5Cjekej}+#{pZr0OzykmJB.ZU3sKDB9i2o}",
denominator: "1"
},
{
id: "tdPCrkfN5x4",
numerator: "#{QtBqSDM3YCN.awkJLkKHr7a}+#{QtBqSDM3YCN.MQKsgFxCtJ7}+#{QtBqSDM3YCN.dtdut9EncYH}+#{QtBqSDM3YCN.R33m4bJ5OcC}+#{QtBqSDM3YCN.e0RdqwlP1Xj}+#{QtBqSDM3YCN.iaPGviZZIky}+#{QtBqSDM3YCN.oliDewHdUdd}+#{QtBqSDM3YCN.uuidY4WdJml}+#{QtBqSDM3YCN.o9Oj5Cjekej}+#{QtBqSDM3YCN.ZU3sKDB9i2o}",
denominator: "1"
}
]
}
            $('input[name="indicator"]').each(function (i, element) {
                indicatorsOjb.indicators.forEach(function (ind) {
                    if (ind.id === $(element).attr('indicatorname')){
                    $(element).attr('indicatorFormula', '('+ind.numerator+ ')/(1)');
                }
                });

                    $(element).removeAttr('dataelementid');
                    $(element).attr('id', $(element).attr('indicatorname'));
                    $(element).removeAttr('indicatorname');
                    $(element).removeAttr('oldid');
                    $(element).removeAttr('class');
                    $(element).attr('name', 'indicatorFormula');
                    $(element).attr('disabled', 'disabled');
            });

            // console.log(indicatorsArr);

        var content = $.html(elem);
                var calculatingScript = JSON.parse(localStorage.getItem('script'));
                fs.writeFile('opd/new_ipd.html', '\r\n'+content+'', function (err) {
                    console.log('OPD has been transformed');
                });
        });
        }
}  else if (typeOfActivity ==='transform-eye') {
    fs.readFile('eye_and_ntd/eye_transform.html', 'utf8', formatHtml);

        function formatHtml(error, data) {
            $ = cheerio.load('' + data + '');

        $('selectelem').each(function(i, elem) {
            $('input[name="indicatorFormula"]').each(function (i, element) {
                var indStr ='';
                if ($(element).attr('id').substring(11,12) === '1') {
                    $('input[name="entryfield"]').each(function (index, entryfield) {
                        if (index === 0 || index === 1) {
                            indStr += '#{'+$(entryfield).attr('id').replace('-','.').replace('-val','') +'}+'
                        }
                    });
                    } else if ($(element).attr('id').substring(11,12) === '2') {
                    $('input[name="entryfield"]').each(function (index, entryfield) {
                        if (index === 2 || index === 3) {
                            indStr += '#{'+$(entryfield).attr('id').replace('-','.').replace('-val','') +'}+'
                        }
                    });
                    } else if ($(element).attr('id').substring(11,12) === '3') {
                    $('input[name="entryfield"]').each(function (index, entryfield) {
                        if (index === 4 || index === 5) {
                            indStr += '#{'+$(entryfield).attr('id').replace('-','.').replace('-val','') +'}+'
                        }
                    });
                    } else if ($(element).attr('id').substring(11,12) === '4') {
                    $('input[name="entryfield"]').each(function (index, entryfield) {
                        if (index === 6 || index === 7) {
                            indStr += '#{'+$(entryfield).attr('id').replace('-','.').replace('-val','') +'}+'
                        }
                    });
                    } else if ($(element).attr('id').substring(11,12) === '5') {
                    $('input[name="entryfield"]').each(function (index, entryfield) {
                        if (index === 0 || index === 2 || index === 4 || index === 6) {
                            indStr += '#{'+$(entryfield).attr('id').replace('-','.').replace('-val','') +'}+'
                        }
                    });
                    } else if ($(element).attr('id').substring(11,12) === '6') {
                    $('input[name="entryfield"]').each(function (index, entryfield) {
                        if (index === 1 || index === 3 || index === 5 || index === 7) {
                            indStr += '#{'+$(entryfield).attr('id').replace('-','.').replace('-val','') +'}+'
                        }
                    });
                    }

                    $(element).removeAttr('indicatorformula');
                    console.log(indStr.substring(0, indStr.length -1));
                    $(element).attr('indicatorFormula', '('+ indStr.substring(0, indStr.length -1)+ ')/(1)');
            });

            $('input[name="total"]').each(function (i, elementTotal) {
                // console.log(elementTotal)
                var indStr='';
                $('input[name="entryfield"]').each(function (index, entryfield) {
                        indStr += '#{'+$(entryfield).attr('id').replace('-','.').replace('-val','') +'}+';
                    });
                    console.log(indStr.substring(0, indStr.length -1));
                    $(elementTotal).removeAttr('name');
                    $(elementTotal).removeAttr('value');
                    $(elementTotal).attr('indicatorFormula', '('+ indStr.substring(0, indStr.length -1)+ ')/(1)');
                    $(elementTotal).attr('name', 'indicatorFormula');
                    $(elementTotal).attr('disabled', 'disabled');
                    $(elementTotal).removeAttr('dataelementid');
            });

            // console.log(indicatorsArr);

        var content = $.html(elem);
                var calculatingScript = JSON.parse(localStorage.getItem('script'));
                fs.writeFile('eye_and_ntd/new_eye.html', '\r\n'+content.replace('<selectelem>','').replace('</selectelem>','')+'', function (err) {
                    console.log('EYE has been transformed');
                });
        });
        }
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
                if (element.attribs.id) {
                    indicatorsInFormArr.push(element.attribs.id.substring(9));
                }
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
                        } else if (indicator === $(val).attr('oldid')) {
                            $(val).attr('indicatorFormula', '('+indicatorsData[indicator]+ ')');
                            $(val).attr('id', indicator);
                        }
                    }

                    $(val).removeAttr('indicatorid');
                    $(val).removeAttr('value');
                    $(val).attr('name', 'indicatorFormula');
                    $(val).attr('disabled', 'disabled');
                });

                $('input[indicatorname]').each(function (index, val) {
                    var indicatorsData = JSON.parse(localStorage.getItem(dataSetName.split(',')[1]));
                    for (var indicator in indicatorsData) {
                        if (indicator === $(val).attr('id').substr(9)) {
                            $(val).attr('indicatorFormula', '('+indicatorsData[indicator]+ ')');
                            $(val).attr('id', indicator);
                        } else if (indicator === $(val).attr('oldid')) {
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
        if (dataSetName === 'QntdhuQfgvT,HMIS_MagonjwayaKuhara(DTC)') {
            fs.readFile('forms/'+dataSetName.split(',')[1]+'/new.html', 'utf-8', function (err, data) {

                var apiPath = "/api/dataSets/"+ dataSetName.split(',')[0] +"/form";
                var options = {
                    protocol:'https:',
                    host: "dhis.moh.go.tz",
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
                        console.log('The response string: '+ responseString);
                    });
                });

                authRequest.on('error', function (error) {
                    console.log('The following error has occured on posting the form '+ dataSetName.split(',')[0]);
                    console.log('\n'+ error);
                });

                authRequest.write(data);
                authRequest.end();
            });
        }
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