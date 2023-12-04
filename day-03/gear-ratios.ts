import fs from 'fs/promises';

export async function run() {
    const data = await fs.readFile(__dirname + '/data.txt');
    const lines = data.toString().split('\n');

    // Create 2d array with 0 as default value. Add 2 rows/cols as padding so we don't have to check boundaries
    // with every symbol we mark
    const maskMap = Array.from(Array(lines[0].length + 2), () => Array.from(Array(lines.length + 2), () => 0));

    for (let row = 0; row < lines.length; row++) {
        for (let col = 0; col < lines[row].length; col++) {
            if (lines[row][col] === '.' || (lines[row][col] >= '0' && lines[row][col] <= '9')) {
                continue;
            }

            // Indexes are off because of the padding (row + 1 means the same position in padded array)
            maskMap[row][col] = 1;
            maskMap[row][col + 1] = 1;
            maskMap[row][col + 2] = 1;
            maskMap[row + 1][col] = 1;
            maskMap[row + 1][col + 1] = 1;
            maskMap[row + 1][col + 2] = 1;
            maskMap[row + 2][col] = 1;
            maskMap[row + 2][col + 1] = 1;
            maskMap[row + 2][col + 2] = 1;
        }
    }

    let total = 0;
    lines.forEach((line, index) => {
        const check = (i: number) => {
            for (let col = i - len; col < i; col++) {
                if (maskMap[index + 1][col + 1] === 1) {
                    total += num;
                    break;
                }
            }
        }


        let num = 0;
        let len = 0;
        for (let i = 0; i < line.length; i++) {
            if (line[i] >= '0' && line[i] <= '9') {
                num = num * 10 + line.charCodeAt(i) - 48;
                len++;
            } else if (num > 0) {
                check(i);
                num = 0;
                len = 0;
            }
        }

        check(line.length);
    })

    console.log(total);
}
