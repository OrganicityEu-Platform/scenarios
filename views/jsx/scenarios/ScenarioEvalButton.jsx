import React from 'react';

var Router = require('react-router');

var ScenarioEvalButton = React.createClass({
  mixins: [Router.Navigation],
  handleClick: function() {
    this.transitionTo('scenarioEvalView', { uuid : this.props.scenario.uuid }, { version : this.props.scenario.version });
    if (typeof this.props.onChange == 'function') {
      this.props.onChange();
    }
  },
  render: function() {
      return (
        <button className="scenario-article-eval-btn" onClick={this.handleClick}>EVALUATE</button>
      );
  }
});

export default ScenarioEvalButton;
