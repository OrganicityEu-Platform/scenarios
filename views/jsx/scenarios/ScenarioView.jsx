import $ from 'jquery';
import React from 'react';
import ScenarioTableView from './ScenarioTableView.jsx';
import api from '../../../api_routes.js';

var ScenarioView = React.createClass({
  getInitialState: function () {
    return null;
  },
  componentDidMount: function () {
    $.getJSON('/api/v1/scenarios/' + this.props.params.uuid, (scenario) => {
      if (this.isMounted()) {
        this.setState(scenario);
      }
    });
  },
  render: function () {
    if (this.state === null) {
      return null;
    }
    return (
      <div>
        <div class="row">
          <ScenarioTableView scenario={this.state} />
        </div>
        <div class="row">
          <ScenarioEditButton data={this.state}/>
          <ScenarioDeleteButton data={this.state}/>
        </div>
      </div>
    )
  }
});

export default ScenarioView;
