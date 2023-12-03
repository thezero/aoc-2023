import fs from 'fs/promises';

function add(counter: number, start: string|undefined, end: string|undefined): number {
    if (start === undefined || end === undefined) {
        return counter;
    }

    // No error handling, this should fail if we have wrong data
    const num = Number.parseInt(start + end, 10);
    return counter + num;
}

async function read() {
    const data = await fs.readFile(__dirname + '/data.txt');
    const characters = data.toString();

    let index = 0;

    let start: string|undefined = undefined;
    let end: string|undefined = undefined;
    let result = 0;
    while (index < characters.length) {
        if (characters[index] >= '0' && characters[index] <= '9') {
            if (start === undefined) {
                start = characters[index];
            }
            end = characters[index];
        } else if (characters[index] === '\n') {
            result = add(result, start, end);
            start = undefined;
            end = undefined;
        }

        ++index;
    }

    // If the file doesn't end with \n we need to count last line
    result = add(result, start, end);

    console.log(result);
}

export function run() {
    void read();
}