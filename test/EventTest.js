const assert = require('chai').assert;
const expect = require('chai').expect;
const Event = require('../Event.js');

describe('Event', function() {
  describe('#constructor()', function() {
    it('should throw an exception with undefined value', () => {
        expect(() => {new Event(undefined)}).to.throw();
    });
    it('should throw an exception with null value', () => {
        expect(() => {new Event(null)}).to.throw();
    });
    it('should hash empty', () => {
        let e = new Event('');
        assert.equal(e.key,0);
    });
    it('should create different hash', () => {
        let e1 = new Event('hey');
        let e2 = new Event('hue');
        assert.notEqual(e1.key,e2.key);
    });
    it('should create same hash', () => {
        let e1 = new Event('hey');
        let e2 = new Event('hey');
        assert.equal(e1.key,e2.key);
    });
  });
});
