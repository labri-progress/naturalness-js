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

    getProbability(sequence) {
        let res = Map();
        let probabilityMap = this.getProbabilityMap(sequence);
        for (let candidate of probabilityMap.keys()) {
            let proba = probabilityMap.get(candidate).reduce( (prev, cur, index) => {
                return prev + cur * Math.pow(2,probabilityMap.size -index);
            }, 0);
            proba = proba / (Math.pow(2, probabilityMap.size+1) - 1 );
            res.set(candidate, proba);
        }
        return res;
    }

    getProbabilityMap(sequence) {
        let candidateSuffixMatrix = this.getProbabilityMatrix(sequence);
        
        let result = new Map();
        for (let candidate of this.children.keys()) {
            result.set(candidate,[]);
        }

        if (sequence.length >= this.size) {
            sequence = sequence.slice(0, this.size);
        }
        let suffixSequenceArray = generateSuffixSequenceArray(sequence);
        
        for (let suffixSequenceId = 0; suffixSequenceId < suffixSequenceArray.length; suffixSequenceId++) {
            let allOccurrence = candidateSuffixMatrix[suffixSequenceId].reduce( (prev , cur) => cur + prev, 0);
            let candidateId = 0;
            for (let candidate of this.children.keys()) {        
                let proba;
                if (allOccurrence === 0) {
                    proba = 0;
                } else {
                    proba = candidateSuffixMatrix[suffixSequenceId][candidateId]/ (allOccurrence+1);
                }
                result.get(candidate).push(proba);
                candidateId++;
            }
        }
        return result;
    }

    getProbabilityMatrix(sequence) {
        if (! Array.isArray(sequence)) {
            throw 'sequence should be an array';
        }
        if (sequence.length < 1) {
            throw 'sequence should at least contain one event';
        }
        if (sequence.length >= this.size) {
            sequence = sequence.slice(0, this.size);
        }
        let suffixSequenceArray = generateSuffixSequenceArray(sequence);
        let candidateSuffixMatrix = [];
        for (let suffixSequenceId = 0; suffixSequenceId < suffixSequenceArray.length; suffixSequenceId++) {
            const suffixSequence = suffixSequenceArray[suffixSequenceId];
            candidateSuffixMatrix[suffixSequenceId] = [];
            let candidateId = 0;
            for (let candidate of this.children.keys()) {
                let suffixSequenceWithCandidate = [...suffixSequence];
                suffixSequenceWithCandidate.push(candidate);
                let occurrence = this.children.get(candidate).getOccurence(suffixSequenceWithCandidate);
                candidateSuffixMatrix[suffixSequenceId][candidateId] = occurrence;
                candidateId++;
            }   
        }
        return candidateSuffixMatrix;
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