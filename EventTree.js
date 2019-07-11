const EventTreeNode = require('./EventTreeNode.js');
const Event = require('./Event.js');

class EventTree {
    constructor(depth, interpolation, denominatorBias) {
        if (isNaN(depth)) {
            throw 'Cannot create EventTree with no depth';
        }
        if (depth <= 1) {
            throw 'depth should be greater than 1';
        }
        if (isNaN(interpolation)) {
            throw 'Cannot create EventTree with no interpolation';
        }
        if (interpolation <= 0) {
            throw 'interpolation should be positive';
        }
        if (isNaN(denominatorBias)) {
            throw 'Cannot create EventTree with no denominatorBias ';
        }
        if (interpolation < 0) {
            throw 'denominatorBias should be positive';
        }
        this.depth = depth;
        this.interpolation = interpolation;
        this.denominatorBias = denominatorBias;
        this.occurrence = 0;
        this.children = new Map();
    }

    learn(sequence) {
        if (sequence === null || sequence === undefined || sequence.length === 0) {
            return;
        }
        let lastEvent = sequence[sequence.length - 1];
        let childTreeNode = this.children.get(lastEvent.key);
        if (childTreeNode === undefined) {
            childTreeNode = new EventTreeNode(lastEvent, this.depth);
            this.children.set(lastEvent.key, childTreeNode);
        }
        childTreeNode.learn(sequence);
        this.occurrence++;
    }

    learnAllSuffix(sequence) {
        generateSuffixSequenceArray(sequence).map(suffix => {this.learn(suffix)});
    }

    learnWithSlidingWindow(sequence) {
        for (let index = 0; index <= sequence.length - this.depth; index++) {
            this.learn(sequence.slice(index, this.depth+index));
        }
    }

    getCandidate() {
        let res = new Map();
        for (let candidate of this.children.keys()) {
            res.set(candidate,this.children.get(candidate).event);
        }
        return res;
    }

    getInterpolatedProbabilityMap(sequence) {
        let res = new Map();
        let probaAllCandidateArray = [];
        let probabilityMap = this.getProbabilityMap(sequence);
        for (let candidate of probabilityMap.keys()) {
            let probaArray = probabilityMap.get(candidate);
            let proba = probaArray.reduce( (prev, cur, index) => {
                return prev + cur * Math.pow(this.interpolation,probaArray.length - index);
            }, 0);
            probaAllCandidateArray.push(proba);
            res.set(candidate, proba);
        }
        let probaSum = probaAllCandidateArray.reduce( (prev, cur) => prev+cur,0);
        for (let candidate of probabilityMap.keys()) {
            let oldProba = res.get(candidate);
            res.set(candidate, probaSum === 0 ? 0 : oldProba / probaSum);
        }
        return res;
    }

    getProbabilityMap(sequence) {
        let candidateSuffixMatrix = this.getProbabilityMatrix(sequence);
        
        let keyProbaMap = new Map();
        for (let candidate of this.children.keys()) {
            keyProbaMap.set(candidate,[]);
        }

        if (sequence.length >= this.depth) {
            sequence = sequence.slice(0, this.depth);
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
                    proba = candidateSuffixMatrix[suffixSequenceId][candidateId]/ (allOccurrence+this.denominatorBias);
                }
                keyProbaMap.get(candidate).push(proba);
                candidateId++;
            }
        }
        return keyProbaMap;
    }

    getProbabilityMatrix(sequence) {
        if (! Array.isArray(sequence)) {
            throw 'getProbabilityMatrix: sequence should be an array';
        }
        if (sequence.length < 1) {
            throw 'getProbabilityMatrix: sequence should at least contain one event';
        }
        if (sequence.length >= this.depth) {
            sequence = sequence.slice(0, this.depth);
        }
        if (! (sequence[0] instanceof Event)) {
            throw 'getProbabilityMatrix: sequence should contain Event only !';
        }
        let suffixSequenceArray = generateSuffixSequenceArray(sequence);
        let candidateSuffixMatrix = [];
        for (let suffixSequenceId = 0; suffixSequenceId < suffixSequenceArray.length; suffixSequenceId++) {
            const suffixSequence = suffixSequenceArray[suffixSequenceId];
            candidateSuffixMatrix[suffixSequenceId] = [];
            let candidateId = 0;
            for (let candidate of this.children.keys()) {
                let suffixSequenceWithCandidate = [...suffixSequence];
                suffixSequenceWithCandidate.push(this.children.get(candidate).event);
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