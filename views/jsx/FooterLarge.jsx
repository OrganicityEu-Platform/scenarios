import React      from 'react';
import ui         from '../../ui_routes.js';
import ContactUs  from './ContactUs.jsx';
import I18nMixin  from './i18n/I18nMixin.jsx';

var Router = require('react-router');
var Link = Router.Link;

var facebook = "https://www.facebook.com/OrganiCities"; // fa fa-facebook-official
var twitter = "https://twitter.com/organicity_eu";
var linkedin = "https://www.linkedin.com/company/alexandra-instituttet"; // fa fa-linkedin-square
var flickr = "https://www.flickr.com/photos/alexandra_instituttet/"; // fa fa-flickr
var slideshare = "http://www.slideshare.net/AlexandraInstituttet"; // fa fa-slideshare
var youtube = "https://www.youtube.com/user/alexandrainstituttet"; // fa fa-youtube-play

var organicityLink = "http://organicity.eu/";
var organicityBlog = "http://organicity.eu/blog/";
var organicityEvents = "http://organicity.eu/events/";

var FooterLarge = React.createClass({
  mixins: [Router.Navigation, I18nMixin],
  clickHandler: function () {
    this.transitionTo('signup');
  },
  render: function() {
    return (
      <div className="row oc-footer-large">
        <div className="oc-macro-content oc-footer-inner-wrapper">
          <div className="col-lg-3 white oc-footer-col" id="follow-col">
            <p className="oc-footer-title">{this.i18n('follow_us', 'Follow us')}</p>
            <span className="oc-social-links-wrapper">
              <a href={twitter}>
                <i className="fa fa-twitter oc-footer-social-link"></i>
              </a>
              <a href={facebook}>
                <i className="fa fa-facebook-official oc-footer-social-link"></i>
              </a>
            </span>
            <div className="oc-footer-large-eu-logo-wrapper">
              <img
                className="oc-footer-large-eu-logo"
                src={ui.asset('static/img/logo_eu.png')} />
            </div>
            <span className="oc-logo-text">
              {this.i18n('footer1', 'This project has received funding from the European Union\'s Horizon 2020 research and innovation program under the grant agreement No. 645198.')}
            </span>

          </div>
          <div className="col-lg-4 white oc-footer-col" id="resources-col">
            <p className="oc-footer-title">{this.i18n('footer2', 'More about OrganiCity')}</p>
            <span><a className="white" href={organicityLink}>{this.i18n('footer3', 'OrganiCity.eu')}</a></span>
            <span onClick={this.clickHandler} className="oc-link">
              {this.i18n('footer4', 'Sign up for updates')}
            </span>
            <span><a className="white" href={organicityBlog}>{this.i18n('blog', 'Blog')}</a></span>
            <span><a className="white" href={organicityEvents}>{this.i18n('events', 'Events')}</a></span>
          </div>
          <div className="col-lg-5 white oc-footer-col" id="oc-footer-contact-col">
            <p className="oc-footer-title">
              {this.i18n('contact_us', 'Contact us')}
            </p>
            <ContactUs currentUser={this.props.currentUser} />
          </div>
        </div>
        <div className="white oc-footer-copy-right-wrapper">
          <span>{this.i18n('copyright', 'Copyright')} <i className="fa fa-copyright"></i> {this.i18n('oc_2015', 'OrganiCity 2015')}</span>
        </div>
      </div>
    );
  }
});

export default FooterLarge;
