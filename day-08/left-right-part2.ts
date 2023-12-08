import fs from 'fs/promises';

const nodeMatch = /^(\w+) = \((\w+), (\w+)\)$/

interface PathToEnd {
    initialSteps: number;
    cycleLength: number;
    startNode: string;
    endNode: string;
}

function gcd(a: number, b: number): number {
    return !b ? a : gcd(b, a % b);
}

function lcm(a: number, b: number): number {
    return (a * b) / gcd(a, b);   
}

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
    const startingNodes: string[] = [];
    const endingNodes: string[] = [];
    let row: string|undefined;
    while(row = data.shift()) {
        const matches = nodeMatch.exec(row);
        if (matches) {
            nodes[matches[1]] = [matches[2], matches[3]];

            if (matches[1].endsWith('A')) {
                startingNodes.push(matches[1]);
            } else if (matches[1].endsWith('Z')) {
                endingNodes.push(matches[1]);
            }
        }
    }

    const paths: PathToEnd[] = startingNodes.map(node => {
        let position = node;
        let initialSteps = 0;
        let endNode: string|undefined = undefined;
        end: while (true) {
            for (let i = 0; i < directions.length; i++) {
                position = nodes[position][directions[i]];
    
                if (position.endsWith('Z')) {
                    initialSteps += i + 1;
                    endNode = position;
                    break end;
                }
            }
    
            initialSteps += directions.length;
        }

        let cycleLength = 0;
        cycle: while (true) {
            for (let i = 0; i < directions.length; i++) {
                position = nodes[position][directions[i]];
    
                if (position.endsWith('Z')) {
                    cycleLength += i + 1;

                    if (position !== endNode) {
                        throw new Error('this is more complicated');
                    }
                    break cycle;
                }
            }
    
            cycleLength += directions.length;
        }

        return {
            startNode: node,
            initialSteps,
            endNode,
            cycleLength
        }
    });

    // Turns out cycles are the same length as initial steps which simplifies the calculation a lot
    const steps = paths.map(path => path.initialSteps).sort();
    // Just get steps least common multiple
    let multiple = steps[0];
    steps.forEach(n => (multiple = lcm(multiple, n)));

    console.log(multiple);
}
