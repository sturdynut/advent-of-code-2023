const fs = require('fs');

const input = fs.readFileSync('./data.txt', 'utf8');

const inputArray = input.split('\n');

// What is the lowest location number that corresponds to
// any of the initial seed numbers?

/*
	1. Gather up initial seeds and map of seeds and their data
	{
		5844012: {
			soil: [],
			fertilizer: [],
			water: [],
			light: [],
			temperature: [],
			humidity: [],
			location: [],
		}
	}

	2.  Filter down to initial seeds
	3.  Determine lowest location number
*/
let initialSeeds = [];
const mappyMap = {
}
const labelMap = {
	initialSeeds: "seeds: ",
	// seed-to-soil map: describes how to convert a seed number (the source) to a
	// soil number (the destination). This lets the gardener and his
	// team know which soil to use with which seeds, which water to use with
	//  which fertilizer, and so on.
	// [dest]    [source]   [range]
	// 912405184 1056091028 152837752
	seedToSoilMap: "seed-to-soil map:",
	soilToFertMap: "soil-to-fertilizer map:",
	fertToWaterMap: "fertilizer-to-water map:",
	waterToLightMap: "water-to-light map:",
	lightToTempMap: "light-to-temperature map:",
	tempToHumidityMap: "temperature-to-humidity map:",
	humToLocationMap: "humidity-to-location map:",
}

/*
	soil-to-fertilizer map:
	[dest]    [source]   [range]
	912405184 1056091028 152837752
*/
const calculateRange = (start, range) => {
	const output = [start];
	while (range-- > 0) {
		output.push(start++);
	}
	return output;
}

const isDataLine = line => line && line.split(' ').length === 3;
const getDataLineParts = line => {
	const [dest, source, range] = line.split(' ');
	return {
		source: parseInt(source),
		dest: parseInt(dest),
		range: parseInt(range),
	}
}

let currentMapName = null;
const mapHeaders = Object.values(labelMap);

for (let line of inputArray) {
	// Check for initial seeds
	if (line.startsWith(labelMap.initialSeeds)) {
		initialSeeds = line.replace(labelMap.initialSeeds, '').split(' ').map(Number);
		continue;
	}
	// Are we entering a new map?
	if (mapHeaders.includes(line)) {
		currentMapName = line;
		// console.log(">>>currentMapName", line);
  // Are we in a map?
	} else if (currentMapName && isDataLine(line)) {
		const {source, dest, range} = getDataLineParts(line);
		// console.log(">>>", {currentMapName, source, dest, range})
		const destValues = calculateRange(dest, range);
		const sourceValues = calculateRange(source, range);

		// Any source numbers that aren't mapped correspond to the same destination number.
		// So, seed number 10 corresponds to soil number 10.

		const map = mappyMap[currentMapName] || []

		// aaahhhhhhh
		// map[source] = rangeValues;
		// mappyMap[currentMapName] = map;
	}


}

// console.log(">>>", {initialSeeds})