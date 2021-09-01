import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  APP_LOAD,
  APP_LOGOUT,
  APP_SET_LOCATION,
  NOTIFICATION_SHORT_LOAD
} from '../modules/constants/actions';
import request from '../modules/request';

class App extends React.Component {
  componentWillMount() {
    const { token } = this.props;
    if (token) {
      request.setToken(token);
    }
    this.props.verifyToken(token ? request.auth.info() : null, token);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.token) {
      this.props.loggingOut();
    }
  }

  render() {
    const {
      UiComponent,
      token,
      user,
      status,
      message,
      loaded,
      location,
      verifyToken,
      getShortNotification,
      setLocation,
      ...rest
    } = this.props;

    return (
      <UiComponent
        token={token}
        location={location}
        user={user}
        status={status}
        message={message}
        verifyToken={verifyToken}
        getShortNotification={getShortNotification}
        setLocation={setLocation}
        loaded={loaded}
        {...rest}
      />
    );
  }
}

App.propTypes = {
  UiComponent: PropTypes.func.isRequired,
  token: PropTypes.string,
  loaded: PropTypes.bool,
  status: PropTypes.string,
  message: PropTypes.string,
  user: PropTypes.shape({})
};

App.defaultProps = {
  token: null,
  status: null,
  message: null,
  user: null,
  loaded: false
};

const mapStateToProps = state => ({
  token: state.app.token,
  user: state.auth.user,
  status: state.app.status,
  message: state.app.message,
  location: state.app.location,
  loaded: state.auth.loaded,
  unread: state.notification.unread
});

const mapDispatchToProps = dispatch => ({
  verifyToken: (payload, token) => dispatch({ type: APP_LOAD, payload, token }),
  getShortNotification: () =>
    dispatch({
      type: NOTIFICATION_SHORT_LOAD,
      payload: request.notification.shortList()
    }),
  setLocation: payload => dispatch({ type: APP_SET_LOCATION, payload }),
  loggingOut: () => dispatch({ type: APP_LOGOUT })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
