
import TimeAgo    from 'react-timeago';
import api        from '../../../api_routes.js';
import ui         from '../../../ui_routes.js';
import React      from 'react';
import UserAvatar from '../users/UserAvatar.jsx';
import ellipsis   from '../../../util/ellipsis.js';
import Score      from '../Score.jsx';
import I18nMixin  from '../i18n/I18nMixin.jsx';

var Router = require('react-router');
var Link = Router.Link;

var ReportThumbnail = React.createClass({

  mixins: [Router.Navigation, I18nMixin],

  statics: {
    /* Transforms eg. "Economy & Finance" to "Economy" */
    cleanUpColor: function(color) {
      if (!color) {
        return null;
      }
      return color.split(/\s+/, 1)[0];
    }
  },

  /* Get first 3 elements of array, as comma separated string. Null safe */
  _3: function(values) {
    return values ? values.slice(0, 3).join(', ') : null;
  },

  render: function() {
    var summary = ellipsis(this.props.report.abstract, 160);
    var areas = this._3(this.props.report.areas);
    var domains = this._3(this.props.report.domains);
    var organizations = this._3(this.props.report.organizations);
    var orgtypes = this._3(this.props.report.orgtypes);
    var types = this._3(this.props.report.types);
    var approaches = this._3(this.props.report.approaches);
    var tags = this._3(this.props.report.tags);

    var sector_colour = this.props.report.domains ? this.props.report.domains[0] : null;
    var sector_colour_marker;
    var sector_colour_overlay;

    sector_colour = ReportThumbnail.cleanUpColor(sector_colour);
    if (sector_colour) {
      sector_colour_marker = sector_colour.toLowerCase().concat('_colour scenario-thumbnail-marker');
      sector_colour_overlay = sector_colour.toLowerCase().concat('_colour scenario-thumbnail-image-wrapper');
    }

    var thumbnail;
    if (this.props.report.thumbnail) {
      thumbnail = (<img src={ui.asset(this.props.report.thumbnail)} width="100%"/>);
    }

    return (
      <div className="col-md-4">
        <div className="well scenario-thumbnail">
          <Link to="reportView" params={{ uuid: this.props.report.uuid }}>
            <div>
              <div className={sector_colour_marker}>
                <span className="scenario-thumbnail-marker-score">
                  {/*<Score className="scenario-article-score-thumbnail" score={this.props.report.score} />*/}
                </span>
              </div>
            </div>
            <header className="scenario-thumbnail-header">
              <span>
                <span className="scenario-thumbnail-timestamp">
                  { this.props.report.timestamp ?
                    <TimeAgo date={this.props.report.timestamp} formatter={this.i18nFormatter} />
                    : '' }
                </span>
              </span>
              <h3 className="scenario-thumbnail-title">
                {this.props.report.title}
              </h3>
              <span className="scenario-thumbnail-publisher-wrapper">
                <span className="meta">{this.i18n('Reports.posted_by', 'Posted by:')} </span>
                <span className="scenario-thumbnail-publisher">
                  <UserAvatar uuid={this.props.report.creator}
                    name={this.props.report.creatorName} />
                </span>
              </span>
            </header>
            <p className="scenario-thumbnail-summary">
              {summary}
            </p>
            <span className="scenario-thumbnail-sat-wrapper">
              <span>{this.i18n('Reports.areas', 'Areas')}: {areas}</span>
              <span>{this.i18n('Reports.domains', 'Domains')}: {domains}</span>
              <span>{this.i18n('Reports.organizations', 'Organizations')}: {organizations}</span>
              <span>{this.i18n('Reports.org_types', 'Organization Types')}: {orgtypes}</span>
              <span>{this.i18n('Reports.types_of_report', 'Types of report')}: {types}</span>
              <span>{this.i18n('Reports.approach', 'Approach')}: {approaches}</span>
              <span>{this.i18n('Reports.tags', 'Tags')}: {tags}</span>
            </span>
            <div className={sector_colour_overlay}>
              {thumbnail}
            </div>
          </Link>
        </div>
      </div>
    );
  }
});

export default ReportThumbnail;
