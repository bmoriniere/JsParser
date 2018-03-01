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
	let vehicules = createVehicules(data);

    let modes = [];
	modes.push({...modeBasic(data.rides,createVehicules(data), data.bonus), name: 'basic'});

	modes.push({...modeBasic(sortRidesByLastStep(data.rides), createVehicules(data), data.bonus), name: 'basicSort'});

    const best = _.maxBy(modes, mode => mode.totalPoints);
    console.log(best.name);
	writeOutput(best, outputFile);
}

function modeBasic(rides, vehicules, bonus) {
    let totalPoints = 0;
    rides.forEach(ride => {
        const availableVehicule = vehicules.filter(v => canTakeRide(v, ride))[0];
        if (availableVehicule) {
            const infos = rideInfo(availableVehicule, ride);
            const pointsEarn = infos.distanceOfRide + (infos.vehiculeWait == 0 ? bonus : 0);
            totalPoints += pointsEarn;
            availableVehicule.rides.push(ride);
            availableVehicule.clock = infos.totalTime;
        }
    })
    return {vehicules, totalPoints};
}

function sortRidesByLastStep(rides){
	return rides.sort((rideA, rideB) => rideA.endStep < rideB.endStep);
}

function createVehicules(data) {
    return Array(+data.fileDesc.numberVehicules).fill(null).map((_, index) => ({
        id: index,
        nbRides: 0,
        rides: [],
        position: { col: 0, row: 0 },
        currentRide: null,
        clock: 0
    }));
}

function canTakeRide(vehicule, ride) {
    let distanceToRide = getDistance(vehicule.position, ride.startPoint);
    let distanceOfRide = getDistance(ride.startPoint, ride.endPoint);

    let startStep = Math.max(vehicule.clock + distanceToRide, ride.startStep);
    return (startStep + distanceOfRide) <= ride.endStep;
}

function timeTotal(vehicule, ride) {
    let distanceToRide = getDistance(vehicule.position, ride.startPoint);
    let distanceOfRide = getDistance(ride.startPoint, ride.endPoint);

    let startStep = Math.max(vehicule.clock + distanceToRide, ride.startStep);
    return (startStep + distanceOfRide);
}

function rideInfo(vehicule, ride) {
    let distanceToRide = getDistance(vehicule.position, ride.startPoint);
    let distanceOfRide = getDistance(ride.startPoint, ride.endPoint);

    let startStep = Math.max(vehicule.clock + distanceToRide, ride.startStep);
    return {
        canTake: (startStep + distanceOfRide) <= ride.endStep,
        totalTime: (startStep + distanceOfRide),
        earlyFinish: ride.endStep - (startStep + distanceOfRide),
        vehiculeWait: ride.startStep - (distanceToRide + vehicule.clock),
        distanceOfRide
    };
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

function getDistance(A, B) {
    return Math.abs(A.row - B.row) + Math.abs(A.col - B.col);
}

function writeOutput(result, fileName) {
	var outputFile = fs.createWriteStream('outputs/'+(fileName ? fileName : 'output.out'));
	result.vehicules.forEach((vehicule) => {
		const join = vehicule.rides.map(ride => ride.idRide).join(' ');
		outputFile.write(`${vehicule.rides.length} ${join}\n`); // again
	});
	outputFile.end();
}

module.exports = {
	process : process
}