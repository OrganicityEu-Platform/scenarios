import $ from 'jquery';
import React from 'react';
import ScenarioTableView from './ScenarioTableView.jsx';
import ScenarioEditButton from './ScenarioEditButton.jsx';
import ScenarioDeleteButton from './ScenarioDeleteButton.jsx';
import api from '../../../api_routes.js';

var ScenarioView = React.createClass({
  getInitialState: function() {
    return null;
  },
  componentDidMount: function() {
    var url = api.reverse('scenario_by_uuid', { uuid : this.props.params.uuid });
    $.getJSON(url, (scenario) => {
      if (this.isMounted()) {
        this.setState(scenario);
      }
    });
  },
  render: function() {
    if (this.state === null) {
      return null;
    }
    return (
      <div>
        <div className="row">
          <ScenarioTableView scenario={this.state} />
        </div>
        <div className="row">
          <ScenarioEditButton scenario={this.state}/>
          <ScenarioDeleteButton scenario={this.state}/>
        </div>
      </div>
    );
  }
});

export default ScenarioView;
