import $ from 'jquery';
import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { NavItemLink, ButtonLink, ListGroupItemLink } from 'react-router-bootstrap';
import ReactMixin from 'react-mixin';
import UserIsLoggedInMixin from './UserIsLoggedInMixin.jsx';
import OcFooter from './OcFooter.jsx';
import UserHasRoleMixin from './UserHasRoleMixin.jsx';
import FlashQueue from './FlashQueue.jsx';
import api from '../../api_routes.js';

var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;

var Scaffold = React.createClass({
  mixins : [UserIsLoggedInMixin, FlashQueue.Mixin, UserHasRoleMixin],
  getInitialState: function() {
    return {
      currentUser : null
    };
  },
  componentDidMount: function() {
    var self = this;
    $.ajax(api.reverse('currentUser'), {
      accepts : 'application/json',
      success : self.onLogin,
      error : function(jqXHR, textStatus, errorThrown) {
        if (jqXHR.status === 422) {
          self.onLogout();
        } else {
          this.flashOnAjaxError(
            api.reverse('currentUser'),
            'Error retrieving current user'
          )(jqXHR, textStatus, errorThrown);
        }
      }
    });
  },
  onLogin: function(currentUser) {
    window.currentUser = currentUser;
    this.state.currentUser = currentUser;
    this.setState(this.state);
  },
  onLogout: function() {
    window.currentUser = undefined;
    this.state.currentUser = undefined;
    this.setState(this.state);
  },
  render : function() {
    var loggedInLinks = [];
    var userLinks = [];
    if (this.userIsLoggedIn()) {
      loggedInLinks.push(<NavItemLink key="scenarioCreate" to="scenarioCreate" className="navbar-create-btn">CREATE</NavItemLink>);
      userLinks.push(<NavItemLink key="profile" to="profile">Profile</NavItemLink>);
      userLinks.push(<NavItemLink key="logout" to="logout" className="nav-logout-btn">Logout</NavItemLink>);
    } else {
      userLinks.push(<NavItemLink key="login" to="login" className="nav-login-btn">Login</NavItemLink>);
      userLinks.push(<NavItemLink key="signup" to="signup" className="nav-signup-btn">Signup</NavItemLink>);
    }
    return (
      <div className="container oc-page-wrapper">
        <Navbar brand={<Link to="home">Home</Link>}>
          <Nav>
            <NavItemLink to="scenarioList" className="navbar-explore-btn">EXPLORE</NavItemLink>
            {loggedInLinks}
          </Nav>
          <Nav>
            {userLinks}
            {(() => {
              if (this.userHasRole('admin')) {
                return <NavItemLink to="admin_userList">Users</NavItemLink>;
              }
              return null;
            })()}
          </Nav>
        </Navbar>
        <FlashQueue.Queue messages={this.props.messages}/>
        <RouteHandler onLogin={this.onLogin} onLogout={this.onLogout} currentUser={this.state.currentUser} />
      </div>

    );
  }
});

export default Scaffold;
