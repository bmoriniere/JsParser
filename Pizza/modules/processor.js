'use strict'

var _ = require('lodash');

const LEFT = 0;
const RIGHT = 1;
const TOP = 2;
const BOTTOM = 3;

function process(result){
	const maxPart = Math.min(result.tomatoesCpt, result.mushroomsCpt);
	let arraySlices = new Array();
	const type = result.tomatoesCpt < result.mushroomsCpt ? 'T' : 'M';
	const oppositeType = result.tomatoesCpt < result.mushroomsCpt ? 'M' : 'T';
	for(let row=0; row < result.R; row++){
		for(let col=0; col < result.C; col++){
			let arrayTmp = searchForCell({
				type: type,
				oppositeType: oppositeType,
				result: result,
				row: row,
				col:col
			});
			if (arrayTmp && arrayTmp.length>0){
				arraySlices =  _.concat(arraySlices, arrayTmp);
			}
		}
	}

	const groupArray = _.groupBy(arraySlices,'key');

	_.mapValues(groupArray, (slice) => {
		console.log(slice);
	});

}

function searchForCell({type, oppositeType, result, row, col}){
	const arraySlices = new Array();
	if (result.rows[row].detail[col] === type){
		// cell upside
		if (row > 0 && result.rows[row-1].detail[col] === oppositeType){
			arraySlices.push(addSlice({
				col:col,
				row:row,
				position:TOP
			}));
		}
		// cell downside
		if (row < result.R && result.rows[row+1].detail[col] === oppositeType){
			arraySlices.push(addSlice({
				col:col,
				row:row,
				position:BOTTOM
			}));
		}
		//cell left
		if (col > 0 && result.rows[row].detail[col-1] === oppositeType){
			arraySlices.push(addSlice({
				col:col,
				row:row,
				position:LEFT
			}));
		}
		//cell right
		if (col < result.C && result.rows[row].detail[col+1] === oppositeType){
			arraySlices.push(addSlice({
				col:col,
				row:row,
				position:RIGHT
			}));
		}

		return arraySlices;
	}
}


function addSlice({col, row, position}){
	return {
		key: `col:${col}|row:${row}`,
		origin: {
			x: col,
			y: row
		},
		top: {
			x: (position === LEFT ?col -1 : col),
			y: (position === TOP ? row -1 : row)
		},
		bottom: {
			x: (position === RIGHT ?col +1 : col),
			y: (position === BOTTOM ? row +1 : row)
		}
	}
}

function tomatoesInferior(result){
	return result.tomatoesCpt < result.mushroomsCpt;
}

module.exports = {
	process : process
}