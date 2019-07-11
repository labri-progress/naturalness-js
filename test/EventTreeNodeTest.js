const assert = require('chai').assert;
const expect = require('chai').expect;
const Event = require('../Event.js');
const EventTreeNode = require('../EventTreeNode.js');

describe('EventTreeNode', function () {
    describe('#build()', () => {
        it('should throw exception (no parameter)', () => {
            expect(() => {new EventTreeNode()}).to.throw();
        });
        it('should throw exception (no event)', () => {
            expect(() => {new EventTreeNode('e',10)}).to.throw();
        });
        it('should throw exception (no event)', () => {
            expect(() => {new EventTreeNode(undefined, 10)}).to.throw();
        });
        it('should throw exception (no event)', () => {
            expect(() => {new EventTreeNode(null, 10)}).to.throw();
        });
        it('should throw exception (depth isNan)', () => {
            expect(() => {new EventTreeNode(new Event('e'),'e')}).to.throw();
        });
        it('should throw exception (depth isNan)', () => {
            expect(() => {new EventTreeNode(new Event('e'), -1)}).to.throw();
        });
        it('should build an Event', () => {
            expect(() => {new EventTreeNode(new Event('e'), 0)}).to.not.throw();
        });
    });
    describe('#learn()', () => {
        it('should learn one event', () => {
            let event = new Event('e');
            let eventList = [event];
            let eventTreeNode = new EventTreeNode(event, 1);
            eventTreeNode.learn(eventList);
            assert.equal(eventTreeNode.occurrence, 1);
        });
        it('should learn two same event', () => {
            let event = new Event('e');
            let eventList = [event];
            let eventTreeNode = new EventTreeNode(event, 1);
            eventTreeNode.learn(eventList);
            eventTreeNode.learn(eventList);
            assert.equal(eventTreeNode.occurrence, 2);
        });
        it('should not learn', () => {
            expect(() => {
                let event = new Event('e');
                let eventB = new Event('b');
                let eventBList = [eventB];
                let eventTreeNode = new EventTreeNode(event, 1);
                eventTreeNode.learn(eventBList);
            }).to.throw();
        });
        it('should learn subEventList', () => {
            let eventA = new Event('a');
            let eventB = new Event('b');
            let baList = [eventB, eventA];
            let aaList = [eventA, eventA];
            let aTreeNode = new EventTreeNode(eventA, 3);
            aTreeNode.learn(baList);
            aTreeNode.learn(aaList);
            assert.equal(aTreeNode.occurrence, 2);
            assert.equal(aTreeNode.children.get(eventA.key).occurrence, 1);
            assert.equal(aTreeNode.children.get(eventB.key).occurrence, 1);
        })
    });
    describe('#getOccurence()', () => {
        it('should return one', () => {
            let eventA = new Event('a');
            let aTreeNode = new EventTreeNode(eventA, 1);
            let aList = [eventA];
            aTreeNode.learn(aList);
            let occurence = aTreeNode.getOccurence(aList);
            assert.equal(occurence, 1);
        });
        it('should return one for [b,a]', () => {
            let eventA = new Event('a');
            let eventB = new Event('b');
            let baList = [eventB, eventA];
            let aTreeNode = new EventTreeNode(eventA, 2);
            aTreeNode.learn(baList);
            let occurence = aTreeNode.getOccurence(baList);
            assert.equal(occurence, 1);
        });
        it('should lean all suffix and return probability', () => {
            let eventA = new Event('a');
            let eventB = new Event('b');
            let aabaList = [eventA, eventA, eventB, eventA];
            let aaabList = [eventB, eventA, eventA, eventA];
            let aaaaList = [eventA, eventA, eventA, eventA];

            let aTreeNode = new EventTreeNode(eventA, 4);
            aTreeNode.learn(aabaList);
            aTreeNode.learn(aaabList);
            aTreeNode.learn(aaaaList);
            assert.equal(aTreeNode.getOccurence([eventA,eventA, eventA]),2); 
        });
    });
});
