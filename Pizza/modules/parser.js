'use strict'

var _ = require('lodash');

// Declaration of used variables
let lineCount = 0,
    parseError = false,
    parseMessage = '';

var firstLineRegex = /(\d*) (\d*) (\d*) (\d*)/;
var otherLinesRegex = '';

// Parsing function
function parse(filePath){
    return new Promise(function(resolve, reject) {
        lineCount = 0;
        let result = {};
        result.tomatoesCpt = 0;
        result.mushroomsCpt = 0;
        result.rows = [];
        result.cols = [];

        var lineReader = require('readline').createInterface({
            input: require('fs').createReadStream(filePath)
        });

        lineReader.on('line', (line)=>{

            if (lineCount === 0) {
                let firstLineRegexResult = line.match(firstLineRegex);
                result.R = firstLineRegexResult[1];
                result.C = firstLineRegexResult[2];
                result.L = firstLineRegexResult[3];
                result.H = firstLineRegexResult[4];

                for(let i = 0 ; i < result.C ; i++) {
                    otherLinesRegex += '([TM]{1})';

                    result.cols[i] = {tomatoesCpt: 0, mushroomsCpt: 0, detail: []};
                }
            } else if (lineCount >= 1) {
                // General case
                let otherLineRegexResult = line.match(otherLinesRegex);

                result.rows[lineCount-1] = {tomatoesCpt: 0, mushroomsCpt: 0, detail: []};
                _.forEach(otherLineRegexResult, (value, i) => {
                    if(i === 0) {
                        return;
                    }

                    result.rows[lineCount-1].detail[i - 1] = value;
                    result.cols[i - 1].detail[lineCount-1] = value;
                    if(value === 'T') {
                        result.tomatoesCpt++;
                        result.rows[lineCount-1].tomatoesCpt++;
                        result.cols[i - 1].tomatoesCpt++;
                    } else if (value === 'M') {
                        result.mushroomsCpt++;
                        result.rows[lineCount-1].mushroomsCpt++;
                        result.cols[i - 1].mushroomsCpt++;
                    }
                })
            }
            lineCount++;
        });

        lineReader.on('close', ()=>{
            console.log(result);
            // Post treaments
            if (parseError){
                reject(parseMessage);
            }else{
                resolve(result);
            }
        });
    });

}


module.exports = {
    parse : parse
};