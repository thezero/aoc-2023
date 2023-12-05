import fs from 'fs/promises';
import process = require('process');

interface MapRange {
    start: number;
    end: number;
    destinationStart: number;
}

export async function run() {
    const file = await fs.readFile(__dirname + '/data.txt');
    const data = file.toString().split('\n');

    // Get seeds and next line
    const seedDef = data.shift()?.slice(7)?.split(' ') ?? [];
    data.shift();

    const maps: MapRange[][] = [
        [], // seedToSoil
        [], // soilToFertilizer
        [], // fertilizerToWater
        [], // waterToLight
        [], // lightToTemperature
        [], // temperatureToHumidity
        [], // humidityToLocation
    ]

    let currentMap = [];
    let row = data.shift();
    while (row !== undefined) {
        switch (row) {
            case 'seed-to-soil map:':
                currentMap = maps[0];
                break;
            case 'soil-to-fertilizer map:':
                currentMap = maps[1];
                break;
            case 'fertilizer-to-water map:':
                currentMap = maps[2];
                break;
            case 'water-to-light map:':
                currentMap = maps[3];
                break;
            case 'light-to-temperature map:':
                currentMap = maps[4];
                break;
            case 'temperature-to-humidity map:':
                currentMap = maps[5];
                break;
            case 'humidity-to-location map:':
                currentMap = maps[6];
                break;
            case '':
                break;
            default:
                const [destinationStartStr, startStr, lengthStr] = row.split(' ');
                const start = parseInt(startStr);
                currentMap.push({
                    destinationStart: parseInt(destinationStartStr),
                    start,
                    end: start + parseInt(lengthStr) - 1
                });
                break;
        }

        row = data.shift();
    }

    // Sort maps for searching
    maps.forEach(map => map.sort((a, b) => a.start - b.start));

    let result = Number.MAX_SAFE_INTEGER;
    for (let seedIndex = 0; seedIndex < seedDef.length; seedIndex += 2) {
        const start = parseInt(seedDef[seedIndex]);
        const len = parseInt(seedDef[seedIndex + 1]);

        console.log('Starting new def', start, len);

        for (let seed = start; seed < start + len; seed++) {
            const offset = seed - start;
            if (!(offset % 10000000)) {
                console.log('  another 10M');
            }
            let location = seed;

            for (let mapId = 0; mapId < maps.length; mapId++) {
                for (let i = 0; i < maps[mapId].length; i++) {
                    const range = maps[mapId][i];
                    if (location > range.end) {
                        continue;
                    }
                    if (location >= range.start) {
                        location = location - range.start + range.destinationStart;
                    }
                    // else location is not mapped and stays unchanged
                    break;
                }
            }

            result = Math.min(result, location);
        }

    }

    console.log(result);
}
