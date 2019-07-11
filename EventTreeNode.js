const Event = require('./Event.js');

class EventTreeNode {
    constructor(event, depth) {
        if (event === null || event === undefined) {
            throw 'Cannot create EventNode with null or undefined';
        }
        if (!(event instanceof Event)) {
            throw 'Wrong Type, should be Event';
        }
        if (isNaN(depth)) {
            throw 'Cannot create EventNode with no depth';
        }
        if (depth < 0 ) {
            throw 'depth should be positive';
        }
        this.event = event;
        this.key = event.key;
        this.depth = depth;
        this.occurrence = 0;
        if (depth > 1) {
            this.children = new Map();
        }
    }

    learn(eventList) {
        if (this.depth == 0) {
            return;
        }
        if (eventList === null || eventList === undefined || eventList.length === 0) {
            return;
        }
        let lastEvent = eventList[eventList.length - 1];
        if (lastEvent.key !== this.key) {
            throw 'Cannot learn, different event';
        }
        this.occurrence++;
        let subEventList = eventList.slice(0, eventList.length - 1);
        if (this.depth > 1 && subEventList.length >= 1) {
            let lastSubEvent = subEventList[subEventList.length - 1];
            let childTreeNode = this.children.get(lastSubEvent);
            if (childTreeNode === undefined) {
                childTreeNode = new EventTreeNode(lastSubEvent, this.depth-1);
                this.children.set(lastSubEvent, childTreeNode);
            }
            childTreeNode.learn(subEventList);
        }
        
    }

    getOccurence(sequence) {
        if (! Array.isArray(sequence)) {
            throw 'sequence should be an array of event (not an array)';
        }
        if (sequence.length < 1) {
            throw 'sequence should at least contain one event';
        }
        let lastEvent = sequence[sequence.length - 1];
        if (! (lastEvent instanceof Event)) {
            throw 'sequence should be an array of event (wrong type)';
        }
        if (lastEvent.key !== this.key) {
            return 0;
        } 
        if (sequence.length === 1) {
            return this.occurrence;
        } else {
            if (this.depth > 1) {
                let subSequence = sequence.slice(0, sequence.length - 1);
                let lastSubSequence = subSequence[subSequence.length -1];
                let subTreeNode = this.children.get(lastSubSequence);
                if (subTreeNode === undefined) {
                    return 0;
                } else {
                    return subTreeNode.getOccurence(subSequence);
                }
            } else {
                return 0;
            }
        }
    }
}

module.exports = EventTreeNode;