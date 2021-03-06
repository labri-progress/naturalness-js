const assert = require('chai').assert;
const expect = require('chai').expect;
const Event = require('../Event.js');
const EventTree = require('../EventTree.js');

describe('EventTree', function () {
    describe('#build()', () => {
        it('should throw exception (no parameter)', () => {
            expect(() => {new EventTree()}).to.throw();
        });
        it('should throw exception (negative depth)', () => {
            expect(() => {new EventTree(-1)}).to.throw();
        });
        it('should throw exception (NaN)', () => {
            expect(() => {new EventTree('a')}).to.throw();
        });
        it('should build an Event', () => {
            expect(() => {new EventTree(2, 2, 1)}).to.not.throw();
        });
    });
    describe('#learn()', () => {
        it('should learn one event', () => {
            let eventA = new Event('a');
            let eventB = new Event('b');
            let baList = [eventB, eventA];
            let tree = new EventTree(2, 2, 1);
            tree.learn(baList);
            assert.equal(tree.occurrence, 1);
        })

        it('should learn a sequence of length < to depth', () => {
            let eventB = new Event('b');
            let baList = [eventB];
            let tree = new EventTree(2, 2, 1);
            tree.learn(baList);
            assert.equal(tree.occurrence, 1);
        })
    });
    describe('#getProbabilityMap()', () => {
        it('should return one for p(a|b)', () => {
            let eventA = new Event('a');
            let eventB = new Event('b');
            let baList = [eventB, eventA];
            let tree = new EventTree(2, 2, 1);
            tree.learn(baList);
            let map = tree.getProbabilityMap([eventB]);
            assert.equal(map.get(eventA.key).length, 1);
            assert.equal(map.get(eventA.key)[0], 0.5);
        });
        it('should return zero for p(a|c)', () => {
            let eventA = new Event('a');
            let eventB = new Event('b');
            let eventC = new Event('c');
            let baList = [eventB, eventA];
            let tree = new EventTree(2, 2, 1);
            tree.learn(baList);
            let map = tree.getProbabilityMap([eventC]);
            assert.equal(map.get(eventA.key)[0], 0); 
            assert.equal(map.get(eventA.key).length, 1); 
        });
        it('should return 1 for p(a|a)', () => {
            let eventA = new Event('a');
            let eventB = new Event('b');
            let baList = [eventB, eventA];
            let aaList = [eventA, eventA];
            let tree = new EventTree(2, 2, 1);
            tree.learn(baList);
            tree.learn(aaList);
            let map = tree.getProbabilityMap([eventA]);
            assert.equal(map.get(eventA.key)[0], 0.5); 
            assert.equal(map.get(eventA.key).length, 1); 
        });
        it('should return one for 3 sequence', () => {
            let eventA = new Event('a');
            let eventB = new Event('b');
            let ababList = [eventA, eventB, eventA, eventB];
            let baaaList = [eventB, eventA, eventA, eventA];
            let aaaaList = [eventA, eventA, eventA, eventA];
 
            let tree = new EventTree(4, 2, 1);
            tree.learn(ababList);
            tree.learn(baaaList);
            tree.learn(aaaaList);
 
            let map = tree.getProbabilityMap([eventA, eventA]);
            assert.equal(map.get(eventA.key)[0], 2/3);
            assert.equal(map.get(eventA.key)[1], 0.5);
            assert.equal(map.get(eventA.key).length, 2);
        })

        it('should return probability of sequence < to depth', () => {
            let eventA = new Event('a');
            let eventB = new Event('b');
            let aaList = [eventA, eventA];
            let baList = [eventB, eventA];
 
            let tree = new EventTree(3, 2, 1);
            tree.learn(aaList);
            tree.learn(baList);
 
            let map = tree.getProbabilityMap([eventA]);
            assert.equal(map.get(eventA.key)[0], 0.5);
            assert.equal(map.get(eventA.key).length, 1);
        })

        it('should lean all suffix and return probability', () => {
            let eventA = new Event('a');
            let eventB = new Event('b');
            let aabaList = [eventA, eventA, eventB, eventA];
            let aaabList = [eventB, eventA, eventA, eventA];
            let aaaaList = [eventA, eventA, eventA, eventA];

            let tree = new EventTree(4, 2, 1);
            tree.learnAllSuffix(aabaList);
            tree.learnAllSuffix(aaabList);
            tree.learnAllSuffix(aaaaList);

            //p(? | aa) and p(? | a)
            let map = tree.getProbabilityMap([eventA, eventA]);
            
            //p(a | aa)
            assert.equal(map.get(eventA.key)[0], 0.8); 

            //p(a | a)
            //assert.equal(map.get(eventA.key)[1], 1); 
            assert.equal(map.get(eventA.key).length, 2);
        })

        it('should return undefined for a not final event', () => {
            let eventA = new Event('a');
            let eventB = new Event('b');
            let aabaList = [eventA, eventA, eventB, eventA];
            let aaaaList = [eventA, eventA, eventA, eventA];

            let tree = new EventTree(4, 2, 1);
            tree.learnAllSuffix(aabaList);
            tree.learnAllSuffix(aaaaList);

            //p(? | aa) and p(? | a)
            let map = tree.getProbabilityMap([eventA, eventA]);

            //p(b | aa)
            assert.equal(map.get(eventB.key), undefined); 
        })
    })
    describe('#getProbability()', () => {
        it("should match the table from, Interpolated n-grams for model based testing, Figure 4", () => {

            //Implementing Figure 4 from article Interpolated n-grams for model based testing
            let eventA = new Event('a');
            let eventB = new Event('b');
            let eventC = new Event('c');
            let eventD = new Event('d');
            let eventE = new Event('e');
            let eventG = new Event('g');
            let eventH = new Event('h');

            let eventX = new Event('x');
            let eventY = new Event('y');
            let eventW = new Event('w');


            let list1 = [eventA, eventB, eventC, eventD];
            let list2 = [eventA, eventB, eventC, eventE];
            let list3 = [eventH, eventG, eventC, eventE];
            let list4 = [eventX, eventY, eventW, eventD];


            let tree = new EventTree(4, 2, 0);    
            for (let i=0; i<9; ++i) {
                tree.learnAllSuffix(list1);
            }

            tree.learnAllSuffix(list2);

            for (let i=0; i<5; ++i) {
                tree.learnAllSuffix(list3);
            }

            for (let i=0; i<5; ++i) {
                tree.learnAllSuffix(list4);
            }
            
            let map = tree.getProbabilityMap([eventC]);
            assert.equal(map.get(eventE.key)[0], 0.4) 
            assert.equal(map.get(eventD.key)[0], 0.6) 

            map = tree.getProbabilityMap([eventB, eventC]);
            assert.equal(map.get(eventE.key)[0], 0.1) 
            assert.equal(map.get(eventD.key)[0], 0.9) 

            map = tree.getProbabilityMap([eventY, eventC]);
            assert.equal(map.get(eventE.key)[0], 0) 
            assert.equal(map.get(eventD.key)[0], 0)

            map = tree.getInterpolatedProbabilityMap([eventY, eventC]);
            assert.equal(map.get(eventE.key), 0.4); 
            assert.equal(map.get(eventD.key), 0.6);
        });
        it("should match the table from, Interpolated n-grams for model based testing, Figure 4 (with bias)", () => {

            //Implementing Figure 4 from article Interpolated n-grams for model based testing
            let eventA = new Event('a');
            let eventB = new Event('b');
            let eventC = new Event('c');
            let eventD = new Event('d');
            let eventE = new Event('e');
            let eventG = new Event('g');
            let eventH = new Event('h');

            let eventX = new Event('x');
            let eventY = new Event('y');
            let eventW = new Event('w');


            let list1 = [eventA, eventB, eventC, eventD];
            let list2 = [eventA, eventB, eventC, eventE];
            let list3 = [eventH, eventG, eventC, eventE];
            let list4 = [eventX, eventY, eventW, eventD];


            let tree = new EventTree(4, 2, 1);    
            for (let i=0; i<9; ++i) {
                tree.learnAllSuffix(list1);
            }

            tree.learnAllSuffix(list2);

            for (let i=0; i<5; ++i) {
                tree.learnAllSuffix(list3);
            }

            for (let i=0; i<5; ++i) {
                tree.learnAllSuffix(list4);
            }
            
            let map = tree.getProbabilityMap([eventC]);
            assert.equal(map.get(eventE.key)[0], 18/46) 
            assert.equal(map.get(eventD.key)[0], 27/46) 

            map = tree.getProbabilityMap([eventB, eventC]);
            assert.equal(map.get(eventE.key)[0], 2/21) 
            assert.equal(map.get(eventD.key)[0], 18/21) 

            map = tree.getProbabilityMap([eventY, eventC]);
            assert.equal(map.get(eventE.key)[0], 0) 
            assert.equal(map.get(eventD.key)[0], 0)
        });
        it('', () => {
            //Implementing Figure 4 from article Interpolated n-grams for model based testing
            let a = new Event('a');
            let b = new Event('b');
            let c = new Event('c');
            let d = new Event('d');
            let e = new Event('e');
            let f = new Event('f');
            let g = new Event('g');

            let tree = new EventTree(4, 2, 1);    
            tree.learnWithSlidingWindow([a, b, c, d, e, f, g]);

            let probaMap = tree.getInterpolatedProbabilityMap([d, e, f]);
            assert.equal(probaMap.get(g.key), 1);
            


        })
    })
    describe('#crossEntropy()', () => {
        it('should compute unknown proba crossEntropy with empty seq', () => {
            let tree = new EventTree(4, 2, 1); 
            let crossEnt = tree.crossEntropy([]);
            assert.equal(crossEnt, 0.0000001);
        });
        it('should compute crossEntropy with all right', () => {
            let tree = new EventTree(4, 2, 1); 
            let eventA = new Event('a');
            let eventB = new Event('b');
            let aabaList = [eventA, eventA, eventB, eventA];
            let aaabList = [eventB, eventA, eventA, eventA];
            let aaaaList = [eventA, eventA, eventA, eventA];

            tree.learnWithSlidingWindow(aabaList);
            let crossEnt = tree.crossEntropy(aabaList);
            assert.equal(crossEnt, 0.330482131923974);
        });
        it.only('should compute crossEntropy with all wrong', () => {
            let tree = new EventTree(4, 2, 1); 
            let eventA = new Event('a');
            let eventB = new Event('b');
            let eventC = new Event('c');
            let aabaList = [eventA, eventA, eventB, eventA];
            let aaabList = [eventB, eventA, eventA, eventA];
            let aaaaList = [eventA, eventA, eventA, eventA];
            let ccccList = [eventC, eventC, eventC, eventC];

            tree.learnWithSlidingWindow(aabaList);
            let crossEnt = tree.crossEntropy(ccccList);
            assert.equal(crossEnt, -Math.log2(1e-6));
        });
    });
})