//Example of function implementation

var facilitiesArrayDict = {};
var resultRows = [];
var splittedOu = parameters.ou.split(';');

// logics starts here

Promise.all([
    eligibleFacilitiesPromise(splittedOu[0], parameters.pe, splittedOu[1]),
    stockOutInfoPromise(splittedOu[0], parameters.rule.json.data, parameters.pe)
])
    .then(function(response) {
        var expectedRegionsForStockOut = response[0];
        var stockOutResultData = response[1];

        var ouIndex = getHeaderIndex(expectedRegionsForStockOut.headers, 'ou');
        var peIndex = getHeaderIndex(expectedRegionsForStockOut.headers, 'pe');
        var dxIndex = getHeaderIndex(expectedRegionsForStockOut.headers, 'dx');
        var dataIndex = getHeaderIndex(expectedRegionsForStockOut.headers, 'value');
        expectedRegionsForStockOut.rows.forEach(function(row) {
            // Get org unit uid for searching for its facility in the stcok out result
            var ouValue = row[ouIndex];
            var peValue = row[peIndex];
            var dataValue = row[dataIndex];

            // Get list of facilities belonging in the orgunit
            var facilityIds = getFacilityArray(
                stockOutResultData.metaData.ouHierarchy,
                ouValue
            );

            // Get index to search in the facility array
            var facilityOuHeaderIndex = getHeaderIndex(
                stockOutResultData.headers,
                'ou'
            );
            var facilityDataIndex = getHeaderIndex(
                stockOutResultData.headers,
                'value'
            );
            var facilityPeIndex = getHeaderIndex(stockOutResultData.headers, 'pe');

            // Find number of facilities reported stockout
            var facilityReportedStockOut = 0;
            facilityIds.forEach(function(facilityId) {
                facilityReportedStockOut += getFacilitiesWithStockOut(
                    stockOutResultData.rows, {
                        pe: facilityPeIndex,
                        ou: facilityOuHeaderIndex,
                        value: facilityDataIndex
                    },
                    facilityId,
                    peValue
                );
            });

            // Calculate stockOut rate
            var stockOutRate = (
                facilityReportedStockOut /
                parseInt(dataValue, 10) *
                100
            ).toFixed(1);

            row[dataIndex] = stockOutRate.toString();
            row[dxIndex] = parameters.rule.id;
            resultRows.push(row);
        });

        expectedRegionsForStockOut.metaData.dx = [parameters.rule.id];
        expectedRegionsForStockOut.metaData.dimensions.dx = [parameters.rule.id];
        expectedRegionsForStockOut.metaData.names[parameters.rule.id] =
            parameters.rule.name;
        expectedRegionsForStockOut.rows = resultRows;
        console.log('expectedRegionsForStockOut', expectedRegionsForStockOut);
        parameters.success(expectedRegionsForStockOut);
    })
    .catch(function(error) {
        parameters.error(error);
    });

function eligibleFacilitiesPromise(ou, pe, level) {
    var url =
        '../../../api/analytics.json?dimension=dx:ZOvFj2vtlor.EXPECTED_REPORTS&dimension=ou:' +
        ou +
        '&dimension=pe:' +
        pe +
        '&displayProperty=SHORTNAME';

    if (level) {
        url =
            '../../../api/analytics.json?dimension=dx:ZOvFj2vtlor.EXPECTED_REPORTS&dimension=ou:' +
            level +
            ';' +
            ou +
            '&dimension=pe:' +
            pe +
            '&displayProperty=SHORTNAME';
    }

    return new Promise(function(resolve, reject) {
        $.ajax({
            url: url,
            type: 'GET',
            success: function(analyticsResults) {
                resolve(standardizeIncomingAnalytics(analyticsResults, true));
            },
            error: function(error) {
                reject(error);
            }
        });
    });
}

function stockOutInfoPromise(ou, dx, pe) {
    return new Promise(function(resolve, reject) {
        var url = '../../../api/analytics.json?dimension=dx:' +
            dx +
            '&dimension=pe:' +
            pe +
            '&dimension=ou:LEVEL-4;' +
            ou +
            '&hierarchyMeta=true';
        console.log('stockout', url);
        $.ajax({
            url: url,
            type: 'GET',
            success: function(analyticsResults) {
                resolve(standardizeIncomingAnalytics(analyticsResults, true));
            },
            error: function(error) {
                reject(error);
            }
        });
    });
}

function getFacilitiesWithStockOut(
    rows,
    facilityIndeses,
    facilityId,
    parentPeValue
) {
    var facilitiesWithStockOut = 0;
    var matchedIndeses = [];

    rows.forEach(function(row, index) {
        // match facility information with obtained parent Pe value and with stock out
        if (
            row[facilityIndeses.ou] == facilityId &&
            row[facilityIndeses.pe] == parentPeValue &&
            parseInt(row[facilityIndeses.value], 10) > 0
        ) {
            facilitiesWithStockOut++;
            matchedIndeses.push(index);
        }
    });

    // // Remove matched rows for performance improvements
    // matchedIndeses.forEach(function(index) {
    //     expectedRegionsForStockOut.rows.splice(0, index);
    // });

    return facilitiesWithStockOut;
}

function getHeaderIndex(headers, dimension) {
    var headerIndex = -1;
    headers.forEach(function(header, index) {
        if (header.name === dimension) {
            headerIndex = index;
        }
    });

    return headerIndex;
}

function getFacilityArray(stockOutOuHierarchy, ouValue) {
    var facilityArray = facilitiesArrayDict[ouValue];

    if (!facilityArray) {
        facilityArray = [];
        Object.keys(stockOutOuHierarchy).forEach(function(hierarchyKey) {
            if (stockOutOuHierarchy[hierarchyKey].indexOf(ouValue) !== -1) {
                facilityArray.push(hierarchyKey);
            }
        });
    }

    return facilityArray;
}

function standardizeIncomingAnalytics(analyticsObject, preferNormalStructure = true) {
    // if Serverside Event clustering do nothing
    if (analyticsObject.count) {
        return analyticsObject;
    }
    var sanitizedAnalyticsObject = {
        headers: [],
        metaData: {
            dimensions: {},
            names: {},
            dx: [],
            pe: [],
            ou: [],
            co: [],
            ouHierarchy: {}
        },
        rows: []
    };

    if (analyticsObject) {

        /**
         * Check headers
         */
        if (analyticsObject.headers) {
            analyticsObject.headers.forEach(function (header){
                try {
                    var newHeader = header;
                    sanitizedAnalyticsObject.headers.push(newHeader);
                } catch (e) {
                    console.warn('Invalid header object');
                }
            });
        }

        /**
         * Check metaData
         */
        if (analyticsObject.metaData) {
            try {
                var sanitizedMetadata = getSanitizedAnalyticsMetadata(analyticsObject.metaData, preferNormalStructure);
                sanitizedAnalyticsObject.metaData = sanitizedMetadata;
            } catch (e) {
                console.warn('Invalid metadata object');
            }
        }

        /**
         * Check rows
         */
        if (analyticsObject.rows) {
            sanitizedAnalyticsObject.rows = analyticsObject.rows;
        }
    }


    return sanitizedAnalyticsObject;
}

function getSanitizedAnalyticsMetadata(analyticMetadata, preferNormalStructure) {
    var sanitizedMetadata = {
        dimensions: {},
        names: {},
        dx: [],
        pe: [],
        ou: [],
        co: [],
        ouHierarchy: {}
    };

    if (analyticMetadata) {
        if (analyticMetadata.ouHierarchy) {
            sanitizedMetadata.ouHierarchy = analyticMetadata.ouHierarchy;
        }
        /**
         * Get metadata names
         */
        if (analyticMetadata.names) {
            sanitizedMetadata.names = analyticMetadata.names;
        } else if (analyticMetadata.items) {

            var metadataNames = {};
            for (var metadataItemKey in analyticMetadata.items) {
                metadataNames[metadataItemKey] = analyticMetadata.items[metadataItemKey].name;
            }

            sanitizedMetadata['names'] = metadataNames;
        }


        /**
         * Get metadata dimensions
         */
        if (analyticMetadata.dimensions) {
            if (!preferNormalStructure) {
                sanitizedMetadata['dimensions'] = analyticMetadata.dimensions;
            } else {
                sanitizedMetadata.dimensions = analyticMetadata.dimensions;
                sanitizedMetadata.dx = analyticMetadata.dimensions.dx;
                sanitizedMetadata.ou = analyticMetadata.dimensions.ou;
                sanitizedMetadata.pe = analyticMetadata.dimensions.pe;
                sanitizedMetadata.co = analyticMetadata.dimensions.co;
            }
        } else {
            var metadataDimensions = {};
            for (var metadataKey in analyticMetadata.dimensions) {
                if (analyticMetadata.hasOwnProperty(metadataKey)) {
                    if (metadataKey !== 'names') {
                        metadataDimensions[metadataKey] = analyticMetadata.dimensions[metadataKey];
                    }
                }
            }


            if (!preferNormalStructure) {
                sanitizedMetadata['dimensions'] = metadataDimensions;
            } else {
                sanitizedMetadata.dx = metadataDimensions.dx;
                sanitizedMetadata.ou = metadataDimensions.ou;
                sanitizedMetadata.pe = metadataDimensions.pe;
                sanitizedMetadata.co = metadataDimensions.co;
            }
        }
    }



    return sanitizedMetadata;
}
