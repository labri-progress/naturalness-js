const Sequence = require('./Sequence.js');
const EventTree = require('./EventTree.js');

const DEPTH = 8;
const INTERPOLATION = 2;
const DENOMINATOR_BIAS = 1;

class NaturalnessDynamicModel {
    constructor(depth = DEPTH, interpolation = INTERPOLATION, denominatorBias = DENOMINATOR_BIAS) {
        this.depth = depth;
        this.interpolation = interpolation;
        this.denominatorBias = denominatorBias;
        this.model = new EventTree(this.depth, this.interpolation, this.denominatorBias);
    }

    learn(sequence) {
        this.model.learn(sequence);
    }

    learnWithSlideWindow(sequence) {
        this.model.learnWithSlideWindow(sequence);
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