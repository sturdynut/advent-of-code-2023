const fs = require('fs');

const input = fs.readFileSync('./data.txt', 'utf8');

const inputArray = input.split('\n');

let total = 0;
for (let line of inputArray) {
	const numbersOnly = [...line.matchAll(/\d+/g)].join('');
	let result = 0;
	if (numbersOnly.length > 0) {
		const first = numbersOnly.charAt(0);
		const last = numbersOnly.length > 1 ? numbersOnly.charAt(numbersOnly.length - 1) : first;
		result = parseInt(first + last);
		total += result;
	}
	console.log(">>>result", result)
}

//10294 too low
console.log(">>>total", total)