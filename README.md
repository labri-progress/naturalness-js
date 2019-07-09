# naturalness

Library implementing ["On the Naturalness of Software"](https://people.inf.ethz.ch/suz/publications/natural.pdf)

```console
npm install
```

```console
npm test
```

```javascript
const naturalness = require('./index.js');
const Event = naturalness.Event;
const Sequence = naturalness.Sequence;
const NaturalnessModel = naturalness.NaturalnessModel;

let a = new Event('a');
let b = new Event('b');
let c = new Event('c');
let d = new Event('d');
let e = new Event('e');
let f = new Event('f');

let one = new Sequence([a, b, c, d, e]);
let two = new Sequence([a, b, c, d, c]);
let three = new Sequence([f, f, f, f, f, f, f, f, f, f]);

let model = new NaturalnessModel();

model.learn(one);
model.learn(two);
let crossEntropy = model.crossEntropy(three);

console.log(`crossEntropy is : ${crossEntropy}`);
```

```javascript
const naturalness = require('./index.js');
const Event = naturalness.Event;
const NaturalnessDynamicModel = naturalness.NaturalnessDynamicModel;

let a = new Event('a');
let b = new Event('b');
let c = new Event('c');
let d = new Event('d');
let e = new Event('e');
let f = new Event('f');

let model = new NaturalnessDynamicModel(6);

model.learnAllSuffix([a, b, c, d, e]);
//The following sequences have been learnt
// a, b, c, d, e
// b, c, d, e
// c, d, e
// d, e
// e

model.learn([c, d, a]);
//One sequence have been learnt
//c, d, a

model.learnAllSuffix([f, f, f, f, f, f, f, f, f, f]);
//Many sequences have been learnt
//f, f, f, f, f, f, f, f, f, f
//f, f, f, f, f, f, f, f, f
//f, f, f, f, f, f, f, f
//...

let map = model.getProbabilityMap([c, d]);
console.log(`p(e | [c, d]) : ${map.get(e)[0]}`);
```
