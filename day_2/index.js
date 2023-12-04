const fs = require('fs');

const input = fs.readFileSync('./data.txt', 'utf8');

const inputArray = input.split('\n');

const MAX_RED = 12;
const MAX_BLUE = 14;
const MAX_GREEN = 13;

let validGameIds = [];
for (let line of inputArray) {
	let [_, part] = line.split('Game ');
	const [gameId, rest] = part.split(':');

	const samples = rest.split(';');
	const partionedSamples = samples.reduce((acc, value) => {
		const reds = value.split(',').filter(t => t.endsWith('red')).map(u => u.replace(' ', '').replace(' red', ''));
		const blues = value.split(',').filter(t => t.endsWith('blue')).map(u => u.replace(' ', '').replace(' blue', ''));
		const greens = value.split(',').filter(t => t.endsWith('green')).map(u => u.replace(' ', '').replace(' green', ''));

		acc.red.push(reds);
		acc.blue.push(blues);
		acc.green.push(greens);
		return acc;
	}, {red: [], blue: [], green: []});

	const validReds = !partionedSamples.red.some(([s]) => !isNaN(+s) && +s > MAX_RED);
	const validBlues = !partionedSamples.blue.some(([s]) => !isNaN(+s) && +s > MAX_BLUE);
	const validGreens = !partionedSamples.green.some(([s]) => !isNaN(+s) && +s > MAX_GREEN);
	// console.log(">>>samples", samples)
	// console.log(">>>partionedSamples", partionedSamples)
	// console.log({
	// 	validReds,
	// 	validBlues,
	// 	validGreens,
	// })
	const validGame = validReds && validBlues && validGreens;
	if (validGame) {
		validGameIds.push(+gameId);
	}

	// if (gameId === "93") {
	// 	console.log(partionedSamples.red);
	// 	console.log(partionedSamples.green);
	// 	console.log(partionedSamples.blue);
	// 	console.log(">>>validGame", validGame)
	// }
	// console.log(">>>validGame", {validGame, gameId})
}

const total = validGameIds.reduce((acc, curr) => acc + curr, 0);

console.log(">>>total", total)
