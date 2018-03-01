'use strict'

// Declaration of used variables
let lineCount = 0,
    parseError = false,
    parseMessage = '';

const InFileSample = {
    fileDesc : {
        rows: 0,
        columns: 0,
        numberVehicules: 0,
        numberRides: 0,
        bonus: 0,
        numberOfSteps: 0
    },
    rides: [
        {
            startPoint :{
                row: 0,
                col: 0
            },
            endPoint :{
                row: 0,
                col: 0
            },
            startStep: 0,
            endStep: 0
        }
    ]
}


/**

 */

// Parsing function
function parse(filePath){
    return new Promise(function(resolve, reject) {
        lineCount = 0;
        let result = {};

        var lineReader = require('readline').createInterface({
            input: require('fs').createReadStream(filePath)
        });

        lineReader.on('line', (line)=>{
            if (lineCount === 0){
                const [rows, columns, numberVehicules, numberRides, bonus, numberOfSteps] = line.split(' ');
                result.fileDesc = {
                    rows,
                    columns,
                    numberVehicules,
                    numberRides,
                    bonus,
                    numberOfSteps
                };
                result.rides = [];
            }else if (lineCount >= 1){
                // General case
                const [startPointRow, startPointCol, endPointRow, endPointCol, startStep, endStep] = line.split(' ');
                result.rides.push({
                    startPoint : {
                        row : startPointRow,
                        col : startPointCol,
                    },
                    endPoint : {
                        row : endPointRow,
                        col : endPointCol,
                    },
                    startStep,
                    endStep
                });
            }
            lineCount++;
        });

        lineReader.on('close', ()=>{
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