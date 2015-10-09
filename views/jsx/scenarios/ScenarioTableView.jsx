import React    from 'react';
import TimeAgo  from 'react-timeago';
import ui       from '../../../ui_routes.js';

var ScenarioTableView = React.createClass({
  render: function() {
    if (!this.props.scenario) {
      return null;
    }

    var thumbnail = this.props.scenario.thumbnail;
    if (thumbnail && thumbnail.startsWith('uploads/')) {
      thumbnail = (<img src={ui.asset(this.props.scenario.thumbnail)} width="100%"/>);
    } else if (thumbnail) {
      thumbnail = (<img src={this.props.scenario.thumbnail} width="100%"/>);
    }

    console.log('Render Scenario', this.props.scenario);

    return (
      <div className="scenario-article">
        <header className="scenario-article-header">
          <h2 className="scenario-article-title">{this.props.scenario.title}</h2>
          <div className="scenario-article-header-meta">
            <span className="scenario-article-publisher">user</span>
            <span className="scenario-article-badge">badge</span>
            <span className="scenario-article-timestamp">
              { this.props.scenario.timestamp ?
              <TimeAgo date={this.props.scenario.timestamp} />
              : '' }
            </span>
          </div>
          <p className="scenario-article-summary">
            {this.props.scenario.summary}
          </p>
        </header>
        <div className="scenario-article-section">
          <div className="scenario-article-image">
            {thumbnail}
          </div>
          <div className="scenario-article-meta"></div>
          <div className="scenario-article-narrative">
            {this.props.scenario.narrative}
          </div>
        </div>
        <footer className="scenario-article-footer">
          <span className="scenario-ast">actors:</span>
          <span>{this.props.scenario.actors ? this.props.scenario.actors.join(', ') : ''}</span><br></br>

          <span className="scenario-ast">sectors:</span>
          <span>{this.props.scenario.sectors ? this.props.scenario.sectors.join(', ') : ''}</span><br></br>

          <span className="scenario-ast">tools:</span>
          <span>{this.props.scenario.devices ? this.props.scenario.devices.join(', ') : ''}</span><br></br>
        </footer>
      </div>
    );
  }
});

export default ScenarioTableView;
