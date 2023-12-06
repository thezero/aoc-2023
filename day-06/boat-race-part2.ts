import fs from 'fs/promises';

export async function run() {
    const file = await fs.readFile(__dirname + '/data.txt');
    const data = file.toString().split('\n');


    const timeData = [data.shift()?.slice(5).replaceAll(' ', '') ?? ''];
    const distanceData = [data.shift()?.slice(9).replaceAll(' ', '') ?? ''];

    const variants = timeData.map((timeStr, index) => {
        const time = parseInt(timeStr);
        const record = parseInt(distanceData[index]);

        let options = 0;
        for (let charge = 1; charge < time; charge++) {
            const distance = (time - charge) * charge;
            if (distance > record) {
                options++;
            }
            // Optimization - distance will only decrease now
            if (distance < record && options) {
                break;
            }
        }

        return options;
    });

    const result = variants.reduce((prev, curr) => curr ? prev * curr : prev, 1);

    console.log(result);
}
