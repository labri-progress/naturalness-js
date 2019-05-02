const assert = require('chai').assert;
const Event = require('../Event.js');
const NgramSuccessorModel = require('../NgramSuccessorModel.js');

describe('NgramSuccessorMoel', function() {
  describe('#constructor()', function() {
    it('should have a map with no occurence', () => {
        let ngsm = new NgramSuccessorModel();
        assert.equal(ngsm.occurence,0);
        assert.notEqual(ngsm.successorMap, undefined);
    });
  });
  describe('#learn()', function() {
    it('should throw exception with null, undefined and not Event', () => {
        let ngsm = new NgramSuccessorModel();
        try  {
            ngsm.learn();
        } catch (ex) {

        }
        try  {
            ngsm.learn(null);
        } catch (ex) {

        }
        try  {
            ngsm.learn("toto");
        } catch (ex) {

        }
    });
    it('should learn one Event', () => {
        let ngsm = new NgramSuccessorModel();
        let event = new Event('hey');
        ngsm.learn(event);
        assert.equal(ngsm.occurence, 1);
        let successor = ngsm.successorMap.get(event.key);
        assert.equal(successor.event, event);
        assert.equal(successor.occurence, 1);
    });
    it('should learn only one Event but two occurences', () => {
        let ngsm = new NgramSuccessorModel();
        let event = new Event('hey');
        ngsm.learn(event);
        ngsm.learn(event);
        assert.equal(ngsm.occurence, 2);
        let successor = ngsm.successorMap.get(event.key);
        assert.equal(successor.event, event);
        assert.equal(successor.occurence, 2);
    });
  });
  describe('#getProbability()', function() {
    it('should throw exception with null, undefined and not Event', () => {
        let ngsm = new NgramSuccessorModel();
        try  {
            ngsm.getProbability();
        } catch (ex) {

        }
        try  {
            ngsm.getProbability(null);
        } catch (ex) {

        }
        try  {
            ngsm.getProbability("toto");
        } catch (ex) {

        }
    });
    it('should return 0', () => {
        let ngsm = new NgramSuccessorModel();
        let event = new Event('hey');
        let proba = ngsm.getProbability(event);
        assert.equal(proba, 0);
    });
    it('should return 1', () => {
        let ngsm = new NgramSuccessorModel();
        let event = new Event('hey');
        ngsm.learn(event);
        let proba = ngsm.getProbability(event);
        assert.equal(proba, 1);
    });
    it('should return 1/2', () => {
        let ngsm = new NgramSuccessorModel();
        let hey = new Event('hey');
        let ho = new Event('ho');
        ngsm.learn(hey);
        ngsm.learn(ho);
        let proba = ngsm.getProbability(hey);
        assert.equal(proba, 0.5);
    });
  });
});
