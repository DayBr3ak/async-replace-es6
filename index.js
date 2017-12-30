const DO_NOTHING = () => {};

function makePromiseSeq(promiseFn) {
    let top = Promise.resolve();
    return (...args) => {
        top = top
            .catch(DO_NOTHING)
            .then(() => promiseFn(...args));
        return top;
    };
}

async function replace(str, regex, asyncFn, notifyCb = DO_NOTHING) {
    const promises = [];
    str.replace(regex, (match, ...args) => {
        const promise = asyncFn(match, ...args)
        promises.push(promise);
        promise
            .then(notifyCb)
            .catch(DO_NOTHING);
    });
    const data = await Promise.all(promises);
    return str.replace(regex, () => data.shift());
}

function replaceSeq(str, regex, asyncFn, notifyCb = DO_NOTHING) {
    const asyncFnSeq = makePromiseSeq(asyncFn);
    return replace(str, regex, asyncFnSeq, notifyCb);
}

module.exports = {
    replace,
    replaceSeq,

    // support es6 default import
    default: {
        replace,
        replaceSeq
    }
}
