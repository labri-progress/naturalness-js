const Event = require('./Event.js');

class EventTreeNode {
    constructor(event, size) {
        if (event === null || event === undefined) {
            throw 'Cannot create EventNode with null or undefined';
        }
        if (!(event instanceof Event)) {
            throw 'Wrong Type, should be Event';
        }
        if (isNaN(size)) {
            throw 'Cannot create EventNode with no size';
        }
        if (size < 0 ) {
            throw 'Size should be positive';
        }
        this.event = event;
        this.key = event.key;
        this.size = size;
        this.occurrence = 0;
        if (size > 1) {
            this.children = new Map();
        }
    }

    learn(eventList) {
        if (this.size == 0) {
            return;
        }
        if (eventList === null || eventList === undefined || eventList.length === 0) {
            return;
        }
        let lastEvent = eventList[eventList.length - 1];
        if (lastEvent.key !== this.key) {
            throw 'Cannot learn, different event';
        }
        if (this.size > 1) {
            let subEventList = eventList.slice(0, eventList.length - 1);
            let lastSubEvent = subEventList[subEventList.length - 1];
            let childTreeNode = this.children.get(lastSubEvent.key);
            if (childTreeNode === undefined) {
                childTreeNode = new EventTreeNode(lastSubEvent, this.size-1);
                this.children.set(lastSubEvent.key, childTreeNode);
            }
            childTreeNode.learn(subEventList);
        }
        this.occurrence++;
    }

    getProbability(context) {
        context.push(this.event);
        let contextOccurence = this.getOccurence(context);
        return contextOccurence / this.occurrence;
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
        }
        if (this.size > 1) {
            let subSequence = sequence.slice(0, sequence.length - 1);
            let lastSubSequence = subSequence[subSequence.length -1];
            let subTreeNode = this.children.get(lastSubSequence.key);
            if (subTreeNode === undefined) {
                return 0;
            }
            return subTreeNode.getOccurence(subSequence);
        } else {
            return 0;
        }
        
    }
}

module.exports = EventTreeNode;