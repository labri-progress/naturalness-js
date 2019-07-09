const Event = require('./Event.js');

class EventTree {
    constructor(size) {
        if (isNaN(size)) {
            throw 'Cannot create EventNode with no size';
        }
        if (size <= 0) {
            throw 'Size should be positive';
        }
        this.size = size;
        this.occurrence = 0;
        this.children = new Map();
    }

    learn(sequence) {
        if (sequence === null || sequence === undefined || sequence.length === 0) {
            return;
        }
        let lastEvent = sequence.evenList[sequence.length - 1];
        let childTreeNode = this.children.get(lastEvent.key);
        if (childTreeNode === undefined) {
            childTreeNode = new EventTreeNode(lastEvent, this.size);
            this.children.set(lastEvent.key, childTreeNode);
        }
        childTreeNode.learn(sequence);
        this.occurrence++;
    }
}

module.exports = EventTreeNode;