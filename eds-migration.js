require("dotenv").config();
const axios = require("axios");
var async = require("async");
const map = require("async/map");
// const credentialsSource = process.argv[3];
const tokenSource = new Buffer(process.env.CREDENTIALS_SOURCE).toString(
  "base64"
);
const tokenDestination = new Buffer(
  process.env.CREDENTIALS_DESTINATION
).toString("base64");
const SOURCE_BASE_URL = process.env.SOURCE_BASE_URL;
const DESTINATION_BASE_URL = process.env.DESTINATION_BASE_URL;
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
  {
    id: "RwVrL1Y8RTH",
    displayName: "MSDQI 1. OPD"
  },
  {
    id: "CT0TNl30rld",
    displayName: "MSDQI 2. mRDT"
  },
  {
    id: "Z4szHfJebFL",
    displayName: "MSDQI 3. RCH"
  },
  {
    id: "jYsHdmTJNVh",
    displayName: "MSDQI 4. IPD"
  },
  {
    id: "go4MncVomkQ",
    displayName: "MSDQI 5. Logistic Supply Chain"
  },
  {
    id: "R8APevjOH0o",
    displayName: "MSDQI 6. Microscopy"
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

async.map(
  referenceRegions,
  function(referenceRegion, callback) {
    if (!referenceRegion.id) {
      callback("Organisation unit is not valid", "");
    } else {
      const data = getOrganisationUnits(referenceRegion);
      data.then(councils => callback("", councils));
    }
  },
  function(err, councilResults) {
    if (err) {
      console.log(err);
    } else {
      councilResults.forEach(councilResponse => {
        async.map(
          councilResponse.children,
          function(council, callback) {
            if (!council.id) {
              callback("Organisation unit is not valid", "");
            } else {
              callback("", council);
            }
          },
          function(err, councilInfo) {
            if (err) {
              console.log(err);
            } else {
              councilInfo.forEach(council => {
                async.map(
                  council.children,
                  function(facility, callback) {
                    if (!facility.id) {
                      callback("Organisation unit is not valid", "");
                    } else {
                      // get facility data
                      const eventsData = getEventsData(facility);
                      eventsData.then(eventsData => {
                        callback("", { code: facility.code, data: eventsData });
                      });
                    }
                  },
                  function(err, eventsData) {
                    if (err) {
                      console.log(err);
                    } else {
                      processAndSaveData(eventsData);
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

async function getOrganisationUnits(referenceRegion) {
  const formattedUrl =
    "api/organisationUnits/" +
    referenceRegion.id +
    ".json?fields=children[id,name,children[id,name,code]]";
  try {
    const data = await axios.get(DESTINATION_BASE_URL + formattedUrl, {
      headers: headerConfigsDestination.headers
    });
    return data.data;
  } catch (error) {
    // console.log("error ", error.Error);
  }
}

async function getEventsData(facility) {
  const formattedUrl = "api/events.json?orgUnit=" + facility.id;
  try {
    const data = await axios.get(SOURCE_BASE_URL + formattedUrl, {
      headers: headerConfigsSource.headers
    });
    return data.data;
  } catch (error) {
    // console.log("error ", error.Error);
  }
}

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
  asyncForEach(events, async event => {
    await eventsData.push(formatEvents(event, code));
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
  if (eventData.dataValues.length > 10) {
    try {
      const data = await axios.post(
        DESTINATION_BASE_URL + formattedUrl,
        eventData,
        {
          headers: headerConfigsDestination.headers
        }
      );
      console.log("Sent ");
      return data;
    } catch (error) {
      // console.log("error ", error);
    }
  } else {
    console.log("The event does not contain valid supervision data");
  }
}

function formatEvents(event, code) {
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
      dataValues.push(dataValue);
    });
    eventData.dataValues = dataValues;
  }
  return eventData;
}
