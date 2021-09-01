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

const AppMobile = ({ UiComponent, ...rest }) => <UiComponent {...rest} />;

AppMobile.propTypes = {
  UiComponent: PropTypes.func.isRequired,
  token: PropTypes.string,
  user: PropTypes.shape({})
};

AppMobile.defaultProps = {
  token: null,
  user: null
};

const mapStateToProps = state => ({
  token: state.app.token,
  user: state.auth.user,
  location: state.app.location,
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
)(AppMobile);
