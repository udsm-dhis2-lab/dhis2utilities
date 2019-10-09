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
    var Path = "/api/dataSets.json?paging=false&fields=id,name&filter=formType:eq:CUSTOM&filter=id:in:[Dp0VF7ssmcH]";
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
        let formNamesArr = [];
        let formIds = [];
        if (fs.existsSync('forms')){
            // the forms directory exists
        } else{
            fs.mkdirSync('forms');
        }

        formIdsArr.forEach(function (idAndName, index) {
            formNamesArr.push(idAndName.name);
            formIds.push(idAndName.id + ','+idAndName.name.replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace(" ","").replace("  ","").replace(" ","").replace(" ","").replace("/","").replace("  ","").replace("  ","").replace("  ",""));
        });

        localStorage.setItem('formStore',JSON.stringify(formIds));
        localStorage.setItem('formNamesStore',JSON.stringify(formNamesArr));
        console.log('\nWelcome!!');

        console.log('\nThe Total number of datasets for backup is ' + formIdsArr.length);

        console.log('You will have to go ' + Math.round(formIdsArr.length / 10) + ' times');
        for (let countSteps = 0; countSteps < Math.round(formIdsArr.length); countSteps++) {
            let idsArr = JSON.parse(localStorage.getItem('formStore'));
            console.log(idsArr)
            let idsIncluded = '';
            for (let idsCount = 0; idsCount < idsArr.length; idsCount++) {
                if (idsCount < (10*countSteps+10) && idsCount >= 10*countSteps){
                    idsIncluded += idsArr[idsCount].split(',')[0]+',';
                }
            }

            let path = '/api/dataSets.json?paging=false&fields=id,name,indicators[id,name,numerator,denominator,indicatorType[factor]],dataEntryForm[htmlCode]&filter=id:in:['+idsIncluded.substring(0, idsIncluded.length-1)+']';
            // let path = '/api/dataSets.json?paging=false&fields=id,name,indicators[id,name,numerator,denominator,indicatorType[factor]],dataEntryForm[htmlCode]&filter=id:in:[Dp0VF7ssmcH]';
            let formArr = [];
            console.log(path)
            let Promise = require('promise');
            let promise = new Promise(function (resolve, reject) {
                request({
                        headers: headers,
                        uri: URL + path,
                        method: 'GET'
                    },
                    function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            let resDataSets = JSON.parse(body).dataSets;
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
                         console.log('The dataSet '+ form.name+' already in backup');
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

                        });
                    }
                });
            });
        }
    });
}
else if (typeOfActivity === 'transform-opd') {
    // transform OPD

    fs.readFile('forms/RCHS_UkatiliwaKijinsianaUkatilidhidiyaWatoto(GBV)New/original.html', 'utf8', formatHtml);

        function formatHtml(error, data) {
            $ = cheerio.load('' + data + '');
            var totalsArr = [];
            var entryFieldsArr = [];


            var aggregations = {"x99k9fzuuRY":"(#{DoUU3CT1A07.WBecmiuOdR9}+ #{DoUU3CT1A07.FrkpvLPzZLL} + #{DoUU3CT1A07.aNYz4biB8Z2} + #{DoUU3CT1A07.K6ycRs8neq9} + #{DoUU3CT1A07.vKVgeFmy5XI} + #{DoUU3CT1A07.GvRx9tZpnjx})/(1)*(1)","HuTZbYx4qb2":"(#{DoUU3CT1A07.s0DazUiLqVW}+ #{DoUU3CT1A07.YIvH6Dy8Pvj} + #{DoUU3CT1A07.tSSmhBGIpiS} + #{DoUU3CT1A07.q1UqILKV9Fp} + #{DoUU3CT1A07.EASmSprtnYk} + #{DoUU3CT1A07.FXwj1UrOR4g})/(1)*(1)","ib9rI5yDyvs":"(#{x2UGbITvfI8.WBecmiuOdR9}+ #{x2UGbITvfI8.FrkpvLPzZLL} + #{x2UGbITvfI8.aNYz4biB8Z2} + #{x2UGbITvfI8.K6ycRs8neq9} + #{x2UGbITvfI8.vKVgeFmy5XI} + #{x2UGbITvfI8.GvRx9tZpnjx})/(1)*(1)","ckLdHigdsXc":"(#{x2UGbITvfI8.s0DazUiLqVW}+ #{x2UGbITvfI8.YIvH6Dy8Pvj} + #{x2UGbITvfI8.tSSmhBGIpiS} + #{x2UGbITvfI8.q1UqILKV9Fp} + #{x2UGbITvfI8.EASmSprtnYk} + #{x2UGbITvfI8.FXwj1UrOR4g})/(1)*(1)","bXfKtH7Me23":"(#{sYUZyts1MMT.WBecmiuOdR9}+ #{sYUZyts1MMT.FrkpvLPzZLL} + #{sYUZyts1MMT.aNYz4biB8Z2} + #{sYUZyts1MMT.K6ycRs8neq9} + #{sYUZyts1MMT.vKVgeFmy5XI} + #{sYUZyts1MMT.GvRx9tZpnjx})/(1)*(1)","wrp1f7S8Cu2":"(#{sYUZyts1MMT.s0DazUiLqVW}+ #{sYUZyts1MMT.YIvH6Dy8Pvj} + #{sYUZyts1MMT.tSSmhBGIpiS} + #{sYUZyts1MMT.q1UqILKV9Fp} + #{sYUZyts1MMT.EASmSprtnYk} + #{sYUZyts1MMT.FXwj1UrOR4g})/(1)*(1)","MEF6LERLm3X":"(#{ly1Uhmd1RVs.WBecmiuOdR9}+ #{ly1Uhmd1RVs.FrkpvLPzZLL} + #{ly1Uhmd1RVs.aNYz4biB8Z2} + #{ly1Uhmd1RVs.K6ycRs8neq9} + #{ly1Uhmd1RVs.vKVgeFmy5XI} + #{ly1Uhmd1RVs.GvRx9tZpnjx})/(1)*(1)","qT8WjGQHEEg":"(#{ly1Uhmd1RVs.s0DazUiLqVW}+ #{ly1Uhmd1RVs.YIvH6Dy8Pvj} + #{ly1Uhmd1RVs.tSSmhBGIpiS} + #{ly1Uhmd1RVs.q1UqILKV9Fp} + #{ly1Uhmd1RVs.EASmSprtnYk} + #{ly1Uhmd1RVs.FXwj1UrOR4g})/(1)*(1)","Xu5rDiBwBm4":"(#{yyY3HsyEiHj.WBecmiuOdR9}+ #{yyY3HsyEiHj.FrkpvLPzZLL} + #{yyY3HsyEiHj.aNYz4biB8Z2} + #{yyY3HsyEiHj.K6ycRs8neq9} + #{yyY3HsyEiHj.vKVgeFmy5XI} + #{yyY3HsyEiHj.GvRx9tZpnjx})/(1)*(1)","nBtbbjh02Va":"(#{yyY3HsyEiHj.s0DazUiLqVW}+ #{yyY3HsyEiHj.YIvH6Dy8Pvj} + #{yyY3HsyEiHj.tSSmhBGIpiS} + #{yyY3HsyEiHj.q1UqILKV9Fp} + #{yyY3HsyEiHj.EASmSprtnYk}+ #{yyY3HsyEiHj.FXwj1UrOR4g} )/(1)*(1)","qyVpBjJO3Qh":"(#{OQ8Xtctvdlh.WBecmiuOdR9}+ #{OQ8Xtctvdlh.FrkpvLPzZLL} + #{OQ8Xtctvdlh.aNYz4biB8Z2}+ #{OQ8Xtctvdlh.yrIZS0a2dXY} + #{OQ8Xtctvdlh.BL18BJY6x9i} + #{OQ8Xtctvdlh.GvRx9tZpnjx})/(1)*(1)","cNkm6j3QWpI":"(#{OQ8Xtctvdlh.s0DazUiLqVW}+ #{OQ8Xtctvdlh.YIvH6Dy8Pvj} + #{OQ8Xtctvdlh.tSSmhBGIpiS} + #{OQ8Xtctvdlh.gtvCw1K9zz8} + #{OQ8Xtctvdlh.NF3fbGxqVmU} + #{OQ8Xtctvdlh.FXwj1UrOR4g})/(1)*(1)","CMC8Ap3kMQp":"(#{CifISChGCYR.WBecmiuOdR9}+ #{CifISChGCYR.FrkpvLPzZLL} + #{CifISChGCYR.aNYz4biB8Z2} + #{CifISChGCYR.K6ycRs8neq9} + #{CifISChGCYR.vKVgeFmy5XI} + #{CifISChGCYR.GvRx9tZpnjx})/(1)*(1)","u0rT2j5oVNF":"(#{CifISChGCYR.s0DazUiLqVW}+ #{CifISChGCYR.YIvH6Dy8Pvj} + #{CifISChGCYR.tSSmhBGIpiS} + #{CifISChGCYR.q1UqILKV9Fp} + #{CifISChGCYR.EASmSprtnYk} + #{CifISChGCYR.FXwj1UrOR4g})/(1)*(1)","wTSxT6Zaxzw":"(#{Lf8xT5PZToo.WBecmiuOdR9}+ #{Lf8xT5PZToo.FrkpvLPzZLL} + #{Lf8xT5PZToo.aNYz4biB8Z2} + #{Lf8xT5PZToo.K6ycRs8neq9} + #{Lf8xT5PZToo.vKVgeFmy5XI}+#{Lf8xT5PZToo.GvRx9tZpnjx})/(1)*(1)","zX5c7aug0po":"(#{Lf8xT5PZToo.s0DazUiLqVW}+ #{Lf8xT5PZToo.YIvH6Dy8Pvj} + #{Lf8xT5PZToo.tSSmhBGIpiS} + #{Lf8xT5PZToo.q1UqILKV9Fp} + #{Lf8xT5PZToo.EASmSprtnYk} + #{Lf8xT5PZToo.FXwj1UrOR4g})/(1)*(1)","lVGAwGkcLWF":"(#{N08CdGSBvrZ.WBecmiuOdR9}+ #{N08CdGSBvrZ.FrkpvLPzZLL} + #{N08CdGSBvrZ.aNYz4biB8Z2} + #{N08CdGSBvrZ.vKVgeFmy5XI} + #{N08CdGSBvrZ.K6ycRs8neq9} + #{N08CdGSBvrZ.GvRx9tZpnjx})/(1)*(1)","L5OTX4vVzeY":"(#{T1K7yVgE4kd.WBecmiuOdR9}+ #{T1K7yVgE4kd.FrkpvLPzZLL} + #{T1K7yVgE4kd.aNYz4biB8Z2} + #{T1K7yVgE4kd.K6ycRs8neq9} + #{T1K7yVgE4kd.vKVgeFmy5XI} + #{T1K7yVgE4kd.GvRx9tZpnjx})/(1)*(1)","w798GQUckV3":"(#{T1K7yVgE4kd.YIvH6Dy8Pvj}+#{T1K7yVgE4kd.tSSmhBGIpiS}+#{T1K7yVgE4kd.q1UqILKV9Fp}+#{T1K7yVgE4kd.EASmSprtnYk}+#{T1K7yVgE4kd.FXwj1UrOR4g})/(1)*(1)","fz9GabMdyUY":"(#{WMP9qQJXRiY.WBecmiuOdR9}+ #{WMP9qQJXRiY.FrkpvLPzZLL} + #{WMP9qQJXRiY.aNYz4biB8Z2} + #{WMP9qQJXRiY.K6ycRs8neq9}+ #{WMP9qQJXRiY.vKVgeFmy5XI} + #{WMP9qQJXRiY.GvRx9tZpnjx})/(1)*(1)","hAWKFDgFvWX":"(#{WMP9qQJXRiY.s0DazUiLqVW}+ #{WMP9qQJXRiY.YIvH6Dy8Pvj} + #{WMP9qQJXRiY.tSSmhBGIpiS} + #{WMP9qQJXRiY.q1UqILKV9Fp} + #{WMP9qQJXRiY.EASmSprtnYk} + #{WMP9qQJXRiY.FXwj1UrOR4g})/(1)*(1)","sRj31ypLiMn":"(#{vKdJGP5FCOi.WBecmiuOdR9}+ #{vKdJGP5FCOi.FrkpvLPzZLL} + #{vKdJGP5FCOi.aNYz4biB8Z2} + #{vKdJGP5FCOi.K6ycRs8neq9} + #{vKdJGP5FCOi.GvRx9tZpnjx} + #{vKdJGP5FCOi.vKVgeFmy5XI})/(1)*(1)","rKSTDGOKXwA":"(#{vKdJGP5FCOi.s0DazUiLqVW}+ #{vKdJGP5FCOi.YIvH6Dy8Pvj} + #{vKdJGP5FCOi.tSSmhBGIpiS} + #{vKdJGP5FCOi.q1UqILKV9Fp} + #{vKdJGP5FCOi.EASmSprtnYk} + #{vKdJGP5FCOi.FXwj1UrOR4g})/(1)*(1)","rV3WSsl68g3":"(#{cqFyKkyGu9J.WBecmiuOdR9}+ #{cqFyKkyGu9J.FrkpvLPzZLL} + #{cqFyKkyGu9J.aNYz4biB8Z2} + #{cqFyKkyGu9J.K6ycRs8neq9} + #{cqFyKkyGu9J.vKVgeFmy5XI} + #{cqFyKkyGu9J.GvRx9tZpnjx})/(1)*(1)","OMiKdxHAFpz":"(#{cqFyKkyGu9J.s0DazUiLqVW}+ #{cqFyKkyGu9J.YIvH6Dy8Pvj} + #{cqFyKkyGu9J.tSSmhBGIpiS} + #{cqFyKkyGu9J.q1UqILKV9Fp} + #{cqFyKkyGu9J.EASmSprtnYk} + #{cqFyKkyGu9J.FXwj1UrOR4g})/(1)*(1)","yiMIC2sr4dM":"(#{H1J48AbjszO.WBecmiuOdR9}+ #{H1J48AbjszO.FrkpvLPzZLL} + #{H1J48AbjszO.aNYz4biB8Z2} + #{H1J48AbjszO.K6ycRs8neq9} + #{H1J48AbjszO.vKVgeFmy5XI} + #{H1J48AbjszO.GvRx9tZpnjx})/(1)*(1)","ducVoIpUDE9":"(#{H1J48AbjszO.s0DazUiLqVW}+ #{H1J48AbjszO.YIvH6Dy8Pvj} + #{H1J48AbjszO.tSSmhBGIpiS} + #{H1J48AbjszO.q1UqILKV9Fp} + #{H1J48AbjszO.EASmSprtnYk} + #{H1J48AbjszO.FXwj1UrOR4g})/(1)*(1)","HFFycfADXZC":"(#{XNfieJZ5AOV.WBecmiuOdR9}+ #{XNfieJZ5AOV.FrkpvLPzZLL} + #{XNfieJZ5AOV.aNYz4biB8Z2} + #{XNfieJZ5AOV.BL18BJY6x9i} + #{XNfieJZ5AOV.yrIZS0a2dXY} + #{XNfieJZ5AOV.GvRx9tZpnjx})/(1)*(1)","QUcfqqHuvAc":"(#{XNfieJZ5AOV.s0DazUiLqVW}+ #{XNfieJZ5AOV.YIvH6Dy8Pvj} + #{XNfieJZ5AOV.tSSmhBGIpiS} + #{XNfieJZ5AOV.NF3fbGxqVmU} + #{XNfieJZ5AOV.gtvCw1K9zz8} + #{XNfieJZ5AOV.FXwj1UrOR4g})/(1)*(1)","GFKP7lQSmDu":"(#{YObV7hMSedk.WBecmiuOdR9}+ #{YObV7hMSedk.FrkpvLPzZLL} + #{YObV7hMSedk.aNYz4biB8Z2} + #{YObV7hMSedk.K6ycRs8neq9} + #{YObV7hMSedk.vKVgeFmy5XI} + #{YObV7hMSedk.GvRx9tZpnjx})/(1)*(1)","Krj73mYofP8":"(#{YObV7hMSedk.s0DazUiLqVW}+ #{YObV7hMSedk.YIvH6Dy8Pvj} + #{YObV7hMSedk.tSSmhBGIpiS} + #{YObV7hMSedk.q1UqILKV9Fp} + #{YObV7hMSedk.EASmSprtnYk} + #{YObV7hMSedk.FXwj1UrOR4g})/(1)*(1)","q7E1KoxJE4K":"(#{wZ0mfD4QRAZ.WBecmiuOdR9}+ #{wZ0mfD4QRAZ.FrkpvLPzZLL} + #{wZ0mfD4QRAZ.aNYz4biB8Z2} + #{wZ0mfD4QRAZ.K6ycRs8neq9} + #{wZ0mfD4QRAZ.vKVgeFmy5XI} + #{wZ0mfD4QRAZ.GvRx9tZpnjx})/(1)*(1)","VKQ4Hxjh0XG":"(#{wZ0mfD4QRAZ.s0DazUiLqVW}+ #{wZ0mfD4QRAZ.YIvH6Dy8Pvj} + #{wZ0mfD4QRAZ.tSSmhBGIpiS} + #{wZ0mfD4QRAZ.q1UqILKV9Fp} + #{wZ0mfD4QRAZ.EASmSprtnYk} + #{wZ0mfD4QRAZ.FXwj1UrOR4g})/(1)*(1)","Jatqvuc9LBb":"(#{AeIxjUdc4gK.WBecmiuOdR9}+ #{AeIxjUdc4gK.FrkpvLPzZLL} + #{AeIxjUdc4gK.aNYz4biB8Z2} + #{AeIxjUdc4gK.vKVgeFmy5XI} + #{AeIxjUdc4gK.K6ycRs8neq9} + #{AeIxjUdc4gK.GvRx9tZpnjx})/(1)*(1)","hwince5Ui28":"(#{AeIxjUdc4gK.s0DazUiLqVW}+ #{AeIxjUdc4gK.YIvH6Dy8Pvj} + #{AeIxjUdc4gK.tSSmhBGIpiS} + #{AeIxjUdc4gK.EASmSprtnYk} + #{AeIxjUdc4gK.q1UqILKV9Fp} + #{AeIxjUdc4gK.FXwj1UrOR4g})/(1)*(1)","YeoY9cr1gng":"(#{p9eTsPP1aRG.WBecmiuOdR9}+ #{p9eTsPP1aRG.FrkpvLPzZLL} + #{p9eTsPP1aRG.aNYz4biB8Z2} + #{p9eTsPP1aRG.K6ycRs8neq9} + #{p9eTsPP1aRG.vKVgeFmy5XI}+#{p9eTsPP1aRG.GvRx9tZpnjx})/(1)*(1)","IYcseaoNtrA":"(#{FmWICmit1tl.WBecmiuOdR9}+ #{FmWICmit1tl.FrkpvLPzZLL} + #{FmWICmit1tl.aNYz4biB8Z2} + #{FmWICmit1tl.K6ycRs8neq9} + #{FmWICmit1tl.vKVgeFmy5XI} + #{FmWICmit1tl.GvRx9tZpnjx})/(1)*(1)","QgGTH4RNlTH":"(#{FmWICmit1tl.s0DazUiLqVW}+ #{FmWICmit1tl.YIvH6Dy8Pvj} + #{FmWICmit1tl.tSSmhBGIpiS} + #{FmWICmit1tl.q1UqILKV9Fp} + #{FmWICmit1tl.EASmSprtnYk} + #{FmWICmit1tl.FXwj1UrOR4g})/(1)*(1)","YKxphSWdkJZ":"(#{YRW8lkcrkWF.WBecmiuOdR9}+ #{YRW8lkcrkWF.FrkpvLPzZLL} + #{YRW8lkcrkWF.aNYz4biB8Z2} + #{YRW8lkcrkWF.K6ycRs8neq9} + #{YRW8lkcrkWF.vKVgeFmy5XI} + #{YRW8lkcrkWF.GvRx9tZpnjx})/(1)*(1)","kQFc1whOgth":"(#{YRW8lkcrkWF.s0DazUiLqVW}+ #{YRW8lkcrkWF.YIvH6Dy8Pvj} + #{YRW8lkcrkWF.tSSmhBGIpiS} + #{YRW8lkcrkWF.q1UqILKV9Fp} + #{YRW8lkcrkWF.EASmSprtnYk} + #{YRW8lkcrkWF.FXwj1UrOR4g})/(1)*(1)","hv6mOid9cQC":"(#{vPNpdA7qrFF.WBecmiuOdR9}+ #{vPNpdA7qrFF.FrkpvLPzZLL} + #{vPNpdA7qrFF.aNYz4biB8Z2} + #{vPNpdA7qrFF.K6ycRs8neq9} + #{vPNpdA7qrFF.vKVgeFmy5XI} + #{vPNpdA7qrFF.GvRx9tZpnjx})/(1)*(1)","PchJ2aKJ42E":"(#{vPNpdA7qrFF.s0DazUiLqVW}+ #{vPNpdA7qrFF.YIvH6Dy8Pvj} + #{vPNpdA7qrFF.tSSmhBGIpiS} + #{vPNpdA7qrFF.q1UqILKV9Fp} + #{vPNpdA7qrFF.EASmSprtnYk} + #{vPNpdA7qrFF.FXwj1UrOR4g})/(1)*(1)","sCIskw4Nj1L":"(#{qJbkDpJoZlN.WBecmiuOdR9}+ #{qJbkDpJoZlN.FrkpvLPzZLL} + #{qJbkDpJoZlN.aNYz4biB8Z2} + #{qJbkDpJoZlN.K6ycRs8neq9} + #{qJbkDpJoZlN.vKVgeFmy5XI} + #{qJbkDpJoZlN.GvRx9tZpnjx})/(1)*(1)","zyeaC1LqvYg":"(#{qJbkDpJoZlN.s0DazUiLqVW}+ #{qJbkDpJoZlN.YIvH6Dy8Pvj} + #{qJbkDpJoZlN.tSSmhBGIpiS} + #{qJbkDpJoZlN.q1UqILKV9Fp} + #{qJbkDpJoZlN.EASmSprtnYk} + #{qJbkDpJoZlN.FXwj1UrOR4g})/(1)*(1)","pFEbKNY7xkP":"(#{x8BqhbTBKyr.WBecmiuOdR9}+ #{x8BqhbTBKyr.FrkpvLPzZLL} + #{x8BqhbTBKyr.aNYz4biB8Z2} + #{x8BqhbTBKyr.K6ycRs8neq9} + #{x8BqhbTBKyr.vKVgeFmy5XI} + #{x8BqhbTBKyr.GvRx9tZpnjx})/(1)*(1)","h05fa9leRip":"(#{x8BqhbTBKyr.s0DazUiLqVW}+ #{x8BqhbTBKyr.YIvH6Dy8Pvj} + #{x8BqhbTBKyr.tSSmhBGIpiS} + #{x8BqhbTBKyr.q1UqILKV9Fp} + #{x8BqhbTBKyr.EASmSprtnYk} + #{x8BqhbTBKyr.FXwj1UrOR4g})/(1)*(1)","kIi7i8dXJVt":"(#{ZwYZZG8v7wX.WBecmiuOdR9}+ #{ZwYZZG8v7wX.FrkpvLPzZLL} + #{ZwYZZG8v7wX.aNYz4biB8Z2} + #{ZwYZZG8v7wX.K6ycRs8neq9} + #{ZwYZZG8v7wX.vKVgeFmy5XI} + #{ZwYZZG8v7wX.GvRx9tZpnjx})/(1)*(1)","GfUesUayGKJ":"(#{ZwYZZG8v7wX.s0DazUiLqVW}+ #{ZwYZZG8v7wX.YIvH6Dy8Pvj} + #{ZwYZZG8v7wX.tSSmhBGIpiS} + #{ZwYZZG8v7wX.q1UqILKV9Fp} + #{ZwYZZG8v7wX.EASmSprtnYk} + #{ZwYZZG8v7wX.FXwj1UrOR4g})/(1)*(1)"};
        $('sectionelem').each(function(i, elem) {
            Object.keys(aggregations).forEach(function (key) {
            console.log(key);
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
                    $(element).removeAttr('title');
                    $(element).removeAttr('indicatorid');
                    $(element).attr('name', 'indicatorFormula');
                    $(element).attr('disabled', 'disabled');
                }
            });
        });

        var content = $.html(elem);
                var calculatingScript = JSON.parse(localStorage.getItem('script'));
                fs.writeFile('forms/RCHS_UkatiliwaKijinsianaUkatilidhidiyaWatoto(GBV)New/new.html', ''+calculatingScript+'\r\n'+content+'', function (err) {
                    console.log('RCHS_UkatiliwaKijinsianaUkatilidhidiyaWatoto(GBV)New');
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
} else if (typeOfActivity ==='transform') {

    let dataSetsArr = localStorage.getItem('formStore');
    console.log('here')

    JSON.parse(dataSetsArr).forEach(function (dataSetName, index) {
        if (dataSetName.split(',')[0] !== 'Hwcn7ajwZ1p') {
            fs.readFile('forms/'+ dataSetName.split(',')[1] + '/original.html', 'utf8', formatHtml);

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
        }
    });
} else if (typeOfActivity === 'post') {
    var dataSetsArr = localStorage.getItem('formStore');
    JSON.parse(dataSetsArr).forEach(function (dataSetName, index) {
        if (dataSetName.split(',')[0] === 'NIUGWrDf8JJ') {
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