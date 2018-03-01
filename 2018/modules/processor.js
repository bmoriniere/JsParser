'use strict'
var fs = require('fs');
var _ = require('lodash');

            // let result = {
            //     vehicules.push({
			// 			id:
			//			nbRides:
			//			rides.push({
			//				id:
			//			})
			// })


function process(data, outputFile){

	writeOutput(transformToResult(data), outputFile);
}

function transformToResult(data) {
	let result = {
		vehicules: []
	};

	result = {
		vehicules: [
			{
				idVehicule :0,
				nbRides : 1,
				rides : [{idRide:0}]
			},
			{
				idVehicule :1,
				nbRides : 2,
				rides : [{idRide:2},{idRide:1}]
			}
		]
	}

	return result;
}

function writeOutput(result, fileName) {
	var outputFile = fs.createWriteStream('outputs/'+(fileName ? fileName : 'output.out'));
	result.vehicules.forEach((vehicule) => {
		const join = vehicule.rides.map(ride => ride.idRide).join(' ');
		outputFile.write(`${vehicule.nbRides} ${join}\n`); // again
	});
	outputFile.end();
}

module.exports = {
	process : process
}