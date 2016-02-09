import $                  from 'jquery';
import React              from 'react';

import api                from '../../../api_routes.js';

import UserHasRoleMixin   from '../UserHasRoleMixin.jsx';
import UserIsCreatorMixin from '../UserIsCreatorMixin.jsx';

import LoadingMixin       from '../LoadingMixin.jsx';

var Router = require('react-router');

var ScenarioDeleteButton = React.createClass({
  mixins: [UserHasRoleMixin, UserIsCreatorMixin, LoadingMixin],
  handleClick: function() {
    var sure = window.confirm('Are you sure you want to delete this version of the scenario?');
    if (sure) {
      this.loading();
      var url = api.reverse('scenario_by_uuid', { uuid : this.props.scenario.uuid });
      $.ajax(url, {
        type: 'DELETE',
        error: this.loadingError(url, 'Error trying to delete scenario'),
        success: (result) => {
          this.loaded();
          if (typeof this.props.onChange == 'function') {
            this.props.onChange();
          }
        }
      });
    }
  },
  render: function() {
    console.log(this.props);
    if (this.userHasRole('admin') || this.userIsCreator(this.props.scenario)) {
      var version = this.props.scenario.version;
      if(version > 1) {
        return (
          <button className="oc-button"
            disabled={this.isLoading() ? 'loading' : ''}
            onClick={this.handleClick}>UNDO TO PREVIOUS VERSION</button>
      //onClick={this.handleClick}>UNDO TO VERSION {version-1}</button>
        );
      } else {
        return (
          <button className="oc-button"
            disabled={this.isLoading() ? 'loading' : ''}
            onClick={this.handleClick}>DELETE</button>
        );
      }
    }
    return null;
  }
});

export default ScenarioDeleteButton;
