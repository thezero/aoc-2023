import fs from 'fs/promises';

enum HandType {
    HighCard,
    OnePair,
    TwoPair,
    ThreeCards,
    FullHouse,
    FourCards,
    FiveCards,
}

interface Hand {
    type: HandType;
    cards: number[];
}

interface Bet extends Hand {
    bet: number;
}

const CARD_TO_VALUE: Record<string, number> = {
    'J': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    'T': 10,
    'Q': 12,
    'K': 13,
    'A': 14,
}

function parseCards(input: string): Hand {
    const cards = input.split('').map(card => CARD_TO_VALUE[card]);

    const occurences: number[] = Array(15).fill(0);
    cards.forEach(card => occurences[card]++)

    const regularCards = occurences.slice(2);
    const maxOccurences = Math.max.apply(null, regularCards) + occurences[1];
    switch (maxOccurences) {
        case 5:
            return { type: HandType.FiveCards, cards };
        case 4:
            return { type: HandType.FourCards, cards };
        case 3: {
            const numPairs = regularCards.filter(x => x === 2).length;
            // If 'J' is here 2x it can't be full house because it's 4 of a kind
            const fullHouse = occurences[1] === 1 ? numPairs === 2 : numPairs === 1;
            return { type: fullHouse ? HandType.FullHouse : HandType.ThreeCards, cards };
        }
        case 2: {
            const numPairs = occurences.filter(x => x === 2).length;
            const hasDouble = numPairs === 2 || (numPairs === 1 && occurences[1] === 1);
            return { type: hasDouble ? HandType.TwoPair : HandType.OnePair, cards };
        }
    }

    return { type: HandType.HighCard, cards };
}

export async function run() {
    const file = await fs.readFile(__dirname + '/data.txt');
    const data = file.toString().split('\n');

    const hands: Bet[] = [];
    for (const row of data) {
        const [cards, betStr] = row.split(' ');
        hands.push({
            bet: parseInt(betStr),
            ...parseCards(cards),
        });
    }

    hands.sort((a, b) => {
        if (a.type !== b.type) {
            return a.type - b.type;
        }

        for (let i = 0; i < a.cards.length; i++) {
            if (a.cards[i] !== b.cards[i]) {
                return a.cards[i] - b.cards[i];
            }
        }

        console.log('identical hands');
        return 0;
    });

    const result = hands.reduce((prev, curr, index) => {
        return prev + curr.bet * (index + 1);
    }, 0);

    console.log(result);
}
