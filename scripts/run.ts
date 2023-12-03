import process from 'process';

const id = process.argv.pop() ?? '';
if (!/^\d+$/.exec(id)) {
    throw new Error('Provide id of test to run');
}

async function run() {
    const script = await import('../day-' + id);
    await script.run();
}

void run();
