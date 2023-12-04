const fs = require('fs');

const input = fs.readFileSync('./data.txt', 'utf8');

const inputArray = input.split('\n');

const getBorders = (x, y) => {
	const topBorder = y > 0 ? [
		[x, y - 1], // top
		[x+1, y - 1], // topR
		[x-1, y - 1], // topL
	] : [];

	return [
		...topBorder,
		[x + 1, y], // right
		[x - 1, y], // left
		[x, y + 1], // bottom
		[x+1, y + 1], // bottomR
		[x-1, y + 1], // bottomL
	];
}

const map = {
	// {value: 936, location: [[0, 7], [0, 8], [0,9]], border: [[0, 7], [0,10], [1,7], [1,8]]}
	numbers: [],
	// {value: '%', location: [0,11], border: [[0, 7], [0,10], [1,7], [1,8]]}
	symbols: []
};
const sep = '.'
let x = 0;
let y = 0;
for (let line of inputArray) {
	x = 0;
	// console.log(">>>", line);
	let lastChar = null;
	let lastCharIsNum = null;
	for (let char of line) {
		if (char !== sep) {
			if (!isNaN(+char)) {
				if (lastCharIsNum) {
					const lastNumber = map.numbers[map.numbers.length - 1];
					lastNumber.value = parseInt(`${lastNumber.value}${char}`);
					lastNumber.location.push([x, y]);
					lastNumber.border = lastNumber.border.concat(getBorders(x, y));
				} else {
					map.numbers.push({value: +char, location: [[x, y]], border: getBorders(x, y)});
				}
				// console.log(">>>char", char)
				matchedNumber = true;
			} else {
				map.symbols.push({value: char, location: [x, y], border: getBorders(x, y)});
				matchedNumber = false;
			}
		} else {
			matchedNumber = false;
		}

		lastChar = char;
		lastCharIsNum = !isNaN(+lastChar);

		x++;
	}
	y++;
}

const ratios = map.symbols.map(({value, border}) => {
	if (value === '*') {
		const matchedNumbers = map.numbers.filter(({location, value}) => {
			return location.some(([x, y]) => {
				return border.some(([sx, sy]) => {
					return x === sx && y === sy;
				});
			});
		}).map(({value}) => value);

		let ratio = null;
		if (matchedNumbers.length === 2) {
			ratio = matchedNumbers[0] * matchedNumbers[1];
		}

		// console.log(">>>matchedNumbers", matchedNumbers)
		return {matchedNumbers, ratio};
	}

	return null;
}).filter(Boolean);

// console.log(">>>ratios", JSON.stringify(ratios));

const result = ratios.reduce((acc, {ratio}) => acc + ratio, 0);
// console.log(">>>result", result);
