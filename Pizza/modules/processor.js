'use strict'
var fs = require('fs');
var _ = require('lodash');

            // let result = {
            //     fileDescription: fileDescription,
            //     videos: videos,
            //     caches: caches,
            //     requests: requests,
            //     endpoints: endpoints
            // };
			        //             caches.push({
                    //     id: i,
                    //     size: fileDescription.cacheSize,
                    //     remainingSize: fileDescription.cacheSize
					                        // videos: []
                    // });

                    // videos.push({
                    //     id: i,
                    //     size: +videoSizeResult[i + 1]
                    // });
                // endpoints[endPointIndex] = {
                //     id: endPointIndex,
                //     datacenterLatency: +endPointRegexResult[1],
                //     caches: []
                // };

					//                     requests.push({
                    //     videoId: +requestRegexResult[1],
                    //     endpointId: +requestRegexResult[2],
                    //     nbRequests: +requestRegexResult[3]
                    // });
                // endpoints[endPointIndex - 1].caches.push({
                //     id: +endpointCacheRegexResult[1],
                //     cacheLatency: +endpointCacheRegexResult[2]
                // });


function process(data, outputFile){
	let sortedVideosByLatencyPerEndpointId = assignVideosToEndpoint(data);
	let sortedCachesByLatencyPerEndpointId = assignCachesToEndpoint(data);
	let sortedVideosEndpointCombinations = getMostExpensiveVideos(sortedVideosByLatencyPerEndpointId);

	dispatchVideos(data, sortedVideosEndpointCombinations, sortedCachesByLatencyPerEndpointId);
	writeOutput(transformToResult(data), outputFile);
}

function assignVideosToEndpoint(data) {
	let requestsByEndpointId = _.groupBy(data.requests, 'endpointId');
	let totalLatencyToDatacenterPerVideoPerEndpointId = {}; 
	_.forIn(requestsByEndpointId, (endpointRequests, endpointId) => {
		totalLatencyToDatacenterPerVideoPerEndpointId[endpointId] = _.mapValues(_.groupBy(endpointRequests, 'videoId'), (requestsPerVideo) => {
			return {
				endpointId: endpointId,
				videoLatency: _.sumBy(requestsPerVideo, 'nbRequests') * data.endpoints[endpointId].datacenterLatency
			};
		});
	});

	let sortedVideosByLatencyPerEndpointId = _.mapValues(totalLatencyToDatacenterPerVideoPerEndpointId, (endpointVideoLatencies) => {
		let array = [];
		_.forIn(endpointVideoLatencies, (videoLatencyWithEndpointId, videoId) => {
			array.push({
				videoId: videoId,
				videoLatency: videoLatencyWithEndpointId.videoLatency,
				endpointId: videoLatencyWithEndpointId.endpointId
			});

		});

		return _.orderBy(array, 'videoLatency', 'desc');
	});
	return sortedVideosByLatencyPerEndpointId;
}

function assignCachesToEndpoint(data) {
	let sortedCachesByLatencyPerEndpointId = {};
	_.each(data.endpoints, (endpoint) => {
		sortedCachesByLatencyPerEndpointId[endpoint.id] = _.orderBy(endpoint.caches, 'cacheLatency', 'asc');
	});
	return sortedCachesByLatencyPerEndpointId;
}

function getMostExpensiveVideos(sortedVideosByLatencyPerEndpointId) {
	// _.map()
	// console.log(sortedVideosByLatencyPerEndpointId);
	return _.orderBy(_.flatten(_.values(sortedVideosByLatencyPerEndpointId)), 'videoLatency', 'desc');
}
function sortCachesForEndpoint() {

}

function sortMostExpensiveVideosForEndpoint() {

}
function dispatchVideos(inputData, sortedVideosEndpointCombinations, sortedCachesByLatencyPerEndpointId) {
	// console.log(sortedVideosEndpointCombinations);
	_.mapValues(sortedVideosEndpointCombinations,(videoEndpointCombination) => {
		// console.log(videoEndpointCombination)
		chooseBestCache(inputData, sortedCachesByLatencyPerEndpointId[videoEndpointCombination.endpointId], videoEndpointCombination.videoId);
// ca peut retourner null
		
	});
	// let currentCacheIndex = 0;
	// let currentCache = data.caches[currentCacheIndex];
	// data.videos.forEach((video) => {
	// 	if(currentCache.remainingSize >= video.size) {
	// 		currentCache.videos.push(video);
	// 		currentCache.remainingSize -= video.size;
	// 	} else {
	// 		currentCacheIndex++;
	// 		if(currentCacheIndex >= data.caches.length) {
	// 			return;
	// 		}
	// 		currentCache = data.caches[currentCacheIndex];
	// 	}
	// });		
}

function chooseBestCache(inputData, sortedCachesForEndpoint, videoId) {
	// console.log(inputData);
	let video = inputData.videos[videoId];
	let bestCache = null;
// console.log(videoId);
	_.each(sortedCachesForEndpoint, (cacheInfo) => {
		// console.log(cacheId);
		let cache = inputData.caches[cacheInfo.id];
		let videoAlreadyInCache = _.find(cache.videos, (video) => {
			return videoId == video.id;
		});
		// console.log("cacheId:" + cacheInfo.id +  " videoId:" + videoId + " foundincache:" + videoAlreadyInCache)

		if(videoAlreadyInCache) {
			return false;
		} else {
			if(cache.remainingSize >= video.size) {
				cache.videos.push(video);
				cache.remainingSize -= video.size;
				bestCache = cache;
				return false;	
			}
		}
		
	});
}

function transformToResult(data) {
	let nbUsedCaches = 0;
	let result = {
		nbCacheServers: 0,
		cacheServers: []
	};

	data.caches.forEach((cache) => {
		if(cache.videos.length > 0) {
			nbUsedCaches++;
			result.cacheServers.push({
				id: cache.id,
				videoIds: _.map(cache.videos, (video) => video.id)
			});			
		}
	});

	result.nbCacheServers = nbUsedCaches;
	return result;
}

function writeOutput(result, fileName) {
	var outputFile = fs.createWriteStream('outputs/'+(fileName ? fileName : 'output.out'));
	outputFile.write(`${result.nbCacheServers} \n`) // append string to your file
	result.cacheServers.forEach((cache) => {
		let join = cache.videoIds.join(' ');
		outputFile.write(`${cache.id} ${join}\n`); // again
	});
	outputFile.end();
}

module.exports = {
	process : process
}