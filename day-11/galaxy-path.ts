import fs from 'fs/promises';

const MODIFIER_PART1 = 1;
const MODIFIER_PART2 = 1000000 - 1;

export async function run() {
    const file = await fs.readFile(__dirname + '/data.txt');
    const data = file.toString().split('\n');
    const colCount = data[0].length;

    const modifier = MODIFIER_PART2;
    let galaxies = 0;
    const emptyCols: number[] = [];
    for (let x = 0; x < colCount; x++) {
        let empty = true;
        for (let y = 0; y < data.length; y++) {
            if (data[y][x] !== '.') {
                empty = false;
                break;
            }
        }

        if (empty) {
            emptyCols.push(x);
        }
    }
    const emptySet = new Set(emptyCols);

    const locations: Record<number, [number, number]> = {};
    let yoffset = 0;
    for (let y = 0; y < data.length; y++) {
        let tmpId = galaxies, xoffset = 0;
        for (let x = 0; x < colCount; x++) {
            if (emptySet.has(x)) {
                xoffset+=modifier;
            } else if (data[y][x] === '#') {
                locations[++galaxies] = [y + yoffset, x + xoffset];
            }
        }

        if (tmpId === galaxies) {
            // No galaxy in last row
            yoffset+=modifier;
        }
    }

    let sumPaths = 0;
    for (let id = 1; id <= galaxies - 1; id++) {
        for (let second = id + 1; second <= galaxies; second++) {
            const [ay, ax] = locations[id];
            const [by, bx] = locations[second];

            const dst = by - ay + (bx > ax ? bx - ax : ax - bx);
            
            sumPaths += dst;
        }
    }

    console.log(sumPaths);
}
