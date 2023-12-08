const fs = require('fs');

const input = fs.readFileSync('./data.txt', 'utf8');

const inputArray = input.split('\n');

const times = inputArray[0].split('Time:      ')[1].split(' ').filter(Boolean);
const distances = inputArray[1].split('Distance:  ')[1].split(' ').filter(Boolean);


const totalTime = Number(times.reduce((acc, num) => acc + num, ''));
const totalDistance = Number(distances.reduce((acc, num) => acc + num, ''));
console.log(">>>", {totalTime, totalDistance})

const numberWaysToWin = [];
const winningHolds = [];

for (let j = 0; j < totalTime; j++) {
	const holdLength = j;
	const timeToMove = totalTime - holdLength;
	const distanceMoved = timeToMove * holdLength;

	if (distanceMoved > totalDistance) {
		winningHolds.push(holdLength);
	}
}

console.log(">>>winningHolds", winningHolds.length)
