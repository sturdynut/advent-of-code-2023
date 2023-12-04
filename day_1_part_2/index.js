const fs = require('fs');

const wordNumbers = new Map(Object.entries({
	one: 1,
	two: 2,
	three: 3,
	four: 4,
	five: 5,
	six: 6,
	seven: 7,
	eight: 8,
	nine: 9,
}));

function findOverlappingMatches(str, pattern) {
	let matches = [];
	let match;

	for (let i = 0; i < str.length; i++) {
			for (let j = i + 1; j <= str.length; j++) {
					const substr = str.slice(i, j);
					const isStringNumber = wordNumbers.has(substr);
					const isNumber = !isNaN(+substr) && +substr > 0 && +substr < 10;
					const isMatch = pattern.test(substr);
					// console.log(substr, {isMatch, isStringNumber, isNumber})

					if (isStringNumber || isNumber) {
							matches.push(substr);
							break;
					}
			}
	}

	return matches;
}

const input = fs.readFileSync('./data.txt', 'utf8');

const inputArray = input.split('\n');

let total = 0;
for (let line of inputArray) {
	const matches = findOverlappingMatches(line, /one|two|three|four|five|six|seven|eight|nine|\d/g)
		.map(match => {
			const rawNumber = String(match);
			const actualNumber = wordNumbers.has(rawNumber) ? wordNumbers.get(rawNumber) : rawNumber;

			return String(actualNumber);
		})

	let first, last, result = 0;
	if (matches.length > 0) {
		first = matches[0];
		last = matches.length > 1 ? matches.slice(-1)[0] : first;
		result = parseInt(first + last);
		total += result;
	}
	console.log(line, matches, first, last, result)
}

// Too low: 57325
// Too high: 308278
// Nope: 53419
// 57345
console.log(">>>total", total)