const EventTreeNode = require('./EventTreeNode.js');

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
        let lastEvent = sequence[sequence.length - 1];
        let childTreeNode = this.children.get(lastEvent);
        if (childTreeNode === undefined) {
            childTreeNode = new EventTreeNode(lastEvent, this.size);
            this.children.set(lastEvent, childTreeNode);
        }
        childTreeNode.learn(sequence);
        this.occurrence++;
    }

    learnAllSuffix(sequence) {
        generateSuffixSequenceArray(sequence).map(suffix => {this.learn(suffix)});
    }

    getProbabilityMap(sequence) {
        if (! Array.isArray(sequence)) {
            throw 'sequence should be an array of event (not an array)';
        }
        if (sequence.length < 1) {
            throw 'sequence should at least contain one event';
        }
        if (sequence.length > this.size) {
            sequence = sequence.slice(0, this.size);
        }
        let suffixSequenceArray = generateSuffixSequenceArray(sequence);
        let result = new Map();
        for (let child  of this.children.keys()) {
            let probabilityArray = suffixSequenceArray.map(suffixSequence => {
                return this.children.get(child).getProbability(suffixSequence);
            });
            result.set(child, probabilityArray);
        }
        return result;
    }
}

function generateSuffixSequenceArray(sequence) {
    let suffixSequenceArray = [];
    for (let index = 0; index < sequence.length; index++) {
        suffixSequenceArray.push(sequence.slice(index, sequence.length));
    }
    return suffixSequenceArray;
}

module.exports = EventTree;