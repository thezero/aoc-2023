import fs from 'fs/promises';

function findPerfectReflectionLengthInner(map: string[], firstIndex: number): number {
    let mirrored = 0;
    let start = -1;

    for (let i = firstIndex; i < map.length; i++) {
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

function findPerfectReflectionLength(map: string[]): number[] {
    let results = [], n = 0;
    do {
        n = findPerfectReflectionLengthInner(map, n + 1);
        if (n) {
            results.push(n);
        }
    } while (n);

    return results;
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

function getPatterns(map: string[]): [number, number][] {
    const horizontal = findPerfectReflectionLength(map);
    const vertical = findPerfectReflectionLength(rotate(map));

    const allHorizontal: [number, number][] = horizontal.map(h => ([0, h]));
    const allVertical: [number, number][] = vertical.map(v => ([v, 0]));
    return [...allHorizontal, ...allVertical];
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

        const origPatterns = getPatterns(currentMap);
        if (origPatterns.length !== 1) {
            throw new Error();
        }
        for (let y = 0; y < currentMap.length; y++) {
            for (let x = 0; x < currentMap[y].length; x++) {
                const clone = [...currentMap];
                const replacement = clone[y][x] === '.' ? '#' : '.';
                clone[y] = clone[y].substring(0, x) + replacement + clone[y].substring(x + 1);
                const clonePatterns = getPatterns(clone);
                // Find first pattern that doesn't match any known patterns
                const different = clonePatterns.find(([vert, horiz]) => {
                    return !origPatterns.find(([origVertical, origHorizontal]) => {
                        return vert === origVertical && horiz === origHorizontal;
                    })
                });

                if (different) {
                    origPatterns.push(different);
                    const [vertical, horizontal] = different;
                    result += vertical + horizontal * 100;
                }
            }
        }
        console.log(origPatterns);

        currentMap = [];
    }

    console.log(result);
}
