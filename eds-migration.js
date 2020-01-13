require("dotenv").config();
const readXlsxFile = require("read-excel-file/node");
const axios = require("axios");
var async = require("async");
const map = require("async/map");
const https = require("https");
const http = require("http");
var btoa = require("btoa");
// const credentialsSource = process.argv[3];
const tokenSource = new Buffer(process.env.CREDENTIALS_SOURCE).toString(
  "base64"
);
const tokenDestination = new Buffer(
  process.env.CREDENTIALS_DESTINATION
).toString("base64");

const tokenEDS = btoa(process.env.CREDENTIALS_EDS);
//new Buffer(process.env.CREDENTIALS_EDS).toString("base64");
console.log(tokenEDS);

const SOURCE_BASE_URL = process.env.SOURCE_BASE_URL;
const DESTINATION_BASE_URL = process.env.DESTINATION_BASE_URL;
const EDS_BASE_URL = process.env.SOURCE_EDS_URL;
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

let headerEDS = {
  headers: {
    Authorization: "Basic " + tokenEDS
  }
};

let mapping = {};
let oldDataElementVsNewDataElementmrdt = {};

const programs = [
  {
    id: "RwVrL1Y8RTH",
    displayName: "MSDQI 1. OPD",
    fileName: ""
  },
  {
    id: "CT0TNl30rld",
    displayName: "MSDQI 2. mRDT",
    fileName: "mRDT-mapping.xlsx"
  },
  {
    id: "Z4szHfJebFL",
    displayName: "MSDQI 3. RCH",
    fileName: "RCH-mapping.xlsx"
  },
  {
    id: "jYsHdmTJNVh",
    displayName: "MSDQI 4. IPD",
    fileName: ""
  },
  {
    id: "go4MncVomkQ",
    displayName: "MSDQI 5. Logistic Supply Chain",
    fileName: ""
  },
  {
    id: "R8APevjOH0o",
    displayName: "MSDQI 6. Microscopy",
    fileName: ""
  }
];

programs.forEach(program => {
  if (program.fileName != "") {
    let oldDataElementVsNewDataElement = {};
    readXlsxFile("./mapping/" + program.fileName).then(rows => {
      // `rows` is an array of rows
      // each row being an array of cells.
      rows.forEach(row => {
        if (row[0] && row[1]) {
          oldDataElementVsNewDataElement[row[0]] = row[1];
        }
      });
      mapping[program.id] = oldDataElementVsNewDataElement;
    });
  }
});

const referenceRegionEDS = [
  {
    name: "Geita Region",
    id: "INI4Hp84Z0U"
  },
  {
    name: "Iringa Region",
    id: "juqdz73CGrm"
  },
  {
    name: "Kagera Region",
    id: "sen6B7qbcta"
  },
  {
    name: "Kigoma Region",
    id: "eu0E6qDoWsf"
  },
  {
    name: "Lindi Region",
    id: "zhQ4GgjafOa"
  },
  {
    name: "Mara Region",
    id: "CVKcM66aReQ"
  },
  {
    name: "Morogoro Region",
    id: "CzTcBeVD3O0"
  },
  {
    name: "Mtwara Region",
    id: "og0WOWG9XxV"
  },
  {
    name: "Mwanza Region",
    id: "yuWzqHuFcpm"
  },
  {
    name: "Ruvuma Region",
    id: "TFAeiGSlDND"
  },
  {
    name: "Shinyanga Region",
    id: "c8BCqZzP2Kz"
  },
  {
    name: "Simiyu Region",
    id: "HAEog3LreVI"
  },
  {
    name: "Singida Region",
    id: "i9J83767Z68"
  },
  {
    name: "Tabora Region",
    id: "DBi0gUi1EFV"
  }
];

const referenceRegions = [
  {
    name: "Kigoma Region",
    id: "RD96nI1JXVV"
  },
  {
    id: "hAFRrgDK0fy",
    name: "Mwanza Region"
  },
  {
    id: "sWOWPBvwNY2",
    name: "Iringa Region"
  },
  {
    id: "EO3Ps3ny0Nr",
    name: "Shinyanga Region"
  },
  {
    id: "DWSo42hunXH",
    name: "Katavi Region"
  },
  {
    id: "RD96nI1JXVV",
    name: "Kigoma"
  },
  {
    id: "vYT08q7Wo33",
    name: "Mara Region"
  },
  {
    id: "A3b5mw8DJYC",
    name: "Mbeya Region"
  },
  {
    name: "Njombe Region",
    id: "qarQhOt2OEh"
  }
];

const getOrganisationUnits = async referenceRegion => {
  const formattedUrl =
    "api/organisationUnits/" +
    referenceRegion.id +
    ".json?fields=children[id,name,children[id,name,code]]";
  try {
    return await axios.get(EDS_BASE_URL + formattedUrl, headerEDS);
  } catch (error) {
    console.error(error);
  }
};

const getEventsData = async facility => {
  const formattedUrl = "api/events.json?orgUnit=" + facility.id;
  console.log("formattedUrl event url", EDS_BASE_URL + formattedUrl);
  try {
    return await axios.get(EDS_BASE_URL + formattedUrl, headerEDS);
  } catch (error) {
    // console.log("error ", error.Error);
  }
};

async.map(
  referenceRegionEDS,
  function(referenceRegion, callback) {
    if (!referenceRegion.id) {
      callback("Organisation unit is not valid", "");
    } else {
      const data = getOrganisationUnits(referenceRegion);
      data.then(ous => {
        const councilsLoaded = ous["data"]["children"];
        callback("", councilsLoaded);
      });
    }
  },
  function(err, councilResults) {
    if (err) {
      console.log(err);
    } else {
      councilResults.forEach(councilResponse => {
        async.map(
          councilResponse,
          function(council, callback) {
            if (!council.id) {
              callback("Organisation unit is not valid", "");
            } else {
              console.log("council ", council);
              callback("", council);
            }
          },
          function(err, councilInfo) {
            if (err) {
              console.log(err);
            } else {
              // console.log("councilInfo ", councilInfo);
              councilInfo.forEach(council => {
                async.map(
                  council.children,
                  function(facility, callback) {
                    if (!facility.id) {
                      callback("Organisation unit is not valid", "");
                    } else {
                      // get facility data
                      console.log("facility ", facility);
                      const eventsData = getEventsData(facility);
                      eventsData.then(eventsData => {
                        console.log("here ");
                        // console.log(
                        //   "eventsData ...............................................",
                        //   JSON.stringify(eventsData)
                        // );
                        // callback("", {
                        //   code: facility.code,
                        //   data: eventsData
                        // });
                      });
                    }
                  },
                  function(err, eventsData) {
                    if (err) {
                      console.log(err);
                    } else {
                      // processAndSaveData(eventsData);
                    }
                  }
                );
              });
            }
          }
        );
      });
    }
  }
);

async function processAndSaveData(dataArr) {
  async.map(
    dataArr,
    function(data, callback) {
      if ((data.data && data.data.events.length == 0) || !data.data) {
        callback("No events found for the facility with code " + data.code, "");
      } else {
        const events = processEvents(data.data.events, data.code);
        events.then(data => {
          async.map(
            data,
            function(event, callback) {
              if (!event) {
                callback("Event not valid", "");
              } else {
                if (data.length == 1) {
                  const message = saveEventsData(data[0]);
                  message.then(message => {
                    callback("", message);
                  });
                }
              }
            },
            function(err, data) {
              if (err) {
                // console.log(err);
              } else {
                // saveEventsData(data);
              }
            }
          );
        });
      }
    },
    function(err, data) {
      if (err) {
        // console.log(err);
      } else {
        // console.log("events 2", JSON.stringify(data));
      }
    }
  );
}

async function processEvents(events, code) {
  let eventsData = [];
  // console.log(mapping);
  asyncForEach(events, async event => {
    await eventsData.push(formatEvents(event, code, mapping));
  });
  return await eventsData;
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

async function saveEventsData(eventData) {
  const formattedUrl = "api/events.json";
  if (eventData.dataValues && eventData.dataValues.length > 10) {
    try {
      const data = await axios.post(
        DESTINATION_BASE_URL + formattedUrl,
        eventData,
        {
          headers: headerConfigsDestination.headers
        }
      );
      console.log("Sent ", eventData.event, eventData.orgUnit);
      return data;
    } catch (error) {
      // console.log("error ", error);
    }
  } else {
    console.log("The event does not contain valid supervision data");
  }
}

function formatEvents(event, code, mapping) {
  let eventData = {
    storedBy: "",
    dueDate: "",
    program: "",
    event: "",
    programStage: "",
    orgUnit: "",
    status: "",
    eventDate: "",
    created: "",
    dataValues: [],
    notes: [],
    completedBy: ""
  };
  // event["orgUnit"] = code;
  console.log(event.storedBy);
  if (event.storedBy == "msdqi") {
    eventData.storedBy = "josephatjulius";
    eventData.dueDate = event.dueDate;
    eventData.program = event.program;
    eventData.event = event.event;
    eventData.programStage = event.programStage;
    eventData.orgUnit = event.orgUnit;
    eventData.status = event.status;
    eventData.eventDate = event.eventDate;
    eventData.created = event.created;
    eventData.notes = event.notes;
    eventData.completedBy = "josepheatjulius";
    dataValues = [];
    event["dataValues"].forEach(dataValue => {
      dataValue["storedBy"] = "josephatjulius";
      // dataValue["dataElement"] =
      //   mapping[event.program][dataValue["dataElement"]];
      dataValues.push(dataValue);
    });
    eventData.dataValues = dataValues;
  }
  return eventData;
}
