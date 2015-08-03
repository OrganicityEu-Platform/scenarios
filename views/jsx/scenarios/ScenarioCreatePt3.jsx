import React from 'react';
var Router = require('react-router');

var ScenarioCreatePt3 = React.createClass({
  mixins : [Router.Navigation],
  getInitialState: function () {
    return window.localStorage && window.localStorage.ocScenarioCreate ?
      JSON.parse(window.localStorage.ocScenarioCreate) : {
        title : '',
        summary : '',
        narrative : ''
      };
  },
  clickedPrevious : function() {
    window.localStorage.ocScenarioCreate = JSON.stringify(this.state);
    this.transitionTo('scenarioCreatePt2');
  },
  clickedNext : function() {
    window.localStorage.ocScenarioCreate = JSON.stringify(this.state);
    this.transitionTo('scenarioCreatePt4');
  },
  render: function () {
    return (
      <div className="row">
        <h2>Create your scenario <small>step three</small></h2>
        <h3>Select the Actor(s)!</h3>
        <p>
          Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum
          massa justo sit amet risus. Sed posuere consectetur est at lobortis. Morbi leo risus,
          porta ac consectetur ac, vestibulum at eros. Cras justo odio, dapibus ac facilisis in,
          egestas eget quam.
        </p>
        <p>
          <button type="button" className="btn btn-default" onClick={this.clickedPrevious}>Previous</button>
          <button type="button" className="btn btn-default" onClick={this.clickedNext}>Next</button>
        </p>
      </div>
    )
  }
});

export default ScenarioCreatePt3;
