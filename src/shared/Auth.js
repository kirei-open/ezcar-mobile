import React from 'react';
import PropTypes from 'prop-types';
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

class Auth extends React.Component {
  static propTypes = {
    UiComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element])
      .isRequired,
    user: PropTypes.shape({}).isRequired,
    status: PropTypes.string.isRequired,
    unread: PropTypes.number.isRequired,
    shortNotification: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    getShortNotification: PropTypes.func.isRequired,
    readNotification: PropTypes.func.isRequired,
    unloadNotification: PropTypes.func.isRequired,
    onUserLogout: PropTypes.func.isRequired,
    doChangePassword: PropTypes.func.isRequired,
    doResetPassword: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.props.getShortNotification();
  }

  componentWillUnmount() {
    this.props.unloadNotification();
  }

  render() {
    const {
      UiComponent,
      user,
      token,
      status,
      unread,
      onUserLogout,
      shortNotification,
      readNotification,
      doChangePassword,
      doResetPassword
    } = this.props;

    return (
      <UiComponent
        user={user}
        token={token}
        unread={unread}
        status={status}
        shortNotification={shortNotification}
        readNotification={readNotification}
        onUserLogout={onUserLogout}
        doChangePassword={doChangePassword}
        doResetPassword={doResetPassword}
      />
    );
  }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
