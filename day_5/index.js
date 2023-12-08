const fs = require('fs');
const R = require('ramda');

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
	Nope
*/

/*
	1. Build array of each "map" and its data

	[
		{
			map: "seed-to-soil map",
			from: "seed",
			to: "soil",
			items: [[1,2,4],[45,67,3]]
		},
		...
	]

	2.  Iterate over each item
		- for each item
			- iterate over the range length value (i.e. 4 from example line 4)
				- determine the to value for given range value
					- pass value into function for next map (recur)

*/
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
	TESTING: "fertilizer-to-location map:",
}

/*
	soil-to-fertilizer map:
	[dest]    [source]   [range]
	912405184 1056091028 152837752
*/
const calculateRange = (start, range) => {
	const output = [start];
	while (range-- > 0) {
		try {
		output.push(start++);
	} catch(e) {
		console.log(">>>eerrrrr", output.length, start, e);
		range = 0
	}
	}
	return output;
}

const isDataLine = line => line && line.split(' ').length === 3;
const getDataLineParts = line => line.split(' ')
// const getDataLineParts = line => {
// 	const [dest, source, range] = line.split(' ');
// 	return {
// 		source: parseInt(source),
// 		dest: parseInt(dest),
// 		range: parseInt(range),
// 	}
// }

const parseMapFromTo = (name) => {
	const [from, _, to] = name.split(' map:')[0].split('-');
	return {from, to}
}

const buildMapItem = (overrides = {}) => (R.mergeDeepRight({
	name: "",
	from: "",
	to: "",
	items: []
}, overrides));

let initialSeeds = inputArray[0].replace(labelMap.initialSeeds, '').split(' ').map(Number)
let currentMapName = null;
let currentMapping = buildMapItem();
const mapHeaders = Object.values(labelMap);
// const mappyMap = {};
const mappings = {};

for (let i=1; i<inputArray.length; i++) {
	const line = inputArray[i];

	// Check for initial seeds
	// if (line.startsWith(labelMap.initialSeeds)) {
	// 	initialSeeds = line.replace(labelMap.initialSeeds, '').split(' ').map(Number);
	// 	continue;
	// }

	// Are we entering a new map?
	if (line.endsWith('map:')) {
	// if (mapHeaders.includes(line)) {
		// If we run into a new map, start over
		currentMapName = line;
		const {from, to} = parseMapFromTo(line)
		currentMapping = buildMapItem({
			name: `${from}-to-${to}`,
			from,
			to,
			items: []
		})
		mappings[currentMapping.name] = currentMapping;

		// mappyMap[currentMapName] = {};

		// console.log(">>>currentMapName", line);
  // Are we in a map?
	} else if (isDataLine(line)) {
		currentMapping.items.push(getDataLineParts(line));
		// console.log(">>>", {currentMapName, source, dest, range})
		// const destValues = calculateRange(dest, range);
		// const sourceValues = calculateRange(source, range);

		// Any source numbers that aren't mapped correspond to the same destination number.
		// So, seed number 10 corresponds to soil number 10.

		// const map = mappyMap[currentMapName] = R.zip(sourceValues, destValues);
	}
}

if (currentMapping.items.length > 0) {
	mappings[currentMapping.name] = currentMapping
}

const processMap = ({from, to, items}) => {
	// Get map we are mapping to
	const toMapToMap = mappings.find(m => m.from === to);

	if(!toMapToMap?.to) {
		// console.log("No more to map to!", {from, to});
		return;
	}

	// if (toMapToMap.to === 'location') {
	// 	// We made it!
	// 	console.log(">>>Ok, now we are here...")
	// 	return;
	// }


	// - for each item
	// - iterate over the range length value (i.e. 4 from example line 4)
	// 	- determine the to value for given range value
	// 		- pass value into function for next map (recur)
	items.forEach(([itemTo, itemFrom, range]) => {
		let counter = 0;
		let currentFrom, currentTo;
		while (counter < range) {
			currentFrom = itemFrom + counter;
			currentTo = itemTo + counter;

			counter++;
		}
	})
}

const mapAToB = (a, mapping) => {
	let match;
	// console.log(">>>mapAtoB", {a, mapping})

	for (let i=0; i<mapping.items.length; i++) {
		const [itemTo, itemFrom, range] = mapping.items[i];
		// console.log(">>>mapItem", {itemTo, itemFrom, range})
		let counter = 0;
		let currentFrom, currentTo, match;
		while (counter < range) {
			currentFrom = parseInt(itemFrom) + counter;
			currentTo = parseInt(itemTo) + counter;

			if (currentFrom === a) {
				match = currentTo;
				break;
			}

			counter++;
		}

		if (match) {
			break;
		}
	}

	if (!match) {
		match = a;
	}

	return match;
}

const findLowestLocationNumber = (seeds, mappings) => {
	// console.log(">>>finding lowest location number for", seeds, mappings);

	let lowestLocationNumber = Number.MAX_SAFE_INTEGER;
	seeds.forEach(seed => {
		const soil = mapAToB(seed, mappings["seed-to-soil"]);
		const fert = mapAToB(seed, mappings["soil-to-fertilizer"]);
		const loc = mapAToB(seed, mappings["fertilizer-to-location"]);
		console.log(">>>results", {seed, soil, fert, loc})

		if (loc < lowestLocationNumber) {
			lowestLocationNumber = loc;
		}
	});

	return lowestLocationNumber;
}

console.log(">>>", findLowestLocationNumber(initialSeeds, mappings))