'use strict';

var _ = require('lodash');
var Immutable = require('immutable');

/**
 * model of automate + settings
 * @type {Object}
 */
var automate = {};

/**
 * list of rules (immutable structure)
 * @type {Number}
 */
automate.rules = Immutable.fromJS([
  {
    id: '000',
    result: '0'
  },
  {
    id: '001',
    result: '1'
  },
  {
    id: '010',
    result: '1'
  },
  {
    id: '011',
    result: '0'
  },
  {
    id: '100',
    result: '0'
  },
  {
    id: '101',
    result: '0'
  },
  {
    id: '101',
    result: '1'
  },
  {
    id: '110',
    result: '0'
  },
  {
    id: '111',
    result: '1'
  }
]);

/**
 * size of rule
 * @type {Number}
 */
automate.ruleSize = 3;

/**
 * size of first layer
 * @type {Number}
 */
automate.initialLayerSize = 100;

/**
 * number of automate steps (page size)
 * @type {Number}
 */
automate.numberOfSteps = 10;

/**
 * page number (for show)
 * @type {Number}
 */
automate.pageNumber = 1;

/**
 * generate initial layer (with one black dot in the center)
 * @param  {number} initialLayerSize - size of initial layer
 */
automate.generateInitialLayers = function(initialLayerSize) {
  var initialLayer = _.fill(Array(initialLayerSize), '1');
  initialLayer[initialLayer.length / 2] = '0';

  return initialLayer;
};

/**
 * generate next layer
 * @param  {[type]} prevResult previous layer
 * @param  {[type]} rules      automate rules
 * @param  {[type]} ruleSize   size of each rule
 * @return {[type]}            new layer
 */
automate.getNextResult = function(prevResult, rules, ruleSize) {
  // can't update border - no enough data
  var borderSize = Math.floor(ruleSize / 2);
  var result = _.slice(prevResult, 0, borderSize);
  for (var i = 0; i <= prevResult.length - ruleSize; i++) {
    // get first ruleSize
    var pattern = _.slice(prevResult, i, i + ruleSize).join('');

    var rule = rules.find(function(ruleIt) {
      return (ruleIt.get('id') === pattern);
    });
    result.push(rule.get('result'));
  }

  result = result.concat(_.slice(prevResult, prevResult.length - borderSize, prevResult.length));

  return result;
};

/**
 * generate N layers
 * @param  {[type]} automateSettings settings for automate
 * @param  {[type]} initialLayer     initial layer
 * @param  {[type]} getNextLayer     iterate function (prev => next)
 * @param  {[type]} layersNumber     how many layers should be generated
 * @return {[type]}                  array of N layers
 */
automate.generateNLayers = function(automateSettings, initialLayer, getNextLayer, layersNumber) {
  var result = [initialLayer];
  var prevLayer = initialLayer;
  for (var i = 0; i < layersNumber; i++) {
    var nextLayer = getNextLayer(prevLayer, automateSettings.rules, automateSettings.ruleSize);
    prevLayer = nextLayer;
    result.push(nextLayer);
  }

  return result;
};

/**
 * get concrete page from cached
 * @param  {Array} cached - previously calculated result
 * @param  {Number} pageSize - size of page
 * @param  {Number} pageNumber - number of page (starts from 1)
 */
automate.getPage = function(cached, pageSize, pageNumber) {
  var start = pageSize * (pageNumber - 1);
  var end = pageSize * pageNumber;
  var res = cached.slice(start, end);
  return res;
};

/**
 * update automate output
 * generate ALL layers according with user settings
 */
automate.updateAutomateResult = function() {
  automate.initialLayer = automate.generateInitialLayers(automate.initialLayerSize);
  automate.automateResultCached = automate.generateNLayers(automate, automate.initialLayer, automate.getNextResult, automate.numberOfSteps * automate.pageNumber);

  automate.automateResult = automate.getPage(automate.automateResultCached, automate.numberOfSteps, automate.pageNumber);
};

/**
 * change automate rule (by user)
 * @param  {string} ruleName id of rule
 */
automate.changeRule = function(ruleName) {
  // invert rule
  var res;
  var ruleIndex = rules.ruleIndex(function(ruleIt) {
    return ruleIt.get('id') === ruleName;
  });

  var rule = rules.get(ruleIndex);
  if (rule.get('result') === '0') {
    res = '1';
  } else {
    res = '0';
  }

  // it is immutable structure
  rule = rule.set('result', res);
  automate.rules = automate.rules.set(ruleIndex, rule);
};

// calculate initial automate output
automate.updateAutomateResult();

module.exports = automate;
