const colors = require('colors/safe');
const { replace, replaceSeq } = require('./index.js');

const wait = t => new Promise(r => setTimeout(r, t));

function expect(x, expected) {
    if (x !== expected) {
        console.error(colors.red('  Error'));
        console.error(`Expected "${colors.red(x)}" to be "${colors.yellow(expected)}".`);
        process.exit(1);
    }
}

const TEMPLATE = '{token}';
const REGEX = /{([^}]*)}/g;

async function testBasic() {
    const str = await replace(`Sup, ${TEMPLATE}`, REGEX, () => {
        return Promise.resolve('Tom');
    });
    expect(str, 'Sup, Tom');
}

async function testDelay() {
    const str = await replace(`Sup, ${TEMPLATE}`, REGEX, async () => {
        await wait(200);
        return 'Ben';
    });
    expect(str, 'Sup, Ben');
}

async function testMultiple() {
    const names = [['Tom', 300], ['Ben', 200], ['Alice', 50]];
    const str = await replace(`Sup, ${TEMPLATE}, ${TEMPLATE}, ${TEMPLATE}`, REGEX, async () => {
        const [name, delay] = names.shift();
        await wait(delay);
        return name;
    });
    expect(str, 'Sup, Tom, Ben, Alice');
}

async function testMultipleSeq() {
    const names = [['Tom', 300], ['Ben', 200], ['Alice', 50]];
    const str = await replaceSeq(`Sup, ${TEMPLATE}, ${TEMPLATE}, ${TEMPLATE}`, REGEX, async () => {
        const [name, delay] = names.shift();
        await wait(delay);
        return name;
    });
    expect(str, 'Sup, Tom, Ben, Alice');
}

async function runTests() {
    await Promise.all([
        testBasic(),
        testDelay(),
        testMultiple(),
        testMultipleSeq(),
    ]);
}

runTests()
    .then(() => console.log(colors.green('All tests passed')))
    .catch(e => console.error(colors.red(e.stack)));
