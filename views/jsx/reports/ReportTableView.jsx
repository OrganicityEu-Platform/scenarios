import React              from 'react';
import TimeAgo            from 'react-timeago';
import ui                 from '../../../ui_routes.js';
import UserAvatar         from '../users/UserAvatar.jsx';
import Counter            from '../Counter.jsx';
import Score              from '../Score.jsx';
import Comments           from '../Comments.jsx';
// import ScenarioEvalButton from './ScenarioEvalButton.jsx'; TODO
import api                from '../../../api_routes.js';
import ReportThumbnail    from './ReportThumbnail.jsx';

import LoadingMixin       from '../LoadingMixin.jsx';
import I18nMixin          from '../i18n/I18nMixin.jsx';

var ReportTableView = React.createClass({
  mixins: [LoadingMixin, I18nMixin],
  render: function() {
    if (!this.props.report) {
      return null;
    }

    var image = this.props.report.image;
    if (image && (image.startsWith('uploads/') || image.startsWith('tmp/'))) {
      image = (<img src={ui.asset(this.props.report.image)} width="100%"/>);
    } else {
      image = undefined;
    }

    var sector_colour = this.props.report.domains ? this.props.report.domains[0] : null;
    sector_colour = ReportThumbnail.cleanUpColor(sector_colour);
    var sector_colour_marker;
    if (sector_colour) {
      sector_colour_marker = sector_colour.toLowerCase().concat('_colour scenario-article-marker');
    } else {
      sector_colour_marker = 'scenario-article-marker';
    }

    var credit;
    if (this.props.report.credit) {
      credit = (
        <div className="col-md-3">
          <div className="scenario-ast-wrapper">
            <span className="scenario-ast">Credit:</span>
            <span className="scenario-ast-items">{this.props.report.credit}</span><br></br>
          </div>
        </div>
      );
    }

    var copyright;
    if (this.props.report.copyright) {
      copyright = (
        <div className="col-md-12 scenario-article-copyright">
          &copy; {this.props.report.copyright}
        </div>
      );
    }

    var evaluationsCnt = 0;
    if (this.props.report.score && this.props.report.score.numOfEvaluations) {
      evaluationsCnt = this.props.report.score.numOfEvaluations;
    }

    return (
      <div className="col-lg-8 col-lg-offset-2">
      <div className="scenario-article">
        <header className="report-article-header row">
          <div className="col-lg-4 col-lg-push-8 scenario-article-header-right-top">
            <div className={sector_colour_marker}><span className="scenario-article-score"><Score className="scenario-article-score" score={this.props.report.score} /></span></div>
              <div className="scenario-article-widget-data">
                <p className="scenario-article-widget-data-views"><i className="fa fa-eye"></i><Counter scope="reports" className="scenario-article-views" id={this.props.report.uuid} />  views</p>
                <p className="scenario-article-widget-data-comments"><i className="fa fa-comment-o"></i><Comments scope="reports" className="scenario-article-comments" id={this.props.report.uuid} />  comments</p>
                <p className="scenario-article-widget-data-evaluations"><i className="fa fa-check-square-o"></i>{evaluationsCnt} evaluations</p>
              </div>
          </div>
          <div className="col-lg-8 col-lg-pull-4 scenario-article-header-left-bottom">
            <h2 className="scenario-article-title">{this.props.report.title}</h2>
              <div>
                <span className="scenario-article-publisher">
                  Created by <UserAvatar uuid={this.props.report.creator} />
                </span>
                <span className="scenario-article-timestamp">
                  { this.props.report.timestamp ?
                    <TimeAgo date={this.props.report.timestamp} formatter={this.i18nFormatter} />
                    : '' }
                </span>
              </div>
              <div className="scenario-article-summary-wrapper">
                <p className="scenario-article-summary">
                  {this.props.report.summary}
                </p>
              </div>
          </div>
        </header>

        <div className="scenario-article-section">
          <div id="scenario-article-image">
            {image}
          </div>
          {copyright}
          <div className="scenario-article-meta">
            <div className="col-md-3">
              <div className="scenario-ast-wrapper">
                <span className="scenario-ast">{this.props.report.domains && this.props.report.domains.length > 1 ? 'Domains:' : 'Domain:'}</span>
                <span className="scenario-ast-items">{this.props.report.domains ? this.props.report.domains.join(', ') : ''}</span><br></br>
              </div>
            </div>
            <div className="col-md-3">
              <div className="scenario-ast-wrapper">
                <span className="scenario-ast">Tags:</span>
                <span className="scenario-ast-items">{this.props.report.tags ? this.props.report.tags.join(', ') : ''}</span><br></br>
              </div>
            </div>
            <div className="col-md-3">
              <div className="scenario-ast-wrapper">
                <span className="scenario-ast">{this.props.report.areas && this.props.report.areas.length > 1 ? 'Areas:' : 'Area:'}</span>
                <span className="scenario-ast-items">{this.props.report.areas ? this.props.report.areas.join(', ') : ''}</span><br></br>
              </div>
            </div>

            {credit}
            
          </div>
        </div>
        <footer className="scenario-article-footer"></footer>
      </div>
      <div className="scenario-article-narrative-wrapper">
          <span className="col-md-1 scenario-article-narrative-title">Abstract</span>
          <div className="scenario-article-narrative col-md-11">
            {this.props.report.abstract}
          </div>
      </div>
    </div>
    );
  }
});

export default ReportTableView;
