const Sequence = require('./Sequence.js');
const EventTree = require('./EventTree.js');

const DEPTH = 8;

class NaturalnessDynamicModel {
    constructor(depth) {
        this.depth = depth || DEPTH;
        this.model = new EventTree(this.depth);
    }

    learn(sequence) {
        this.model.learn(sequence);
    }

    learnAllSuffix(sequence) {
        this.model.learnAllSuffix(sequence);
    }

    getProbability(sequence) {
        return this.model.getProbability(sequence);
    }

    getProbabilityMap(sequence) {
        return this.model.getProbabilityMap(sequence);
    }

    getProbabilityMatrix(sequence) {
        return this.model.getProbabilityMatrix(sequence);
    }
}



module.exports = NaturalnessDynamicModel;