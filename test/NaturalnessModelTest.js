const assert = require('chai').assert;
const NaturalnessModel = require('../NaturalnessModel.js');
const Event = require('../Event.js');
const Sequence = require('../Sequence.js');
const Ngram = require('../Ngram.js');

describe('NaturalnessModel', function () {
    describe('#learn()', () => {
        it('should add 5 Ngram to the map', () => {
            let sequenceSample = createSequence();
            let model = new NaturalnessModel();
            model.learn(sequenceSample.one);
            assert.equal(model.ngramMap.size, 5);
        });
        it('should add 5 Ngram to the map', () => {
            let sequenceSample = createSequence();
            let model = new NaturalnessModel();
            model.learn(sequenceSample.one);
            model.learn(sequenceSample.two);
            assert.equal(model.ngramMap.size, 5);
        });
    });
    describe('#crossEntropy()', () => {
        it('should compute unknown proba crossEntropy with empty seq', () => {
            let model = new NaturalnessModel();
            let emptySeq = new Sequence();
            let crossEnt = model.crossEntropy(emptySeq);
            assert.equal(crossEnt, model.probaOfUnknown);
        });
        it('should compute crossEntropy with all right (sample1)', () => {
            let model = new NaturalnessModel();
            let sequenceSample = createSequence();
            model.learn(sequenceSample.one);
            let crossEnt = model.crossEntropy(sequenceSample.one);
            let right = 1 - model.probaOfUnknown;
            let expected = -(5 * Math.log2(right)) / 5;
            assert.equal(crossEnt, expected);
        });
        it('should compute crossEntropy with one wrong (sample1 && sample2)', () => {
            let model = new NaturalnessModel();
            let sequenceSample = createSequence();
            model.learn(sequenceSample.one);
            let crossEnt = model.crossEntropy(sequenceSample.two);
            let right = 1 - model.probaOfUnknown;
            let wrong = model.probaOfUnknown;
            let expected = -(4 * Math.log2(right) + Math.log2(wrong)) / 5;
            assert.equal(crossEnt, expected);
        });
        it('should compute crossEntropy with all wrong (sample1 && sample3)', () => {
            let model = new NaturalnessModel();
            let sequenceSample = createSequence();
            model.learn(sequenceSample.one);
            let crossEnt = model.crossEntropy(sequenceSample.three);
            let wrong = model.probaOfUnknown;
            let expected = -(Math.log2(wrong) + Math.log2(wrong) + Math.log2(wrong) + Math.log2(wrong) + Math.log2(wrong) + Math.log2(wrong) + Math.log2(wrong) + Math.log2(wrong) + Math.log2(wrong) + Math.log2(wrong)) / 10;
            assert.equal(crossEnt, expected);
        });
        it('should compute different crossEntropy', () => {
            let model = new NaturalnessModel();
            let sequenceSample = createSequence();
            model.learn(sequenceSample.four);
            model.learn(sequenceSample.five);
            model.learn(sequenceSample.six);
            let crossEnt7 = model.crossEntropy(sequenceSample.seven);
            let crossEnt8 = model.crossEntropy(sequenceSample.eight);
            assert.notEqual(crossEnt7, crossEnt8);
        });
    });
    describe('#getProbability()', () => {
        it('should give 100% probability', () => {
            let model = new NaturalnessModel(2,0);
            let sequenceSample = createSequence();
            model.learn(sequenceSample.one);
            model.learn(sequenceSample.two);
            let ng = new Ngram([new Event('a'),new Event('b')]);
            let proba = model.getProbability(ng, new Event('c'));
            const HUNDRED_PERCENT=1;
            assert.equal(proba, HUNDRED_PERCENT);
        });
        it('should give 0% probability', () => {
            let model = new NaturalnessModel(2,0);
            let sequenceSample = createSequence();
            model.learn(sequenceSample.one);
            model.learn(sequenceSample.two);
            let ng = new Ngram([new Event('a'),new Event('b')]);
            let proba = model.getProbability(ng, new Event('d'));
            const ZERO_PERCENT=0;
            assert.equal(proba, ZERO_PERCENT);
        });
        it('should give 0% probability with a unknrown Ngram', () => {
            let model = new NaturalnessModel(2,0);
            let sequenceSample = createSequence();
            model.learn(sequenceSample.one);
            model.learn(sequenceSample.two);
            let ng = new Ngram([new Event('a'),new Event('z')]);
            let proba = model.getProbability(ng, new Event('a'));
            const ZERO_PERCENT=0;
            assert.equal(proba, ZERO_PERCENT);
        });
        it('should give probabilities that sum to 1', () => {
            let model = new NaturalnessModel(2,0);
            let sequenceSample = createSequence();
            model.learn(sequenceSample.one);
            model.learn(sequenceSample.two);
            let ng = new Ngram([new Event('c'),new Event('d')]);
            let probaE = model.getProbability(ng, new Event('e'));
            let probaC = model.getProbability(ng, new Event('c'));
            assert.equal(probaE+probaC, 1);
            model.learn(sequenceSample.four);
            probaE = model.getProbability(ng, new Event('e'));
            probaC = model.getProbability(ng, new Event('c'));
            assert.equal(probaE+probaC, 1);
            model.learn(sequenceSample.five);
            probaE = model.getProbability(ng, new Event('e'));
            probaC = model.getProbability(ng, new Event('c'));
            let probaF = model.getProbability(ng, new Event('f'));
            assert.equal(probaE+probaC+probaF, 1);
            assert.equal(probaE, 0.5);
        });
    });
    
});


function createSequence() {
    let a = new Event('a');
    let b = new Event('b');
    let c = new Event('c');
    let d = new Event('d');
    let e = new Event('e');
    let f = new Event('f');

    return {
        one: new Sequence([a, b, c, d, e]),
        two: new Sequence([a, b, c, d, c]),
        three: new Sequence([f, f, f, f, f, f, f, f, f, f]),
        four: new Sequence([a, b, c, d, e]),
        five: new Sequence([a, b, c, d, f]),
        six: new Sequence([a, b, c, d, a]),
        seven: new Sequence([a, b, c, d, a]),
        eight: new Sequence([a, b, c, d, d]),
    };
}