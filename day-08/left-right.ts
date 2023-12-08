import fs from 'fs/promises';

const nodeMatch = /^(\w+) = \((\w+), (\w+)\)$/

export async function run() {
    const file = await fs.readFile(__dirname + '/data.txt');
    const data = file.toString().split('\n');

    const directions = (data.shift()?.split('') ?? []).map(s => s === 'L' ? 0 : 1);
    if (!directions.length) {
        throw new Error('no directions');
    }
    // Empty second line
    data.shift();

    const nodes: Record<string, [string, string]> = {};
    let row: string|undefined;
    while(row = data.shift()) {
        const matches = nodeMatch.exec(row);
        if (matches) {
            nodes[matches[1]] = [matches[2], matches[3]];
        }
    }

    let position = 'AAA';
    let result = 0;
    directions: while (position !== 'ZZZ') {
        for (let i = 0; i < directions.length; i++) {
            position = nodes[position][directions[i]];

            if (position === 'ZZZ') {
                result += i + 1;
                break directions;
            }
        }

        result += directions.length;
        if (position === 'AAA') {
            throw new Error('in a loop')
        }
    }

    console.log(result);
}
