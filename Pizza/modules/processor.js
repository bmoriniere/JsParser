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

function process(data){
	dispatchVideos(data);
	writeOutput(transformToResult(data));
}

function dispatchVideos(data) {
	let currentCacheIndex = 0;
	let currentCache = data.caches[currentCacheIndex];
	data.videos.forEach((video) => {
		if(currentCache.remainingSize >= video.size) {
			currentCache.videos.push(video);
			currentCache.remainingSize -= video.size;
		} else {
			currentCacheIndex++;
			if(currentCacheIndex >= data.caches.length) {
				return;
			}
			currentCache = data.caches[currentCacheIndex];
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
		outputFile.write(`${cache.id} ${join} \n`.trim()); // again
	});
	outputFile.end();
}

module.exports = {
	process : process
}