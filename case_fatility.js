//Example of function implementation
parameters.progress(50);
function calculatePercentageForOU(ou){
    return new Promise(function(resolve,reject){
        $.ajax({
            url: "../../../api/organisationUnits.json?paging=false&filter=level:eq:4&fields=id,organisationUnitGroups[id]&filter=path:like:" + ou,
            type: "GET",
            success: function(orgUnitResults) {

                var h3AndAboveOrgUnits = [];
                orgUnitResults.organisationUnits.forEach(function(organisationUnit){
                    organisationUnit.organisationUnitGroups.forEach(function(organisationUnitGroup){
                        if(organisationUnitGroup.id  == parameters.rule.json.organisationUnitGroup){
                            h3AndAboveOrgUnits.push(organisationUnit);
                        }
                    })
                })
                $.ajax({
                    url: "../../../api/analytics.json?dimension=dx:" + parameters.rule.json.data + "&dimension=pe:" + parameters.pe + "&dimension=ou:LEVEL-4;" + ou + "&hierarchyMeta=true&displayProperty=SHORTNAME",
                    type: "GET",
                    success: function(analyticsResults) {
                        analyticsResults.metaData.dx = [parameters.rule.id];
                        analyticsResults.metaData.ou = [ou];
                        analyticsResults.metaData.names[parameters.rule.id] = parameters.rule.name;
                        var newRows = [];
                        analyticsResults.metaData.pe.forEach(function(pe) {
                            var numerator = 0;
                            var denominator = 0;
                            analyticsResults.rows.forEach(function(row){
                                if (row[1] == pe) {
                                    h3AndAboveOrgUnits.forEach(function(h3AndAboveOrgUnit){
                                        if(h3AndAboveOrgUnit.id == row[2]){
                                            numerator += parseFloat(row[3]);

                                        }

                                    })

                                    denominator += parseFloat(row[3]);
                                }

                            })
                            var indicatorValue = parseFloat((numerator / denominator)*100);
                            newRows = newRows.concat([[parameters.rule.id,pe,ou,"" + indicatorValue.toFixed(2)]]);
                        })
                        analyticsResults.rows = newRows;
                        resolve(analyticsResults);
                    },
                    error:function(error){
                        reject(error);
                    }
                });
            },
            error:function(error){
                reject(error);
            }
        });
    })
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
            co: []
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
        co: []
    };

    if (analyticMetadata) {
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
                console.log("META DATA 1");
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
                console.log("META DATA 2");
            }
        }
    }



    return sanitizedMetadata;
}


$.ajax({
    url: "../../../api/analytics.json?dimension=pe:" + parameters.pe + "&dimension=ou:" + parameters.ou + "&skipData=true",
    type: "GET",
    success: function(dummyAnalyticsResults) {
        var promises = [];
        var analytics;
        dummyAnalyticsResults.metaData.ou.forEach(function(ou){
            promises.push(calculatePercentageForOU(ou).then(function(analyticsResults){
                if(!analytics){
                    analytics = analyticsResults;
                }else{
                    analytics.metaData.ou = analytics.metaData.ou.concat(analyticsResults.metaData.ou);
                    analyticsResults.metaData.ou.forEach(function(ouid){
                        analytics.metaData.names[ouid] = analyticsResults.metaData.names[ouid];
                    })
                    analytics.rows = analytics.rows.concat(analyticsResults.rows);
                }
            }));
        })

        Promise.all(promises).then(function(){
            console.log('before', analytics);
            console.log('after', standardizeIncomingAnalytics(analytics));
            parameters.success(standardizeIncomingAnalytics(analytics));
        },function(error){
            parameters.error(error);
        })
    },error:function(error){
        reject(error);
    }
});
