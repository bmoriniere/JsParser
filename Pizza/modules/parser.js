'use strict'

var _ = require('lodash');

// Declaration of used variables
let lineCount = 0,
    parseError = false,
    parseMessage = '';

var firstLineRegex = /(\d*) (\d*) (\d*) (\d*) (\d*)/;
var videoSizeRegex = "";// /(\d*)[x]/;
var endpointRegex = /(\d)* (\d)*/;
var endpointCacheRegex = /(\d)* (\d)*/;
var requestRegex = /(\d)* (\d)* (\d)*/;

// Parsing function
function parse(filePath){
    return new Promise(function(resolve, reject) {
        lineCount = 0;
        let fileDescription = {};
        fileDescription.nbVideos = 0;
        fileDescription.nbEndpoints = 0;
        fileDescription.nbRequests = 0;
        fileDescription.nbCaches = 0;
        fileDescription.cacheSize = 0;
        
        let videos = [];
        let endpoints = [];
        let requests = [];
        let caches = [];

        var lineReader = require('readline').createInterface({
            input: require('fs').createReadStream(filePath)
        });
        let endPointCount = 0;
        let endPointStartIndex = 2;
        let endPointEndIndex = 0;
        let endPointIndex = 0;
        let cacheWithinEndpointIndex = 0;

        lineReader.on('line', (line)=>{

            if (lineCount === 0) {
                let firstLineRegexResult = line.match(firstLineRegex);
                fileDescription.nbVideos = +firstLineRegexResult[1];
                fileDescription.nbEndpoints = +firstLineRegexResult[2];
                fileDescription.nbRequests = +firstLineRegexResult[3];
                fileDescription.nbCaches = +firstLineRegexResult[4];
                fileDescription.cacheSize = +firstLineRegexResult[5];

                endPointCount = fileDescription.nbEndpoints;
                for(let i = 0 ; i < fileDescription.nbVideos ; i++) {
                    videoSizeRegex += "(\\d*) ";
                }
                for(let i = 0 ; i < fileDescription.nbCaches ; i++) {
                    caches.push({
                        id: i,
                        size: fileDescription.cacheSize,
                        remainingSize: fileDescription.cacheSize,
                        videos: []
                    });
                }

                videoSizeRegex = videoSizeRegex.trim();
            } else if (lineCount == 1) {
                let videoSizeResult = line.match(videoSizeRegex);

                for(let i = 0; i < fileDescription.nbVideos ; i++) {
                    videos.push({
                        id: i,
                        size: +videoSizeResult[i + 1]
                    });
                }
            } else if (lineCount > 1 && lineCount == endPointStartIndex && endPointIndex < endPointCount) {
                let endPointRegexResult = line.match(endpointRegex);
                endpoints[endPointIndex] = {
                    id: endPointIndex,
                    datacenterLatency: +endPointRegexResult[1],
                    caches: []
                };
                endPointEndIndex = lineCount + +endPointRegexResult[2];
                endPointIndex++;
                endPointStartIndex = endPointEndIndex + 1;
            } else if (lineCount > 1 && lineCount <= endPointEndIndex) {
                let endpointCacheRegexResult = line.match(endpointCacheRegex);
                endpoints[endPointIndex - 1].caches.push({
                    id: +endpointCacheRegexResult[1],
                    cacheLatency: +endpointCacheRegexResult[2]
                });
            } else {
                // General case = requests
                let requestRegexResult = line.match(requestRegex);
                requests.push({
                    videoId: +requestRegexResult[1],
                    endpointId: +requestRegexResult[2],
                    nbRequests: +requestRegexResult[3]
                });
            }
            lineCount++;
        });


        lineReader.on('close', ()=>{
            let result = {
                fileDescription: fileDescription,
                videos: videos,
                caches: caches,
                requests: requests,
                endpoints: endpoints
            };
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