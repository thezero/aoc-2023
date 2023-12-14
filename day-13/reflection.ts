import fs from 'fs/promises';

function findPerfectReflectionLength(map: string[]): number {
    let mirrored = 0;
    let start = -1;

    // console.log('\n' + map.join('\n'), '\n');

    for (let i = 1; i < map.length; i++) {
        const prevIndex = i - 1 - mirrored * 2;
        if (prevIndex < 0) {
            // Perfect reflection to the start
            break;
        }
        if (map[i] === map[prevIndex]) {
            if (start === -1) {
                start = i;
            }
            mirrored++;
        } else if (mirrored) {
            // No match, we didn't find the perfect reflection, start from next row
            mirrored = 0;
            i = start;
            start = -1;
        }
    }

    return start === -1 ? 0 : start;
}

function rotate(map: string[]): string[] {
    const newMap = Array.from(Array(map[0].length), () => Array(map.length));

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            newMap[x][y] = map[y][x];
        }
    }

    return newMap.map(row => row.join(''));
}

export async function run() {
    const file = await fs.readFile(__dirname + '/data.txt');
    const data = file.toString().split('\n');

    let result = 0;

    let currentMap = [];
    while (data.length) {
        const row = data.shift();

        if (row) {
            currentMap.push(row);
            if (data.length) {
                continue;
            }
        }

        const horizontal = findPerfectReflectionLength(currentMap);
        const vertical = findPerfectReflectionLength(rotate(currentMap));

        result += vertical + horizontal * 100;
        console.log('found ', vertical, ' vertical and ', horizontal, ' horizontal');

        currentMap = [];
    }

    console.log(result);
}
