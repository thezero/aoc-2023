import fs from 'fs/promises';

const conversionMap: Record<string, string> = {
    'one': '1',
    'two': '2',
    'three': '3',
    'four': '4',
    'five': '5',
    'six': '6',
    'seven': '7',
    'eight': '8',
    'nine': '9',
}

function add(counter: number, start: string|undefined, end: string|undefined): number {
    if (start === undefined || end === undefined) {
        return counter;
    }

    const convertedStart = start in conversionMap ? conversionMap[start] : start;
    const convertedEnd = end in conversionMap ? conversionMap[end] : end;

    // No error handling, this should fail if we have wrong data
    const num = Number.parseInt(convertedStart + convertedEnd, 10);
    return counter + num;
}

// (numbers|one|two...)
const matchPattern = '([1-9]|' + Object.keys(conversionMap).join('|') + ')';
const startPattern = new RegExp('.*?' + matchPattern);
const endPattern = new RegExp('.*' + matchPattern);

async function read() {
    const data = await fs.readFile(__dirname + '/data.txt');
    const lines = data.toString().split('\n');

    let result = 0;
    for (const line of lines) {
        const start = startPattern.exec(line);
        const end = endPattern.exec(line);
        if (start && end) {
            result = add(result, start[1], end[1]);
        }
    }

    console.log(result);
}

export function run() {
    void read();
}
