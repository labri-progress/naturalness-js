const assert = require('chai').assert;
const expect = require('chai').expect;
const Event = require('../Event.js');
const EventTree = require('../EventTree.js');

describe('EventTree', function () {
    describe('#build()', () => {
        it('should throw exception (no parameter)', () => {
            expect(() => {new EventTree()}).to.throw();
        });
        it('should throw exception (negative size)', () => {
            expect(() => {new EventTree(-1)}).to.throw();
        });
        it('should throw exception (NaN)', () => {
            expect(() => {new EventTree('a')}).to.throw();
        });
        it('should build an Event', () => {
            expect(() => {new EventTree(1)}).to.not.throw();
        });
    });
    describe('#learn()', () => {
        it('should learn one event', () => {
            let eventA = new Event('a');
            let eventB = new Event('b');
            let baList = [eventB, eventA];
            let tree = new EventTree(2);
            tree.learn(baList);
            assert.equal(tree.occurrence, 1);
        })
    });
    describe('#getProbabilityMap()', () => {
        it('should return one for p(a|b)', () => {
            let eventA = new Event('a');
            let eventB = new Event('b');
            let baList = [eventB, eventA];
            let tree = new EventTree(2);
            tree.learn(baList);
            let map = tree.getProbabilityMap([eventB]);
            assert.equal(map.get(eventA).length, 1);
            assert.equal(map.get(eventA)[0], 1);
        });
        it('should return one for p(a|c)', () => {
            let eventA = new Event('a');
            let eventB = new Event('b');
            let eventC = new Event('c');
            let baList = [eventB, eventA];
            let tree = new EventTree(2);
            tree.learn(baList);
            let map = tree.getProbabilityMap([eventC]);
            assert.equal(map.get(eventA)[0], 0); 
            assert.equal(map.get(eventA).length, 1); 
        });
        it('should return one for p(a|c)', () => {
            let eventA = new Event('a');
            let eventB = new Event('b');
            let eventC = new Event('c');
            let baList = [eventB, eventA];
            let aaList = [eventA, eventA];
            let tree = new EventTree(2);
            tree.learn(baList);
            tree.learn(aaList);
            let map = tree.getProbabilityMap([eventA]);
            assert.equal(map.get(eventA)[0], 0.5); 
            assert.equal(map.get(eventA).length, 1); 
        });
        it('should return one for 3 sequence', () => {
            let eventA = new Event('a');
            let eventB = new Event('b');
            let aabaList = [eventA, eventA, eventB, eventA];
            let aaabList = [eventB, eventA, eventA, eventA];
            let aaaaList = [eventA, eventA, eventA, eventA];
 
            let tree = new EventTree(4);
            tree.learn(aabaList);
            tree.learn(aaabList);
            tree.learn(aaaaList);
 
            let map = tree.getProbabilityMap([eventA, eventA]);
            assert.equal(map.get(eventA)[0], 2/3);
            assert.equal(map.get(eventA)[1], 2/3);
            assert.equal(map.get(eventA).length, 2);
        })

        it('should return one for 3 sequence', () => {
            let eventA = new Event('a');
            let eventB = new Event('b');
            let aabaList = [eventA, eventA, eventB, eventA];
            let aaabList = [eventB, eventA, eventA, eventA];
            let aaaaList = [eventA, eventA, eventA, eventA];

            let tree = new EventTree(4);
            tree.learn(aabaList);
            tree.learn(aaabList);
            tree.learn(aaaaList);

            let map = tree.getProbabilityMap([eventA, eventA]);
            assert.equal(map.get(eventA)[0], 2/3); 
            assert.equal(map.get(eventA)[1], 6/7); 
            assert.equal(map.get(eventA).length, 2); 
        })
    });
});
