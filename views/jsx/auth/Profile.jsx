import $                from 'jquery';
import React            from 'react';
import ReactMixin       from 'react-mixin';
import UserHasRoleMixin from '../UserHasRoleMixin.jsx';
import api              from '../../../api_routes.js';
import FlashQueue       from '../FlashQueue.jsx';
import LoadingMixin     from '../LoadingMixin.jsx';
import TagField         from '../form-components/TagField.jsx';

import UserIsLoggedInMixin from '../UserIsLoggedInMixin.jsx';


var Router = require('react-router');
var Link = Router.Link;

// Input validation
import validation   from 'react-validation-mixin';
import strategy     from 'joi-validation-strategy';
import UserJoi      from '../../../models/joi/user.js';
import ErrorMessage from '../ErrorMessage.jsx';

var Profile = React.createClass({
  mixins: [FlashQueue.Mixin, UserHasRoleMixin, LoadingMixin, UserIsLoggedInMixin],
  getInitialState: function() {
    return {};
  },
  componentDidMount: function() {

    var url = api.reverse('currentUser');
    if(this.props.uuid) {
      url = api.reverse('user_by_uuid', { uuid : this.props.uuid });
    }

    this.loading();
    $.ajax(url, {
      dataType: 'json',
      error: (xhr) => {
        if(xhr.status = 403) {
          this.loaded();
        } else {
          this.loadingError(url, 'Error retrieving current user');
        }
      },
      success : (profile) => {
        var e = {};
        e.name = (profile.name) ? profile.name : '';
        e.gender = (profile.gender) ? profile.gender : '';
        e.roles = (profile.roles) ? profile.roles : [];
        if(profile.local) {
          e.local = profile.local;
        }
        e.uuid = profile.uuid;
        e.dirty = false;

        this.loaded({profile: e});
        this.props.validate();
      }
    });
  },
  handleChangedName: function(evt) {
    this.state.dirty = true;
    this.state.profile.name = evt.target.value;
    this.setState(this.state);
    this.props.validate();
  },
  handleChangedGender: function(evt) {
    this.state.dirty = true;
    this.state.profile.gender = evt.target.value;
    this.setState(this.state);
    this.props.validate();
  },
  handleChangedRoles: function(roles) {
    this.state.dirty = true;
    this.state.profile.roles = roles;
    this.setState(this.state);
    this.props.validate();
  },
  handleChangedPassword : function(evt) {
    this.state.dirty = true;
    this.state.profile.password = evt.target.value;
    this.setState(this.state);
    this.props.validate();
  },
  handleChangedPasswordRepeat : function(evt) {
    this.state.dirty = true;
    this.state.profile.password_repeat = evt.target.value;
    this.setState(this.state);
    this.props.validate();
  },
  handleSubmit: function(evt) {
    evt.preventDefault();
    var profile = {
      name: this.state.profile.name,
      gender: this.state.profile.gender
    };

    if (this.state.profile.password) {
      profile.local = {
        password: this.state.profile.password
      };
    }

    // patch would be forbidden if we try to change roles and we're not admin
    if (this.userHasRole('admin') && this.state.profile.roles) {
      profile.roles = this.state.profile.roles;
    }

    this.loading();
    var url = api.reverse('user_by_uuid', { uuid : this.state.profile.uuid});

    $.ajax(url, {
      type : 'PATCH',
      data : JSON.stringify(profile),
      contentType : 'application/json',
      error : this.loadingError(url, 'Error updating user profile'),
      success : () => {
        this.loaded({ dirty : false });
        this.flash('success', 'Profile succesfully updated!');
      }
    });

  },
  render: function() {

    //console.log("Render Profile with state ", this.state);

    if (!this.userIsLoggedIn()) {
      return (
        <div>
          You are not logged in!
        </div>
      );
    }

    if (!this.state.profile) {
      return (
        <div>
          Loading!
        </div>
      );
    }

    var localAccount = '';
    if(this.state.profile.local) {
      localAccount = (
        <div>
          <h4>Local account</h4>
          <div className="form-group">
            <label className="control-label col-sm-2" htmlFor="email">Email</label>
            <div className="col-sm-10">
               <input type="text"
                className="form-control"
                name="email"
                disabled="disabled"
                value={this.state.profile.local.email} />
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-sm-2" htmlFor="password">Password</label>
            <div className="col-sm-10">
               <input type="password"
                className="form-control"
                name="password"
                disabled={this.isLoading() ? 'disabled' : ''}
                onChange={this.handleChangedPassword} />
              <ErrorMessage messages={this.props.getValidationMessages('password')} />
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-sm-2" htmlFor="password_repeat">Repeat Password</label>
            <div className="col-sm-10">
              <input type="password"
                className="form-control"
                name="password_repeat"
                disabled={this.isLoading() ? 'disabled' : ''}
                onChange={this.handleChangedPasswordRepeat} />
              <ErrorMessage messages={this.props.getValidationMessages('password_repeat')} />
            </div>
          </div>
        </div>
      );
    }
    /*
    console.log('##############################################################');
    console.log('Errors:', this.props.errors);
    console.log('Valid:',  this.props.isValid());
    console.log('Dirty:',  this.state.dirty);
    */

    return (
      <div className="row well">
        <form className="form-horizontal">
          {/* Remove this, as soon ORG-182 is fixed (see below) */}
          <ErrorMessage messages={this.props.getValidationMessages()} />
          <div className="form-group">
            <label className="control-label col-sm-2" htmlFor="profile-name">Name</label>
            <div className="col-sm-10">
              <input  type="text"
                      className="form-control"
                      id="profile-name"
                      disabled={this.isLoading() ? 'disabled' : ''}
                      placeholder={this.isLoading() ? 'Loading...' : 'Name...'}
                      value={this.state.profile.name}
                      onChange={this.handleChangedName} />
              <ErrorMessage messages={this.props.getValidationMessages('name')} />
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-sm-2" htmlFor="profile-gender">Gender</label>
            <div className="col-sm-10">
              <input type="radio"
                name="gender"
                id="profile-gender-f"
                value="f"
                disabled={this.isLoading() ? 'disabled' : ''}
                checked={this.state.profile.gender === 'f'}
                onChange={this.handleChangedGender} /> Female<br/>
              <input type="radio"
                name="gender"
                id="profile-gender-m"
                value="m"
                disabled={this.isLoading() ? 'disabled' : ''}
                checked={this.state.profile.gender === 'm'}
                onChange={this.handleChangedGender} /> Male
              <ErrorMessage messages={this.props.getValidationMessages('gender')} />
            </div>
          </div>

          <div className="form-group">
            <label className="control-label col-sm-2" htmlFor="profile-roles">Roles</label>
            <div className="col-sm-10">
              <TagField
                disabled={this.userHasRole('admin') ? false : true}
                key={this.state.uuid + '_roles'}
                tags={this.state.profile.roles}
                loading={this.isLoading()}
                onChange={this.handleChangedRoles} />
              {/* This should work, as soon ORG-182 is fixed (see above) */}
              <ErrorMessage messages={this.props.getValidationMessages('roles')} />
            </div>
          </div>

          {localAccount}

          <div className="form-group">
            <div className="col-sm-2"></div>
            <div className="col-sm-10">
              <button id="profile-submit"
                      type="submit"
                      disabled={(this.props.isValid() && this.state.dirty) ? '' : 'disabled'}
                      className="btn btn-default"
                      onClick={this.handleSubmit}>Save Profile</button>
            </div>
          </div>
        </form>
      </div>
    );
  },
  getValidatorData: function() {

    // Issue
    // (a) Array validation fails  -> no roles!
    // (b) Nested validation fails -> password not nested to `local`
    // @see: https://github.com/jurassix/react-validation-mixin/issues/38
    //roles : this.state.roles,

    var e = {};
    e.name            = this.state.profile.name;
    e.gender          = this.state.profile.gender;
    if(this.state.profile.local) {
      e.password        = this.state.profile.password;
      e.password_repeat = this.state.profile.password_repeat;
    }

    return e;
  },
  validatorTypes: UserJoi.profileClient
});

export default validation(strategy)(Profile);
