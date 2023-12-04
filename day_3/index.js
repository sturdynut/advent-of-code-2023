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
	// {value: '%', location: [0,11]}
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
				map.symbols.push({value: char, location: [x, y]});
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

// Find numbers with symbols on their borders
const rawNumbersWithSymbols = map.numbers.filter(({border}) => {
	return map.symbols.some(({location}) => {
		return border.some(([x, y]) => {
			return location[0] === x && location[1] === y;
		})
	})
});

const numbersWithSymbols = rawNumbersWithSymbols.map(({value, location}) => value);

// console.log(">>>map", JSON.stringify(map))
// console.log(">>>rawNumbersWithSymbols", JSON.stringify(rawNumbersWithSymbols))
console.log(">>>numbersWithSymbols", JSON.stringify(numbersWithSymbols))

const total = numbersWithSymbols.reduce((acc, curr) => acc + curr, 0);

// 487943: too low
// 535351
console.log(">>>total", total)