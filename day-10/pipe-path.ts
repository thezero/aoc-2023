import fs from 'fs/promises';

enum Direction {
    Top,
    Bottom,
    Left,
    Right,
}

const connectingTiles: Record<Direction, Set<String>> = {
    [Direction.Top]: new Set(['|', '7', 'F']),
    [Direction.Bottom]: new Set(['|', 'L', 'J']),
    [Direction.Left]: new Set(['-', 'L', 'F']),
    [Direction.Right]: new Set(['-', 'J', '7']),
}

const directions: Record<Direction, Set<String>> = {
    [Direction.Top]: new Set(['S', '|', 'L', 'J']),
    [Direction.Bottom]: new Set(['S', '|', '7', 'F']),
    [Direction.Left]: new Set(['S', '-', 'J', '7']),
    [Direction.Right]: new Set(['S', '-', 'L', 'F']),
}

export async function run() {
    const file = await fs.readFile(__dirname + '/data.txt');
    const data = file.toString().split('\n');
    const colCount = data[0].length;

    // Create 2d array. Add 2 rows/cols as padding so we don't have to check boundaries
    // with every symbol we mark
    const map: (number|undefined)[][] = Array.from(Array(data.length), () => Array.from(Array(colCount), () => undefined));

    function connects(x: number, y: number, direction: Direction) {
        // If current tile is not facing there, no point in checking the other connection
        if (!directions[direction].has(data[y][x])) {
            return false;
        }

        let tile: string;
        switch (direction) {
            case Direction.Top:
                if (y === 0) {
                    return false;
                }
                tile = data[y - 1][x];
                break;
            case Direction.Bottom:
                if (y === data.length - 1) {
                    return false;
                }
                tile = data[y + 1][x];
                break;
            case Direction.Left:
                if (x === 0) {
                    return false;
                }
                tile = data[y][x - 1];
                break;
            case Direction.Right:
                if (x === colCount - 1) {
                    return false;
                }
                tile = data[y][x + 1];
                break;
        }
        return connectingTiles[direction].has(tile);
    }

    let sx = 0, sy = 0;
    let nextPaths: [number, number][] = [];
    start: for (; sy < map.length; sy++) {
        for (sx = 0; sx < map[sy].length; sx++) {
            if (data[sy][sx] === 'S') {
                nextPaths.push([sy, sx]);
                break start;
            }
        }
    }

    let distance = 0;
    do {
        const current = nextPaths;
        nextPaths = [];
        for (const [y, x] of current) {
            if (map[y][x] !== undefined) {
                continue;
            }
            map[y][x] = distance;
            
            if (connects(x, y, Direction.Top)) {
                nextPaths.push([y - 1, x]);
            }
            if (connects(x, y, Direction.Bottom)) {
                nextPaths.push([y + 1, x]);
            }
            if (connects(x, y, Direction.Left)) {
                nextPaths.push([y, x - 1]);
            }
            if (connects(x, y, Direction.Right)) {
                nextPaths.push([y, x + 1]);
            }
        }

        distance++;
    } while (nextPaths.length);

    // Distance - 2 because at max distance we'll find some connecting points 
    // we need to test in next loop and they'll fail and we'll increment distance
    // once more after that
    console.log(distance - 2);
}
