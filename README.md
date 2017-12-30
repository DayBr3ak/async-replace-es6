
Run replace on a string with an asynchronous function (promises).

## Usage

async-replace-es6 is has the same api as `String.prototype.replace`. Only the callback is an async function.

This is usefull if you need the matched part of a string before running an asynchronous operation.

```js
import { replace } from 'async-replace-es6';
const { replace } = require('async-replace-es6');
```

```js
const replaced = await replace(originalString, /someregex/g, asyncReplacer);
```

Or

```js
replace(originalString, /someregex/, asyncReplacer)
    .then(replaced => console.log(replaced));
```

Example of asynchronous replacer :

```js
async function asyncReplace(match, group1, group2, ...) {
    // here match is an url
    const response = await fetch(match);
    const json = await reponse.json();
    return json['title'];
}

function asyncReplacer(match, ...groups) {
    // match is a file path
    return new Promise((resolve, reject) => {
        fs.readFile(match, (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(data);
        });
    });
}
```

If your promises needs to be done Sequentially here is a solution:

```js
const { replaceSeq } = require('async-replace-es6');

replaceSeq(originalString, /someregex/g, asyncReplacer)
    .then(replaced => console.log(replaced));
```

