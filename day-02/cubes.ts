import fs from 'fs/promises';

const ballMatch = /(\d+) (red|green|blue)/

async function read() {
    const file = await fs.readFile(__dirname + '/data.txt');
    const data = file.toString().split('\n');

    let result = 0;

    for (const game of data) {
        const [gameInfo, rolls] = game.split(':');

        let valid = true;
        allRolls: for (const roll of rolls.split(';')) {
            for (const ball of roll.split(',')) {
                const match = ballMatch.exec(ball);
                if (!match) {
                    break allRolls;
                }

                const num = Number.parseInt(match[1], 10);
                switch (match[2]) {
                    case 'blue':
                        valid = num <= 14;
                        break;
                    case 'green':
                        valid = num <= 13;
                        break;
                    case 'red':
                        valid = num <= 12;
                        break;
                }

                if (!valid) {
                    break allRolls;
                }
            }
        }

        if (valid) {
            const gameId = Number.parseInt(game.trim().slice(5), 10);
            result += gameId;
        }
    }

    console.log(result);
}

export function run() {
    void read();
}