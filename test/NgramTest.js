const assert = require('chai').assert;
const expect = require('chai').expect;
const Ngram = require('../Ngram.js');
const Event = require('../Event.js');

describe('Ngram', function() {
  describe('#constructor()', function() {
    it('should throw an exception with undefined eventList', () => {
        expect(() => {new Ngram(undefined)}).to.throw();
    });
    it('should throw an exception with null item', () => {
        expect(() => {new Ngram(null)}).to.throw();
    });
    it('should throw an exception with not an Array', () => {
        expect(() => {new Ngram("hey")}).to.throw();
    });
    it('should throw an exception with not an Array of Event', () => {
        expect(() => {new Ngram([1,2,3])}).to.throw();
    });
    it('should hash empty', () => {
        let ng = new Ngram([]);
        assert.equal(ng.key,0);
    });
    it('should hash Event', () => {
        let e = new Event('this is my event');
        let ng = new Ngram([e]);
        assert.equal(ng.key,e.key);
    });
    it('should hash Event', () => {
        let e = new Event('this is my event');
        let ng = new Ngram([e,e]);
        assert.equal(ng.key,e.key+e.key);
    });
  });
});
