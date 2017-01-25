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
	const intersect = _.intersectionWith(arraySlices, arraySlices, (value, other) => {

		if (value.key === 'col:3|row:1' && other.key === 'col:5|row:1'){
			console.log('Value', value, 'Other', other);
			console.log(other.top.x > value.bottom.x+1 || 
           	other.bottom.x+1 < value.top.x || 
           	other.top.y > value.bottom.y+1 ||
           	other.bottom.y+1 < value.top.y);
		}

		return
			other.top.x > value.bottom.x+1 || 
           	other.bottom.x+1 < value.top.x || 
           	other.top.y > value.bottom.y+1 ||
           	other.bottom.y+1 < value.top.y
	});
	console.log(intersect);
	const groupIntersect = _.groupBy(intersect, 'key');
	console.log('intersect');
	_.mapValues(groupIntersect, (elt) => {
		console.log(elt);
	});

	/*console.log('grouped');
	_.mapValues(groupArray, (slice) => {
		console.log(slice);
	});*/

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
		if (row+1 < +result.R && result.rows[row+1].detail[col] === oppositeType){
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
		if (col+1 < +result.C && result.rows[row].detail[col+1] === oppositeType){
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