/**
 * Created by josephat on 10/7/17.
 */

var URL = process.argv[2];
var credentials = process.argv[3];
var typeOfActivity = process.argv[4];
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


var headers2 = {
    'Content-Type': 'text/html',
    "Authorization": 'Basic ' + new Buffer(credentials).toString('base64')
}
    // get datasets
    var path = '/api/dataSets.json?paging=false&fields=id,name,dataEntryForm[htmlCode]&filter=id:in:[j227D4SRwlW]';
    var Promise = require('promise');
    var promise = new Promise(function (resolve, reject) {
        request({
                headers: headers,
                uri: URL + path,
                method: 'GET'
            },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var object = JSON.parse(body);
                    resolve(object);
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
    promise.then(function(forms) {
        var dataSets = forms.dataSets;

        for (var i = 0; i< dataSets.length;i++){
            var form = dataSets[i];
            if (fs.existsSync('forms/' + form.id)){
                // the forms directory exists
            } else{
                fs.mkdirSync('forms/' + form.id);
            }
            $ = cheerio.load(form.dataEntryForm.htmlCode);
            var dataValuesObject = {
                "orgUnit": "",
                "dataSet": form.id,
                "period": "",
                "completeData": "",
                "dataValues": []
            };
            var dataValues = []; var rowCount = 0; var columnCount = 0;
            $('tr').each(function (rowIndex, element) {
                $c = cheerio.load(element);
                if ($c('th').length > 0) {
                    console.log($c('th'))
                } else {
                    rowCount++;
                    $c('td').each(function (columnIndex, elem) {
                        $input = cheerio.load(elem);
                        $input('input[name="entryfield"]').each(function (index, inputElement) {
                            var dataElementArray = prepareDataArray(inputElement);
                            var item =   {dataElement: dataElementArray[0], categoryOptionCombo:dataElementArray[1], row: rowCount,column:columnIndex};
                            dataValues.push(item);
                        })
                        // $input('input').each(function (index, inputElement) {
                        //     console.log(inputElement)
                        //     var dataElementArray = prepareDataArray(inputElement);
                        //     var item =   {dataElement: dataElementArray[0], categoryOptionCombo:dataElementArray[1], row: rowIndex,column:columnIndex};
                        //     dataValues.push(item);
                        // })
                    })
                }
            });
            dataValuesObject.dataValues = dataValues;
            fs.writeFile('forms/' + form.id +'/' + form.name+ '.json', JSON.stringify(dataValuesObject), function (err) {

            });
        }
    });

function prepareDataArray(dataElement){
    return dataElement.attribs.id.split('-');
}