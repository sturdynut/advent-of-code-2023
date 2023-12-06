const fs = require('fs');

const input = fs.readFileSync('./data.txt', 'utf8');

const inputArray = input.split('\n');

const getCardNumber = (line) => line.split(':')[0].replace('Card ', '').replace(' ', '').trim();
const getWinners = (line) => line.split(':')[1].split('|')[0].split(' ').filter(Boolean).map(Number);
const getMine = (line) => line.split(':')[1].split('|')[1].split(' ').filter(Boolean).map(Number);
const getMatches = (winners, mine) =>  mine.filter(value => winners.includes(value))
const calculateNumScratchCardsWon = (cardNumber, numberOfWinners) => {
	return new Array(numberOfWinners).fill(null).reduce((acc, num) => {
		const last = acc.at(-1);
		const next = last ? parseInt(last) + 1 : parseInt(cardNumber) + 1;
		acc.push(next);
		return acc;
	}, []);
}

const getTotal = (cardNumber, cardCopies, cardMatchMap) => {
	if (cardCopies === 0) {
		return 0;
	}

	const total = cardCopies.reduce((acc, cardCopyNumber) => {
		return acc += getTotal(cardCopyNumber, cardMatchMap[cardCopyNumber], cardMatchMap);
	}, 1); // 1 for cardNumber being a winner

	return total;
}

const gatherTotals = (scratchCards, cardNumber) => {
	const scratchCardsWon = scratchCards[String(cardNumber)];
	if (scratchCardsWon === undefined || scratchCardsWon.length === 0) {
		return 0;
	}

	// Add one if there are winners
	let total = scratchCardsWon.length > 0 ? 1 : 0;

	total += scratchCardsWon.reduce((accum, winnerCardNum) => {
		accum += 1; // Add one for the winner card
		accum += gatherTotals(scratchCards, winnerCardNum);
		return accum;
	}, 0);

	return total;
}

const scratchCards = {}
for (let line of inputArray) {
	const cardNumber = getCardNumber(line);
	const winners = getWinners(line);
	const mine = getMine(line);
	const matches = getMatches(winners, mine);
	const numberOfMatches = matches.length;
	const scratchCardsWon = calculateNumScratchCardsWon(cardNumber, numberOfMatches);
	// console.log(">>>", {matches, scratchCardsWon})

	scratchCards[cardNumber] = scratchCardsWon;
}

const cardNumbers = Object.keys(scratchCards);
const total = cardNumbers.reduce((acc, cardNumber) => {
	return acc + getTotal(cardNumber, scratchCards[cardNumber], scratchCards);
}, 0);

//5920640
console.log(">>>total", total);