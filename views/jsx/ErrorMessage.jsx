import React from 'react';

/*
 * Prints an array of Messages as errors
 *
 * <ErrorMessage messages={[]} />
 */
var ErrorMessage = React.createClass({
  render: function() {
    if (!this.props.messages) {
      return null;
    }
    return (
      <div>{this.props.messages.map(this.renderHelpText)}</div>
    );
  },
  renderHelpText: function(message) {
    var divStyle = {
      marginBottom : 0
    };
    return (
      <div className="alert alert-danger" style={divStyle}>{message}</div>
    );
  }
});

export default ErrorMessage;