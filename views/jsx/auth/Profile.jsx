import $ from 'jquery';
import React from 'react';
import ReactMixin from 'react-mixin';
import UserHasRoleMixin from '../UserHasRoleMixin.jsx';
import api from '../../../api_routes.js';

var Router = require('react-router')
  , Link = Router.Link;

var Profile = React.createClass({
  mixins: [UserHasRoleMixin],
  getInitialState: function() {
    var state = {
      dirty  : false,
      name   : '',
      gender : 'f',
      roles  : []
    };
    return state;
  },
  componentDidMount: function() {
    $.ajax(api.route('currentUser'), {
      dataType: 'json',
      error: console.log,
      success: (data) => {
        console.log(data);
        this.state.dirty = false;
        this.setState(data);
      },
    });
  },
  handleChangedName: function(evt) {
    this.state.dirty = true;
    this.state.name = evt.target.value;
    this.setState(this.state);
  },
  handleChangedGender: function(evt) {
    this.state.dirty = true;
    this.state.gender = evt.target.value;
    this.setState(this.state);
  },
  handleChangedRoles: function(evt) {
    this.state.dirty = true;
    this.state.roles = evt.target.value.trim().split(",");
    this.setState(this.state);
  },
  handleSubmit: function(evt) {
    evt.preventDefault();
    var data = this.state;
    // patch would be forbidden if we try to change roles and we're not admin...
    if (!this.userHasRole("admin")) {
      data.roles = undefined;
    }
    $.ajax({
        type : "PATCH",
        url : "/api/v1/users/" + this.state.uuid,
        data : JSON.stringify(data),
        contentType : 'application/json',
        error : console.log,
        success : () => {
          this.state.dirty = false;
          this.setState(this.state);
        }
    });
  },
  render: function() {
    return (
      <div className="row well">
        <form className="form-horizontal">
          <div class="form-group">
            <label className="control-label col-sm-2" htmlFor="profile-name">Name</label>
            <div className="col-sm-10">
              <input  type="text"
                      className="form-control"
                      id="profile-name"
                      value={this.state.name}
                      onChange={this.handleChangedName} />
            </div>
          </div>
          <div class="form-group">
            <label className="control-label col-sm-2" htmlFor="profile-gender">Gender</label>
            <div className="col-sm-10">
              <input type="radio" name="gender" id="profile-gender-f" value="f" checked={this.state.gender == 'f'} onChange={this.handleChangedGender} /> Female<br/>
              <input type="radio" name="gender" id="profile-gender-m" value="m" checked={this.state.gender == 'm'} onChange={this.handleChangedGender} /> Male
            </div>
          </div>
          {(() => {
            if (this.userHasRole("admin")) {
              return (
                <div class="form-group">
                  <label className="control-label col-sm-2" htmlFor="profile-roles">Roles</label>
                  <div className="col-sm-10">
                    <input  type="text"
                            className="form-control"
                            id="profile-roles"
                            placeholder="Roles..."
                            value={this.state.roles ? this.state.roles.join(",") : ''}
                            onChange={this.handleChangedRoles} />
                  </div>
                </div>
              );
            } else {
              return null;
            }
          })()}
          <div class="form-group">
            <div className="col-sm-2"></div>
            <div className="col-sm-10">
              <button id="profile-submit"
                      type="submit"
                      disabled={this.state.dirty ? '' : 'disabled'}
                      className="btn btn-default"
                      onClick={this.handleSubmit}>Save Profile</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
});

export default Profile;
