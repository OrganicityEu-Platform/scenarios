import $                from 'jquery';
import React            from 'react';
import ReactMixin       from 'react-mixin';
import Router           from 'react-router';

import UserHasRoleMixin from '../UserHasRoleMixin.jsx';
import LoadingMixin     from '../LoadingMixin.jsx';
import api              from '../../../api_routes.js';

import QuestionnaireQuestionsEditView from './QuestionnaireQuestionsEditView.jsx';

var QuestionnaireEditView = React.createClass({
  mixins: [LoadingMixin, UserHasRoleMixin],
  getInitialState: function() {
    return {
      questionnaire : null
    };
  },
  componentWillMount: function() {
    this.loading();
  },
  componentDidMount: function() {
    var url = api.reverse('questionnaire');
    $.ajax(url, {
      dataType: 'json',
      error : this.loadingError(url, 'Error loading questionnaire'),
      success: (questionnaire) => {
        this.loaded({ questionnaire : questionnaire });
      },
    });
  },
  handleChangedDescription: function(evt) {
    this.state.questionnaire.description = evt.target.value;
    this.setState(this.state);
  },
  handleChangedExplanation: function(evt) {
    this.state.questionnaire.explanation = evt.target.value;
    this.setState(this.state);
  },
  handleChangedQuestions: function(questions) {
    this.state.questionnaire.questions = questions;
    this.setState(this.state);
  },
  save: function(method) {
    delete this.state.questionnaire.author;  // set by server
    delete this.state.questionnaire.version; // set by server
    this.loading(true);
    var url = api.reverse('questionnaire');
    $.ajax(url, {
      method: method,
      dataType: 'json',
      data: this.state.questionnaire,
      error : this.loadingError(url, 'Error updating questionnaire'),
      success: (questionnaire) => {
        this.loaded({ questionnaire : questionnaire });
      }
    });
  },
  clickedPublishNewVersion: function(evt) {
    this.save('POST');
  },
  clickedPublishCosmetic: function(evt) {
    this.save('PATCH');
  },
  render: function() {
    if (this.isLoading()) {
      return (
        <div className="row">
          <div className="col-md-12">
            Loading...
          </div>
        </div>
      );
    }
    return (
      <div className="row">
        <div className="col-md-12">
          <h2>Edit Questionnaire</h2>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Aenean eu leo
            quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Integer posuere
            erat a ante venenatis dapibus posuere velit aliquet.
          </p>
        </div>
        <div className="row well">
          <form className="form-horizontal">
            <div className="form-group">
              <label className="control-label col-sm-2" htmlFor="description">Description</label>
              <div className="col-sm-10">
                <input type="text" className="form-control" name="description" id="description" value={this.state.questionnaire.description}
                  onChange={this.handleChangedDescription} />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-sm-2" htmlFor="explanation">Explanation</label>
              <div className="col-sm-10">
                <input type="text" className="form-control" name="explanation" id="explanation" value={this.state.questionnaire.explanation}
                  onChange={this.handleChangedExplanation} />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-sm-2">Questions</label>
              <div className="col-sm-10">
                <QuestionnaireQuestionsEditView
                  questions={this.state.questionnaire.questions}
                  onChange={this.handleChangedQuestions} />
              </div>
            </div>
            <div className="form-group">
              <div className="col-sm-2"></div>
              <div className="col-sm-3">
                <button type="button" className="btn btn-warning"
                  onClick={this.clickedPublishNewVersion}>Publish as new version</button>
              </div>
              <div className="col-sm-5">
                This will "release" a new questionnaire version. The evaluations users fill out are
                annotated with the questionnaire version so it is always clear which version of
                questionnaire was filled out. Please keep in mind that answers to questionnaires of
                different version might not be comparable at all or need additional manual effort to
                make them comparable.
              </div>
            </div>
            <div className="form-group">
              <div className="col-sm-2"></div>
              <div className="col-sm-3">
                <button type="button" className="btn btn-primary" onClick={this.clickedPublishCosmetic}>Publish as cosmetic change</button>
              </div>
              <div className="col-sm-5">
                This will update the current version in place and not increment the version number.
                Only do this if you're doing cosmetic changes (such as fixing typos) in the
                questionnaire.
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
});

export default QuestionnaireEditView;
