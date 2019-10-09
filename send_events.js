var URL = process.argv[2];
var async = require('async');
var credentials = process.argv[3];
var typeOfRequest = process.argv[4];
var https = require('https');
var axios = require('axios');
var Promise = require('promise');

var fs = require('fs');
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./store');
}

function getDataByUrl(url) {
    var options = {
        'url': url,
        'headers': headers
    };

    return new Promise(function (resolve, reject) {
        request.get(options, function (err, res, body) {
            console.log(body);
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(body));
            }
        })
    })
}


var task_arr = [{name:'https://dhis.hisptz.org/dev/api/organisationUnits.json?fields=id,name&level=1', delay:500},{name:'https://dhis.hisptz.org/dev/api/organisationUnits.json?fields=id,name&level=2', delay:400},{name:'https://dhis.hisptz.org/dev/api/organisationUnits.json?fields=id,name&level=3', delay:200},{name:'https://dhis.hisptz.org/dev/api/organisationUnits.json?fields=id,name&level=4', delay:300},{name:'https://dhis.hisptz.org/dev/api/organisationUnits.json?fields=id,name&level=4', delay:200}];

/* Execute task concurrently with limit numbers. For example below code will execute 3 task (task_1, task_2, task_3) concurrently at first.
   When one task (task_3 ) execute complete, another task( task_4 ) will be executed at once.*/
async.eachLimit(task_arr, 3, function(task, callback){

    console.log("Execute task : " + task.name);
    // getDataByUrl(task.name)

    setTimeout(function(){
        console.log("Task timeout : " + task.name);
        // Must invoke the callback function, otherwise this function will be executed only with the first item in collection.
        callback(null, task.name);
    }, task.delay);

},function(error){
    console.log(error);
});
var headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'Ubuntu Chromium/70.0.3538.67',
    "Authorization": 'Basic ' + new Buffer(credentials).toString('base64')
};
console.log(headers)
var orgUnitsArr = [
    {'id':'yuWzqHuFcpm','name': 'Mwanza'},
    {'id':'CVKcM66aReQ', 'name': 'Mara'},
    {'id':'sen6B7qbcta', 'name': 'kagera'},
    {'id':'eu0E6qDoWsf', 'name': 'Kigoma'},
    {'id':'HAEog3LreVI', 'name': 'Simiyu'},
    {'id':'c8BCqZzP2Kz', 'name': 'Shinyanga'},
    {'id':'INI4Hp84Z0U', 'name': 'geita'}
    ];
var programs = [
    {'id':'RwVrL1Y8RTH','name': 'OPD'},
    {'id':'CT0TNl30rld','name': 'mRDT'},
    {'id':'Z4szHfJebFL','name': 'ANC'},
    {'id':'jYsHdmTJNVh','name': 'SevereMalaria'},
    {'id':'go4MncVomkQ','name': 'LogisticSupply'},
    {'id':'R8APevjOH0o','name': 'Microscopy'},
    {'id':'CAGL7sn5Ui2','name': 'DQA'}
    ];
var request = require('request');
function initializeReq(ou) {
    var options = {
        'url': 'https://dhis.hisptz.org/dev/api/events.json?orgUnit=' +ou + '&program=RwVrL1Y8RTH' + '&paging=false',
        'headers': headers
    };
    
    return new Promise(function (resolve, reject) {
        request.get(options, function (err, res, body) {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(body));
            }
        })
    })
}

function get_ous(ou) {
    var options = {
        'url': 'https://dhis.hisptz.org/dev/api/organisationUnits/'+ ou + '.json?fields=id,name,children[id,name]',
        'headers': headers
    };

    return new Promise(function (resolve, reject) {
        request.get(options, function (err, res, body) {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(body));
            }
        })
    })
}

function promiseBasedPost(data) {
    try {
        axios({
            'method': 'post',
            'url':'https://dhis.hisptz.org/dev/api/events?orgUnitIdScheme=code',
            'data': data,
            'headers': headers
        }).then(function (response) {
            console.log(JSON.stringify(response));
        });
    } catch (e) {
        console.log('error', e)
    }
}

function postData(data) {
    var promise = new Promise(function (reject, resolve) {
        request.post({
            'headers': headers,
            'url': 'https://dhis.hisptz.org/dev/api/events?orgUnitIdScheme=code',
            'json': JSON.parse(data)
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var object = JSON.parse(body);
                console.log(object);
                resolve(object);
            } else {
                if (response) {
                    console.log(response.statusCode + ":", JSON.stringify(error));
                    reject();
                } else {
                    console.log(response);
                }
            }
        });
    });

    promise.then(function (res) {
        console.log(res)
        return true;
    })
}

function main() {
    var orgUnitsArr = [
        {'id':'hAFRrgDK0fy','name': 'Mwanza'},
        {'id':'vYT08q7Wo33', 'name': 'Mara'}
    ];

    var programs = [
        {'id':'RwVrL1Y8RTH','name': 'OPD'},
        {'id':'CT0TNl30rld','name': 'mRDT'},
        {'id':'Z4szHfJebFL','name': 'ANC'},
        {'id':'jYsHdmTJNVh','name': 'SevereMalaria'},
        {'id':'go4MncVomkQ','name': 'LogisticSupply'},
        {'id':'R8APevjOH0o','name': 'Microscopy'},
        {'id':'CAGL7sn5Ui2','name': 'DQA'}
    ];
    var facilitiesArr = [];
    orgUnitsArr.forEach(function (ou) {
        get_ous(ou.id).then(function (ous) {
            ous['children'].forEach(function (ouChild) {
                get_ous(ouChild.id).then(function (facilities) {
                    facilities['children'].forEach(function (facility) {
                        initializeReq(facility.id).then(function (res) {
                            if (res.events.length > 0) {
                                console.log('res');
                                facilitiesArr.push(facility.id);
                                postData(JSON.stringify(res))
                                fs.writeFile('eventsdata/'+ facility.id + '.json', JSON.stringify(res), function (err) {
                                    // data saved or error
                                });
                            }
                        }, function (error) {
                            console.log('ERROR', error);
                        })
                    })
                })
            })
        })

    })
}

// main();

if (typeOfRequest ==='GET') {
    orgUnitsArr.forEach(function (orgUnit) {
        programs.forEach(function (program) {
            // create files
            if (fs.existsSync('eventsdata')){ // check if exists
                //directory exists
                if (fs.existsSync('eventsdata/' + orgUnit.name)){ // check if exists
                    if (fs.existsSync('eventsdata/' + orgUnit.name + '/' + program.name)){ // check if exists
                        //directory exists
                    } else {
                        fs.mkdirSync('eventsdata/' + orgUnit.name + '/' + program.name);
                    }
                } else { // if not exist create one
                    fs.mkdirSync('eventsdata/' + orgUnit.name);
                }
            }
            else {
                fs.mkdirSync('eventsdata');
                if (fs.existsSync('eventsdata/' + orgUnit.name)){ // check if exists
                    if (fs.existsSync('eventsdata/' + orgUnit.name + '/' + program.name)){ // check if exists
                        //directory exists
                    } else {
                        fs.mkdirSync('eventsdata/' + orgUnit.name + '/' + program.name);
                    }
                } else { // if not exist create one
                    fs.mkdirSync('eventsdata/' + orgUnit.name);
                }
            }

            var Path = 'https://dhis.hisptz.org/eds/api/events.json?orgUnit=' + orgUnit.id+ '&ouMode=DESCENDANTS&program=' + program.id+ '&paging=false';
            var Promise = require('promise');
            var promise = new Promise(function (resolve, reject) {
                request({
                        headers: headers,
                        uri: Path,
                        method: 'GET'
                    },
                    function (error, response, body) {
                    console.log('here');
                        if (!error && response.statusCode === 200) {
                            var events = JSON.parse(body);
                            console.log(events)
                            resolve(events);
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
            // all data available
            promise.then(function(events) {
                console.log(events)
            });
        });
    });
} else if (typeOfRequest == 'POST') {
    var checkIfRequestIsD = true;
    fileNames.forEach(function (fileName) {
            if (fileName.indexOf('simiyu/ANC/Meatu_District_Council') >= 0) {
                fs.readFile( fileName, 'utf8', getData);
                function getData(error, data) {
                    // console.log(checkIfRequestIsD);
                        if (data !== undefined) {
                            var extractedData = JSON.parse(data)['events'][0];
                            var len = extractedData.dataValues.length / 100;
                            for (var count = 0; count < len; count++) {
                                var valuesToSend = [];
                                for (var valuesCount = 0; valuesCount < extractedData.dataValues.length; valuesCount++) {
                                    if (valuesCount < (100*count+100) && valuesCount >= 100*count){
                                        valuesToSend.push(JSON.parse(data).events[0].dataValues[valuesCount])
                                    }
                                }
                                // console.log(count);

                                // console.log('checkIfRequestIsD before', checkIfRequestIsD);
                                // postData(data)
                                var dataFormat = {
                                    "storedBy": extractedData.storedBy,
                                    "dueDate": extractedData.dueDate,
                                    "program": extractedData.program,
                                    "event": extractedData.event,
                                    "programStage": extractedData.programStage,
                                    "orgUnit": extractedData.orgUnit,
                                    "status": extractedData.status,
                                    "orgUnitName": extractedData.orgUnitName,
                                    "eventDate": extractedData.eventDate,
                                    "attributeCategoryOptions": extractedData.attributeCategoryOptions,
                                    "optionSize": extractedData.optionSize,
                                    "created": extractedData.created,
                                    "completedDate": extractedData.completedDate,
                                    "deleted": false,
                                    "attributeOptionCombo": extractedData.attributeOptionCombo,
                                    "completedBy": extractedData.completedBy,
                                    "coordinate": {
                                        "latitude": 0,
                                        "longitude": 0
                                    },
                                    "dataValues": [],
                                    "notes": []
                                };
                                checkIfRequestIsD = false;
                                dataFormat.dataValues = valuesToSend;
                                var event = {
                                    "events": [dataFormat]
                                };
                                // console.log(event)
                                // checkIfRequestIsD = postData(JSON.stringify(event))
                                // postData(event);
                                // console.log('checkIfRequestIsD after sending', checkIfRequestIsD);
                            }
                        }
                }
            }
    });

    // fs.readFile( 'simiyu/ANC/Meatu_District_Council/Bulyashi_Dispensary.json', 'utf8', getData);
}
