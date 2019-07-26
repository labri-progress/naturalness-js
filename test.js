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
//Many sequences have been learnt (max size is 6)
//f, f, f, f, f, f
//f, f, f, f, f
//f, f, f, f
//...

let map = model.getProbabilityMap([a, b, c, d]);
console.log(`p(e | [a, b, c, d]) : ${map.get(e)[0]}`);
console.log(`p(e | [b, c, d]) : ${map.get(e)[1]}`);
console.log(`p(e | [c, d]) : ${map.get(e)[2]}`);
console.log(`p(e | [d]) : ${map.get(e)[3]}`);