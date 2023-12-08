const fs = require('fs');

const input = fs.readFileSync('./data.txt', 'utf8');

const inputArray = input.split('\n');

const times = inputArray[0].split('Time:      ')[1].split(' ').filter(Boolean).map(Number);
const distances = inputArray[1].split('Distance:  ')[1].split(' ').filter(Boolean).map(Number);
console.log(">>>", {times, distances})

const numberWaysToWin = [];
for (let i = 0; i < times.length; i++) {
	const time = times[i];
	const record = distances[i];
	const winningHolds = [];

	for (let j = 0; j < time; j++) {
		const holdLength = j;
		const timeToMove = time - holdLength;
		const distanceMoved = timeToMove * holdLength;

		if (distanceMoved > record) {
			winningHolds.push(holdLength);
		}
	}

	numberWaysToWin.push(winningHolds.length);
	console.log(">>>winningHolds", {time, record, winningHolds})
}

const result = numberWaysToWin.reduce((acc, num) => acc * num, 1);

console.log(">>>result", result)