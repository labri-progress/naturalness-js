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

    learn(eventSequence) {
        this.model.learn(eventSequence);
    }

    learnWithSlidingWindow(eventSequence) {
        this.model.learnWithSlidingWindow(eventSequence);
    }

    learnAllSuffix(eventSequence) {
        this.model.learnAllSuffix(eventSequence);
    }

    getProbability(context) {
        let result = [];
        let candidateMap = this.model.getCandidate();
        let probabilityMap = this.model.getInterpolatedProbabilityMap(context);
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