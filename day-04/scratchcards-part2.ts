import fs from 'fs/promises';

export async function run() {
    const file = await fs.readFile(__dirname + '/data.txt');
    const data = file.toString().split('\n');

    const copies = Array.from(Array(data.length), () => 1);

    data.forEach((card, index) => {
        const [, numbers] = card.split(':');
        const [winning, mine] = numbers.split('|');

        const winningList = new Set(winning.split(' ').filter(Boolean));
        const mineList = mine.split(' ').filter(Boolean);

        let matchCount = 0;
        for (const num of mineList) {
            if (winningList.has(num)) {
                matchCount++;
            }
        }

        for (let i = 0; i < matchCount; i++) {
            copies[i + index + 1] += copies[index];
        }
    });

    const result = copies.reduce((prev, curr) => {
        return prev + curr;
    }, 0);

    console.log(result);
}
