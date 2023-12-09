import fs from 'fs/promises';

function extrapolate(values: number[]): number {
    const steps: number[][] = [];
    do {
        let newValues: number[] = [];
        for (let i = 1; i < values.length; i++) {
            newValues.push(values[i] - values[i - 1]);
        }

        steps.push(values);
        values = newValues;
    } while (values.find(x => x !== 0));

    return steps.reduce((prev, curr) => {
        return prev + curr[curr.length - 1];
    }, 0);  
}

export async function run() {
    const file = await fs.readFile(__dirname + '/data.txt');
    const data = file.toString().split('\n');

    const extrapolatedValues = data.map(row => {
        let values = row.split(' ').filter(Boolean).map(x => parseInt(x));
        const test = values.slice(-1);
        const lastElement = extrapolate(test);
        if (lastElement !== values[values.length - 1]) {
            console.log(values);
            throw new Error('invalid interpolation');
        }
        return extrapolate(values);
    });

    const result = extrapolatedValues.reduce((prev, curr) => prev + curr, 0);
    extrapolatedValues.forEach(x => console.log(x));
    console.log(result);
}
