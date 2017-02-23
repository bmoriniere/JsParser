'use strict'

var _ = require('lodash');


function process(data){

	let result = {
		nbCacheServers: 1,
		cacheServers: [
			{
				id: 0,
				videoIds:[]
			}
		]
	};

	writeOutput(result);
}

function writeOutput(result) {

}

module.exports = {
	process : process
}