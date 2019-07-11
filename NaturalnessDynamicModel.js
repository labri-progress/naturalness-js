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

    learnWithSlidingWindow(sequence) {
        this.model.learnWithSlidingWindow(sequence);
    }

    learnAllSuffix(sequence) {
        this.model.learnAllSuffix(sequence);
    }

    getProbability(sequence) {
        let result = [];
        let candidateMap = this.model.getCandidate();
        let probabilityMap = this.model.getInterpolatedProbabilityMap(sequence);
        for (let candidate of candidateMap.keys()) {
            result.push({
                event: candidateMap.get(candidate),
                probability : probabilityMap.get(candidate)
            });
        }
        return result;
    }
}



module.exports = NaturalnessDynamicModel;