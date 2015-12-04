import $ from 'jquery';
import React from 'react';
import { Nav, Navbar, NavItem, DropdownButton, NavDropdown, MenuItem, CollapsibleNav } from 'react-bootstrap';
import { NavItemLink, ButtonLink, ListGroupItemLink } from 'react-router-bootstrap';
import ReactMixin          from 'react-mixin';
import UserIsLoggedInMixin from './UserIsLoggedInMixin.jsx';
import FooterLarge         from './FooterLarge.jsx';
import FooterSmall         from './FooterSmall.jsx';
import UserHasRoleMixin    from './UserHasRoleMixin.jsx';
import FlashQueue          from './FlashQueue.jsx';
import api                 from '../../api_routes.js';
import ui                  from '../../ui_routes.js';

import Signup from './auth/Signup.jsx';

var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;

var Scaffold = React.createClass({
  mixins : [UserIsLoggedInMixin, UserHasRoleMixin],
  getInitialState: function() {
    return {
      currentUser : undefined,
      initialAjax : false
    };
  },
  componentDidMount: function() {
    var url = api.reverse('currentUser');
    $.ajax(url, {
      dataType: 'json',
      success : this.onLogin,
      error : (xhr, textStatus, errorThrown) => {
        if (xhr.status === 401) {
          this.onLogout();
        } else {
          this.flashOnAjaxError(url, 'Error retrieving current user')(xhr, textStatus, errorThrown);
        }
      }
    });
  },
  onLogin: function(currentUser) {
    window.currentUser = currentUser;
    this.setState({
      currentUser: currentUser,
      initialAjax: true
    });
  },
  onLogout: function() {
    window.currentUser = undefined;
    this.setState({
      currentUser: undefined,
      initialAjax: true
    });
  },
  render : function() {

    var router;
    if (this.state.initialAjax) {
      router = (<RouteHandler
        onLogin={this.onLogin}
        onLogout={this.onLogout}
        currentUser={this.state.currentUser} />);
    } else {
      //console.log('Render initial scaffold');
    }

    var linksLeft = [];
    var linksRight = [];
    var adminLinks = [];

    linksLeft.push(
      <NavItemLink
        key="scenarioList"
        to="scenarioList"
        className="navbar-explore-btn">EXPLORE</NavItemLink>
    );
    linksLeft.push(
      <NavItemLink
        key="scenarioCreate"
        to="scenarioCreate"
        className="navbar-create-btn">CREATE</NavItemLink>
    );
    if (this.userIsLoggedIn()) {
      if (this.userHasRole('admin')) {
        linksRight.push(
          <NavItemLink
            key="users"
            to="admin_userList">Users</NavItemLink>
        );
        linksRight.push(
          <NavItemLink
            key="questionnaire"
            to="admin_questionnaire">Questionnaire</NavItemLink>
        );
        linksRight.push(
          <NavItemLink
            key="sysinfo"
            to="sysinfo" data-about>About</NavItemLink>
        );
      }
      linksRight.push(
        <NavItemLink key="profile" to="profile">Profile</NavItemLink>
      );
      linksRight.push(
        <NavItemLink
          key="logout"
          to="logout"
          className="nav-logout-btn">logout</NavItemLink>
      );
    } else {
      linksRight.push(
        <NavItemLink
          key="login"
          to="login"
          className="nav-login-btn">login</NavItemLink>
      );
      linksRight.push(
        <NavItemLink
          key="signup"
          to="signup"
          className="nav-signup-btn">signup</NavItemLink>
      );
    }
    return (
      <div className="container oc-page-wrapper" id="top">
        <div className="row">
          <Navbar brand={<Link to="home"><img src={ui.asset('static/img/oc-nav-header.png')}/></Link>} toggleNavKey={0}>
            <CollapsibleNav eventKey={0}>
              <span className="oc-left-links-wrapper">
                <Nav navbar>
                  {linksLeft}
                </Nav>
              </span>

              <Nav navbar right>
                {linksRight}
    

              </Nav>

            </CollapsibleNav>
          </Navbar>
        </div>
        <FlashQueue.Queue messages={this.props.messages}/>
          <div className="col-lg-12 oc-divider-wrapper">
            <img id="oc-divider" src={ui.asset('static/img/image-divider.svg')}></img>
          </div>
         {router}

        <div className="oc-footers">
          <FooterLarge currentUser={this.state.currentUser}/>
        </div>
      </div>
    );
  }
});

export default Scaffold;
