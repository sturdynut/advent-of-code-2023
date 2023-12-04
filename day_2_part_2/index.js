const fs = require('fs');

const input = fs.readFileSync('./data.txt', 'utf8');

const inputArray = input.split('\n');

let output = 0;
for (let line of inputArray) {
	let [_, part] = line.split('Game ');
	const [gameId, rest] = part.split(':');

	const samples = rest.split(';');
	const partionedSamples = samples.reduce((acc, value) => {
		const reds = value.split(',').filter(t => t.endsWith('red')).map(u => parseInt(u.replace(' ', '').replace(' red', '')));
		const blues = value.split(',').filter(t => t.endsWith('blue')).map(u => parseInt(u.replace(' ', '').replace(' blue', '')));
		const greens = value.split(',').filter(t => t.endsWith('green')).map(u => parseInt(u.replace(' ', '').replace(' green', '')));

		acc.red = acc.red.concat(...reds);
		acc.blue = acc.blue.concat(...blues);
		acc.green = acc.green.concat(...greens);
		return acc;
	}, {red: [], blue: [], green: []});

	const redCount = Math.max(...partionedSamples.red);
	const blueCount = Math.max(...partionedSamples.blue);
	const greenCount = Math.max(...partionedSamples.green);

	const power = redCount * blueCount * greenCount;
	output += power;
	// console.log(">>>power", power)
	// const validReds = !partionedSamples.red.some(([s]) => !isNaN(+s) && +s > MAX_RED);
	// const validBlues = !partionedSamples.blue.some(([s]) => !isNaN(+s) && +s > MAX_BLUE);
	// const validGreens = !partionedSamples.green.some(([s]) => !isNaN(+s) && +s > MAX_GREEN);
	// console.log(">>>samples", samples)
	// console.log(">>>partionedSamples", {partionedSamples, minRed, minBlue, minGreen})
	// console.log({
	// 	validReds,
	// 	validBlues,
	// 	validGreens,
	// })
	// const validGame = validReds && validBlues && validGreens;
	// if (validGame) {
	// 	validGameIds.push(+gameId);
	// }

	// if (gameId === "93") {
	// 	console.log(partionedSamples.red);
	// 	console.log(partionedSamples.green);
	// 	console.log(partionedSamples.blue);
	// 	console.log(">>>validGame", validGame)
	// }
	// console.log(">>>validGame", {validGame, gameId})
}

// const total = validGameIds.reduce((acc, curr) => acc + curr, 0);

// 3086: too low
// 63711
console.log(">>>output", output)
