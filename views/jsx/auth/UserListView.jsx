import $                 from 'jquery';
import React             from 'react';
import ReactMixin        from 'react-mixin';
import UserHasRoleMixin  from '../UserHasRoleMixin.jsx';

import LoadingMixin      from '../LoadingMixin.jsx';

import api               from '../../../api_routes.js';
import TagField          from '../form-components/TagField.jsx';
import UserAccountsTable from './UserAccountsTable.jsx';
import UserEditButton    from './UserEditButton.jsx';
import UserDeleteButton  from './UserDeleteButton.jsx';

var Router = require('react-router');
var Link = Router.Link;

var UserListView = React.createClass({
  mixins: [UserHasRoleMixin, LoadingMixin],
  getInitialState: function() {
    return {
      users : []
    };
  },
  componentDidMount: function() {
    var url = api.reverse('users');
    this.loading();
    $.ajax(url, {
      dataType: 'json',
      error : this.loadingError(url, 'Error retrieving users'),
      success: (users) => {
        this.loaded({
          users: users
        });
      },
    });
  },
  handleClickedDelete: function(evt) {
    console.log(evt);
  },
  handleUserDeleted: function(deletedUser) {
    // Remove deleted user from the list
    this.setState({
      users: this.state.users.filter((user) => user.uuid !== deletedUser.uuid)
    });
  },
  render: function() {

    if (this.isLoading()) {
      return (<div>Loading users</div>);
    }

    return (
      <div className="row">
        <h1>Users</h1>
        <table className="adminUsersTable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Roles</th>
              <th>Accounts</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              return this.state.users.map((user) => {
                return (
                  <tr key={user.uuid}>
                    <td>{user.name}</td>
                    <td>{user.roles.join(', ')}</td>
                    <td><UserAccountsTable user={user} /></td>
                    <td><UserEditButton user={user} /></td>
                    <td><UserDeleteButton user={user} onDelete={this.handleUserDeleted} /></td>
                  </tr>
                );
              });
            })()}
          </tbody>
        </table>
      </div>
    );
  }
});

export default UserListView;
