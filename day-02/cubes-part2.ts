import fs from 'fs/promises';

const ballMatch = /(\d+) (red|green|blue)/

export async function run() {
    const file = await fs.readFile(__dirname + '/data.txt');
    const data = file.toString().split('\n');

    let result = 0;

    for (const game of data) {
        const [gameInfo, rolls] = game.split(':');

        const tracker = {
            green: 1,
            red: 1,
            blue: 1
        }
        for (const roll of rolls.split(';')) {
            for (const ball of roll.split(',')) {
                const match = ballMatch.exec(ball);
                if (!match) {
                    continue;
                }

                const num = Number.parseInt(match[1], 10);
                switch (match[2]) {
                    case 'blue':
                        tracker.blue = Math.max(tracker.blue, num)
                        break;
                    case 'green':
                        tracker.green = Math.max(tracker.green, num)
                        break;
                    case 'red':
                        tracker.red = Math.max(tracker.red, num)
                        break;
                }
            }
        }

        result += tracker.blue * tracker.green * tracker.red;
    }

    console.log(result);
}
