/**
 * Created by josephat on 1/30/18.
 */
var round = require( 'math-round' );
var firstArray = []; var secondArray = [];

// the last object
var newObj = {"firstArr": [], "secondArr": []};

//object for two groups of bases. Bases will have to be in two groups only
var groupOfBases = {"firstGroup": [], "secondGroup": []};

var theArray = [5,12,30.2,22.1,13,44,56,45,90,120.9, 120,30.2,220.6,133,344,56,945,190,220,90000, 1000000];

// get unigue array of bases
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

// create array of bases and of numbers concatenated with bases
var baseConcatenatedWithNumber = []; var availableBases = [];
for (var count =0; count < theArray.length; count++) {
    var currentNumber = round(theArray[count]);
    baseConcatenatedWithNumber.push((currentNumber.toString().length) -1 + ':' + theArray[count]);
    availableBases.push(round(theArray[count]).toString().length -1);
}

// get unique bases and sort in descending order.
var uniqueBases = availableBases.filter( onlyUnique ).sort(function(a, b) { return b-a; });

if (uniqueBases.length > 2) {
    var sum =0;
    for (var count = 0; count < uniqueBases.length; count++) {
        sum += uniqueBases[count];
    }

    for (var baseCount = 0; baseCount < uniqueBases.length; baseCount++){
        if (uniqueBases[baseCount] <= round(sum/uniqueBases.length)) {
            groupOfBases.firstGroup.push(uniqueBases[baseCount]);
        } else {
            groupOfBases.secondGroup.push(uniqueBases[baseCount])
        }
    }
} else if (uniqueBases.length === 2) {
    groupOfBases.firstGroup.push(uniqueBases[0]);
    groupOfBases.secondGroup.push(uniqueBases[1]);
}

Object.keys(groupOfBases).forEach(function (base) {
    if (base === 'firstGroup') {
        for (var countBases = 0; countBases < groupOfBases[base].length; countBases++){
            for (var countForAllValues = 0; countForAllValues < baseConcatenatedWithNumber.length; countForAllValues++) {
                if (baseConcatenatedWithNumber[countForAllValues].split(':')[0] == groupOfBases[base][countBases]) {
                    newObj.firstArr.push(parseFloat(baseConcatenatedWithNumber[countForAllValues].split(':')[1]))
                }
            }
        }
    } else {
        for (var countBases = 0; countBases < groupOfBases[base].length; countBases++){
            for (var countForAllValues = 0; countForAllValues < baseConcatenatedWithNumber.length; countForAllValues++) {
                if (baseConcatenatedWithNumber[countForAllValues].split(':')[0] == groupOfBases[base][countBases]) {
                    newObj.secondArr.push(parseFloat(baseConcatenatedWithNumber[countForAllValues].split(':')[1]))
                }
            }
        }
    }
});
console.log(newObj);
