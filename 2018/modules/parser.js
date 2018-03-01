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
                row,
                col
            },
            endPoint :{
                row,
                col
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

            }else if (lineCount >= 2){
                // General case
            }
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