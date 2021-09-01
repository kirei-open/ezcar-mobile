import React from 'react';
import { connect } from 'react-redux';
import {
  NOTIFICATION_SHORT_LOAD,
  NOTIFICATION_SHORT_UNLOAD,
  NOTIFICATION_READ,
  APP_LOGOUT,
  APP_CHANGE_PASSWORD,
  APP_RESET_PASSWORD
} from '../modules/constants/actions';
import request from '../modules/request';

const AuthMobile = ({ UiComponent, ...rest }) => <UiComponent {...rest} />;

const mapStateToProps = state => ({
  user: state.auth.user || {},
  token: state.app.token || '',
  status: state.app.status || '',
  unread: state.notification.unread || 0,
  shortNotification: state.notification.shortList || []
});

const mapDispatchToProps = dispatch => ({
  onUserLogout: () => dispatch({ type: APP_LOGOUT }),
  getShortNotification: () =>
    dispatch({
      type: NOTIFICATION_SHORT_LOAD,
      payload: request.notification.shortList()
    }),
  readNotification: () =>
    dispatch({
      type: NOTIFICATION_READ,
      payload: request.notification.read()
    }),
  doChangePassword: data =>
    dispatch({
      type: APP_CHANGE_PASSWORD,
      payload: request.auth.changePassword(data)
    }),
  doResetPassword: data =>
    dispatch({
      type: APP_RESET_PASSWORD,
      payload: request.auth.resetPassword(data)
    }),
  unloadNotification: () => dispatch({ type: NOTIFICATION_SHORT_UNLOAD })
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthMobile);
