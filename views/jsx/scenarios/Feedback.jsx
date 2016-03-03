import $                    from 'jquery';
import api                  from '../../../api_routes.js';
import React                from 'react';
import ScenarioRating       from './ScenarioRating.jsx';

import LoadingMixin         from '../LoadingMixin.jsx';
import UserIsCreatorMixin   from '../UserIsCreatorMixin.jsx';
import UserIsLoggedInMixin  from './../UserIsLoggedInMixin.jsx';



var Feedback = React.createClass({
  mixins : [LoadingMixin, UserIsLoggedInMixin, UserIsCreatorMixin],
  getInitialState: function() {
    return {
      show: true,
      hasEvaluated: false,
      evaluations: this.props.evaluations ? this.props.evaluations : null,
      scenario: this.props.scenario ? this.props.scenario : null,
      likeText: null,
      dislikeText: null,
      userFeedback: []
    };
  },
  componentWillMount: function() {
    if(this.userHasEvaluated(this.state.evaluations)) {
      this.setState({hasEvaluated: true});
    }
  },
  componentDidMount: function() {
    if(this.userIsCreator(this.state.scenario)) {
      this.loadUserFeedback();
    }
  },
  userHasEvaluated: function(evaluations) {
    if (evaluations){
      var e;
      for(e = 0; e < evaluations.length; e++) {
        if(evaluations[e].uuid === this.state.scenario.uuid){
          return true;
        }
      }
    }
  },
  handleLikeTextChange: function(evt) {
    this.setState({likeText: evt.target.value});
  },
  handleDislikeTextChange: function(evt) {
    this.setState({dislikeText: evt.target.value});
  },
  loadUserFeedback: function() {
    var url = api.reverse('feedback_by_scenario', { uuid : this.state.scenario.uuid });
    $.ajax(url, {
      dataType: 'json',
      success : this.handleUserFeedback
    });
  },
  handleUserFeedback: function(feedback){
    var e;
    for(e = 0; e < feedback.length; e++) {
      var tick = {
        user: feedback[e].user,
        like: feedback[e].like,
        dislike: feedback[e].dislike
        // TODO: add timestamp in api
      };
      var tock = <div>
        <span>{feedback[e].user}</span>
        <span>Likes:</span><p>{feedback[e].like}</p>
        <span>Dislikes:</span><p>{feedback[e].dislike}</p>
      </div>;
      this.state.userFeedback.push(tock);
    }
    this.setState(this.state);
  },
  getUserFeedback: function() {
    return this.state.userFeedback.map(function(feedback, i){
      return <div>
          {feedback}
      </div>;
    }, this);
  },
  handleSubmit: function() {
    var url = api.reverse("feedback_list");
    var feedback = {
      user: currentUser ? currentUser.uuid : "Anonymous",
      like: this.state.likeText,
      dislike: this.state.dislikeText,
      scenario: {
        uuid: this.state.scenario.uuid,
        version: this.state.scenario.version
      }
    };
    $.ajax(url, {
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(feedback),
      method: 'POST',
      error : (xhr, textStatus, errorThrown) => {
        console.log(errorThrown);
      },
      success: this.setState({show: false})
    });
  },
  render: function() {

    var likeText = "What do you like about this scenario?";
    var dislikeText = "What don't you like about this scenario?";

    if(this.userIsCreator(this.state.scenario)) {return(
      <div className="row">
        <div className="oc-macro-content">
          <span>{this.getUserFeedback()}</span>
        </div>
      </div>
    );}
    if(this.state.hasEvaluated){return(
      <div className="row">
        <div className="oc-macro-content">
          <span>You have evaluated this scenario.</span>
        </div>
      </div>
    );}
    if(this.state.show) {
      return(
        <div className="row">
          <div className="oc-macro-content">
            <span>Rate this scenario </span>
            <ScenarioRating
              scenario={this.props.scenario}
              enabled={true}>
            </ScenarioRating>
            <span>
              {likeText}
            </span>
            <textarea
              className="oc-input"
              onChange={this.handleLikeTextChange}>
            </textarea>
            <span>
              {dislikeText}
            </span>
            <textarea
              className="oc-input"
              onChange={this.handleDislikeTextChange}>
            </textarea>

          </div>
          <div className="col-md-2 col-md-offset-5">
            <button
              className="oc-button"
              onClick={() => this.handleSubmit()}>
              SEND FEEDBACK
            </button>
          </div>
        </div>
      );
    }
    if(!this.state.show) {
      return(
        <div className="row">
          <div className="oc-macro-content">
            <span>Thank you!</span>
          </div>
        </div>
      );
    }
  }
});

export default Feedback;
