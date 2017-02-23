'use strict'
var fs = require('fs');
var _ = require('lodash');


function process(data){

	let result = {
		nbCacheServers: 1,
		cacheServers: [
			{
				id: 0,
				videoIds:[1, 2]
			}
		]
	};

	writeOutput(result);
}

function writeOutput(result, fileName) {
	var outputFile = fs.createWriteStream('outputs/'+(fileName ? fileName : 'output.out'));
	outputFile.write(`${result.nbCacheServers} \n`) // append string to your file
	result.cacheServers.forEach((cache) => {
		let join = cache.videoIds.join(' ');
		outputFile.write(`${cache.id} ${join} \n`.trim()); // again
	});
	outputFile.end();
}

module.exports = {
	process : process
}