import fs from 'fs/promises';

export async function run() {
    const file = await fs.readFile(__dirname + '/data.txt');
    const data = file.toString().split('\n');

    let result = 0;

    for (const card of data) {
        const [, numbers] = card.split(':');
        const [winning, mine] = numbers.split('|');

        const winningList = new Set(winning.split(' ').filter(Boolean));
        const mineList = mine.split(' ').filter(Boolean);

        let score = 0;
        for (const num of mineList) {
            if (winningList.has(num)) {
                score = score ? score * 2 : 1;
            }
        }
        result += score;
    }

    console.log(result);
}
