import fs from 'fs/promises';

function getBit(num: number, position: number){
    return (num>>position) % 2
}

export async function run() {
    const file = await fs.readFile(__dirname + '/data.txt');
    const data = file.toString().split('\n');

    let result = 0;
    for (let row = 0; row < data.length; row++) {
        const [mapStr, checksum] = data[row].split(' ');
        const groups = checksum.split(',').map(x => parseInt(x));

        const wildcards = mapStr.split('').reduce((prev: number[], curr: string, index: number) => {
            if (curr === '?') {
                prev.push(index);
            }
            return prev;
        }, []);

        const regex = new RegExp('^\\.*' + '#'.repeat(groups[0]) + (groups.slice(1).map(n => '\\.+' + '#'.repeat(n))).join('') + '\\.*$');

        const permutations = Math.pow(2, wildcards.length);
        for (let perm = 0; perm < permutations; perm++) {
            let str = mapStr.split('');
            for (let i = 0; i < wildcards.length; i++) {
                str[wildcards[i]] = getBit(perm, i) ? '#' : '.';
            }

            if (regex.test(str.join(''))) {
                result++;
            }
        }
    }

    console.log(result);
}
