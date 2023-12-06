const fs = require('fs');

const input = fs.readFileSync('./data.txt', 'utf8');

const inputArray = input.split('\n');

const getCardNumber = (line) => line.split(':')[0].replace('Card ', '').replace(' ', '');
const getWinners = (line) => line.split(':')[1].split('|')[0].split(' ').filter(Boolean).map(Number);
const getMine = (line) => line.split(':')[1].split('|')[1].split(' ').filter(Boolean).map(Number);
const getCommon = (winners, mine) => {
	const common = mine.filter(value => winners.includes(value));
	return common;
}
const calculateScore = total => total === 0 ? 0 : 1 * Math.pow(2, total - 1);

let total = 0;
for (let line of inputArray) {
	const cardNumber = getCardNumber(line);
	const winners = getWinners(line);
	const mine = getMine(line);
	const common = getCommon(winners, mine);
	const score = calculateScore(common.length);

	total += score;
	// console.log(">>>cardNumber", parseInt(cardNumber), common.length, score)
}

console.log(">>>total", total)