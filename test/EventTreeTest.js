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

        it('should learn a sequence of length < to size', () => {
            let eventB = new Event('b');
            let baList = [eventB];
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
            assert.equal(map.get(eventA)[0], 0.5);
        });
        it('should return zero for p(a|c)', () => {
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
        it('should return 1 for p(a|a)', () => {
            let eventA = new Event('a');
            let eventB = new Event('b');
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
            let ababList = [eventA, eventB, eventA, eventB];
            let baaaList = [eventB, eventA, eventA, eventA];
            let aaaaList = [eventA, eventA, eventA, eventA];
 
            let tree = new EventTree(4);
            tree.learn(ababList);
            tree.learn(baaaList);
            tree.learn(aaaaList);
 
            let map = tree.getProbabilityMap([eventA, eventA]);
            assert.equal(map.get(eventA)[0], 2/3);
            assert.equal(map.get(eventA)[1], 0.5);
            assert.equal(map.get(eventA).length, 2);
        })

        it('should return probability of sequence < to size', () => {
            let eventA = new Event('a');
            let eventB = new Event('b');
            let aaList = [eventA, eventA];
            let baList = [eventB, eventA];
 
            let tree = new EventTree(3);
            tree.learn(aaList);
            tree.learn(baList);
 
            let map = tree.getProbabilityMap([eventA]);
            assert.equal(map.get(eventA)[0], 0.5);
            assert.equal(map.get(eventA).length, 1);
        })

        it('should lean all suffix and return probability', () => {
            let eventA = new Event('a');
            let eventB = new Event('b');
            let aabaList = [eventA, eventA, eventB, eventA];
            let aaabList = [eventB, eventA, eventA, eventA];
            let aaaaList = [eventA, eventA, eventA, eventA];

            let tree = new EventTree(4);
            tree.learnAllSuffix(aabaList);
            tree.learnAllSuffix(aaabList);
            tree.learnAllSuffix(aaaaList);

            //p(? | aa) and p(? | a)
            let map = tree.getProbabilityMap([eventA, eventA]);
            
            //p(a | aa)
            assert.equal(map.get(eventA)[0], 0.8); 

            //p(a | a)
            //assert.equal(map.get(eventA)[1], 1); 
            assert.equal(map.get(eventA).length, 2);
        })

        it('should return probability for a not final event', () => {
            let eventA = new Event('a');
            let eventB = new Event('b');
            let aabaList = [eventA, eventA, eventB, eventA];
            let aaaaList = [eventB, eventA, eventA, eventA];

            let tree = new EventTree(4);
            tree.learnAllSuffix(aabaList);
            tree.learnAllSuffix(aaaaList);

            //p(? | aa) and p(? | a)
            let map = tree.getProbabilityMap([eventA, eventA]);

            //p(b | aa)
            assert.equal(map.get(eventB)[0], 1/3); 

            let abaaList = [eventA, eventB, eventA, eventA];
            tree.learnAllSuffix(abaaList);
            map = tree.getProbabilityMap([eventA]);

            assert.equal(map.get(eventB)[0], 1/5); 
        })

        it('should return probability form empty context', () => {
            let eventA = new Event('a');
            let eventB = new Event('b');
            let aabaList = [eventA, eventA, eventB, eventA];
            let aaaaList = [eventB, eventA, eventA, eventA];

            let tree = new EventTree(4);
            tree.learnAllSuffix(aabaList);
            tree.learnAllSuffix(aaaaList);

            //p(? | aa) and p(? | a)
            let map = tree.getProbabilityMap([]);

            //p(b | aa)
            assert.equal(map.get(eventA)[0], 6/8); 
            assert.equal(map.get(eventB)[0], 2/8); 
        })
    });
});
