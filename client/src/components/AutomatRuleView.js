'use strict';

var React = require('react/addons');

var ChangeRuleActionCreators = require('../actions/ChangeRuleActionCreators');

require('styles/AutomatRuleView.less');

var AutomatRuleView = React.createClass({
  onMyClick: function() {
    ChangeRuleActionCreators.changeRule(this.props.ruleName);
  },

  render: function () {
    return (
        <td onClick={this.onMyClick} className="AutomatRuleView">
          <div>
            {this.props.ruleName}
          </div>
          <div>
            {this.props.ruleResult}
          </div>
        </td>
      );
  }
});

module.exports = AutomatRuleView;