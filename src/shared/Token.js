import React from 'react';
import { connect } from 'react-redux';

function WithToken(UiComponent) {
  class BaseToken extends React.Component {
    render() {
      return <UiComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => ({
    token: state.app.token
  });

  return connect(mapStateToProps)(BaseToken);
}

export default WithToken;
