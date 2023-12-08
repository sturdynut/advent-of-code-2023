const fs = require('fs');

const input = fs.readFileSync('./data.txt', 'utf8');

const inputArray = input.split('\n');

const INITIAL_SEEDS = "seeds: ";

const mapHeaders = [
	"seed-to-soil map:",
	"soil-to-fertilizer map:",
	"fertilizer-to-water map:",
	"water-to-light map:",
	"light-to-temperature map:",
	"temperature-to-humidity map:",
	"humidity-to-location map:"
]

const isDataLine = line => line && line.split(' ').length === 3;
const getDataLineParts = line => line.split(' ')
const parseMapFromTo = (name) => {
	const [from, _, to] = name.split(' map:')[0].split('-');
	return {from, to}
}
const buildMapItem = (overrides = {}) => ({
	name: "",
	from: "",
	to: "",
	items: [],
	...overrides
});

let initialSeeds = inputArray[0].replace(INITIAL_SEEDS, '').split(' ').map(Number)
let currentMapping = buildMapItem();
const mappings = {};

for (let i=1; i<inputArray.length; i++) {
	const line = inputArray[i];

	if (line.endsWith('map:')) {
		// If we run into a new map, start over
		const {from, to} = parseMapFromTo(line)
		currentMapping = buildMapItem({
			name: `${from}-to-${to}`,
			from,
			to,
			items: []
		})
		mappings[currentMapping.name] = currentMapping;

	} else if (isDataLine(line)) {
		currentMapping.items.push(getDataLineParts(line));
	}
}

if (currentMapping.items.length > 0) {
	mappings[currentMapping.name] = currentMapping
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
	console.log(">>>finding lowest location number for", seeds, mappings);

	let lowestLocationNumber = Number.MAX_SAFE_INTEGER;
	console.time("findLowestLocationNumber")
	seeds.forEach(seed => {
		console.log(">>> starting seed", seed);
		console.time("soil")
		const soil = mapAToB(seed, mappings["seed-to-soil"]);
		console.log(">>> soil", soil);
		console.timeEnd("soil")
		console.time("fert")
		const fert = mapAToB(soil, mappings["soil-to-fertilizer"]);
		console.log(">>> fert", fert);
		console.timeEnd("fert")
		console.time("water")
		const water = mapAToB(fert, mappings["fertilizer-to-water"]);
		console.log(">>> water", water);
		console.timeEnd("water")
		console.time("light")
		const light = mapAToB(water, mappings["water-to-light"]);
		console.log(">>> light", light);
		console.timeEnd("light")
		console.time("temp")
		const temp = mapAToB(light, mappings["light-to-temperature"]);
		console.log(">>> temp", temp);
		console.timeEnd("temp")
		console.time("humidity")
		const humidity = mapAToB(temp, mappings["temperature-to-humidity"]);
		console.log(">>> humidity", humidity);
		console.timeEnd("humidity")
		console.time("loc")
		const loc = mapAToB(humidity, mappings["temperature-to-humidity"]);
		console.log(">>> loc", loc);
		console.timeEnd("loc")

		if (loc < lowestLocationNumber) {
			lowestLocationNumber = loc;
		}
	});
	console.timeEnd("findLowestLocationNumber")

	return lowestLocationNumber;
}

console.log("Lowest Location is ", findLowestLocationNumber(initialSeeds, mappings))