const fs = require('fs');
const R = require('ramda');;

const input = fs.readFileSync('./data.txt', 'utf8');

const inputArray = input.split('\n');

const isFullHouse = (hand) => {
	const hasThreeOfAKind = R.values(R.groupBy(R.identity, hand.split(''))).some(pair => pair.length === 3);
	const hasTwoOfAKind = R.values(R.groupBy(R.identity, hand.split(''))).some(pair => pair.length === 2);
	return hasThreeOfAKind && hasTwoOfAKind;
};

const matchers = [
	{ name: 'fiveOfAKind', fn: (hand) => R.values(R.groupBy(R.identity, hand.split(''))).some(pair => pair.length === 5) },
	{ name: 'fourOfAKind', fn: (hand) => R.values(R.groupBy(R.identity, hand.split(''))).some(pair => pair.length === 4) },
	{ name: 'fullHouse', fn: isFullHouse },
	{ name: 'threeOfAKind', fn: (hand) => !isFullHouse(hand) && R.values(R.groupBy(R.identity, hand.split(''))).some(pair => pair.length === 3) },
	{ name: 'twoPair', fn: (hand) => R.values(R.groupBy(R.identity, hand.split(''))).filter(pair => pair.length === 2).length === 2 },
	{ name: 'onePair', fn: (hand) => !isFullHouse(hand) && R.values(R.groupBy(R.identity, hand.split(''))).filter(pair => pair.length === 2).length === 1 },
	{ name: 'highCard', fn: (hand) => true },
]
const getMatchesForHand = (hand) => matchers.reduce((accum, {name, fn}) => {
	accum[name] = fn(hand);
	return accum;
}, {});

const gatherHands = (handsData) => handsData.reduce((accum, line) => {
	const [hand, bid] = line.split(' ');
	const matches = getMatchesForHand(hand);
	accum.push({hand, bid, matches});
	return accum;
}, []);

const handRankOrder = {
	fiveOfAKind: 1,
	fourOfAKind: 2,
	fullHouse: 3,
	threeOfAKind: 4,
	twoPair: 5,
	onePair: 6,
	highCard: 7,
}

const getHandRank = (hand) => {
	if (hand.matches.fiveOfAKind) return handRankOrder.fiveOfAKind;
	if (hand.matches.fourOfAKind) return handRankOrder.fourOfAKind;
	if (hand.matches.fullHouse) return handRankOrder.fullHouse;
	if (hand.matches.threeOfAKind) return handRankOrder.threeOfAKind;
	if (hand.matches.twoPair) return handRankOrder.twoPair;
	if (hand.matches.onePair) return handRankOrder.onePair;

	return handRankOrder.highCard;
}

const cardRankOrder = {
	A: 1,
	K: 2,
	Q: 3,
	J: 4,
	T: 5,
	9: 6,
	8: 7,
	7: 8,
	6: 9,
	5: 10,
	4: 11,
	3: 12,
	2: 13,
}

const fightOverHighestCard = (handA, handB) => {
	let hasHigherCard = false;
	for (let i = 0; i < handA.length; i++) {
		const cardARank = cardRankOrder[handA[i]];
		const cardBRank = cardRankOrder[handB[i]];
		// console.log(">>>higherCardFIght", cardARank, cardBRank, cardARank > cardBRank)

		if (cardARank !== cardBRank) {
			hasHigherCard = cardARank > cardBRank;
			break;
		}
	}

	return hasHigherCard;
}

const sortLikeRankedHands = (hands) => {
	const sortedHands = [...hands];
	let n = sortedHands.length;
	let swapped;

	do {
		swapped = false;
		for (let i = 1; i < n; i++) {
			const handA = sortedHands[i - 1];
			const handB = sortedHands[i];

			if (fightOverHighestCard(handA.hand, handB.hand)) {
				let temp = sortedHands[i - 1];
				sortedHands[i - 1] = sortedHands[i];
				sortedHands[i] = temp;
				swapped = true;
			}
		}
		n--;
	} while (swapped);

	return sortedHands;
}

const processHands = R.pipe(
	R.map(hand => ({...hand, rank: getHandRank(hand)})),
	R.groupBy(R.prop('rank')),
	R.values(),
	R.map(sortLikeRankedHands),
	R.flatten,
	R.map(({hand, bid}) => ({hand, bid})),
	R.reverse,
);

const addRankToHand = (hands) => {
	hands.forEach((hand, index) => {
		hand.rank = index + 1;
		hand.bid = Number(hand.bid);
		hand.winnings = hand.rank * hand.bid;
	});

	return hands;
}

const calculateWinnings = (hands) => hands.reduce((accum, hand, index) => accum += hand.winnings, 0);

const output = R.pipe(gatherHands, processHands, addRankToHand)(inputArray);

const winnings = calculateWinnings(output);
console.log(">>>winnings", winnings);

// fs.writeFileSync('./output.csv', '');
// for (let line of output) {
// 	fs.appendFileSync('./output.csv', `${line.rank},${line.hand},${line.bid},${line.winnings}\n`);
// }

// 252295678