import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  APP_LOGIN,
  APP_LOGIN_UNLOAD,
  APP_LOGIN_SSO
} from '../modules/constants/actions';
import request from '../modules/request';

const Login = ({
  UiComponent,
  token,
  user,
  inProgress,
  status,
  loaded,
  message,
  onLoginSubmit,
  onLoginUnload,
  onLoginSSO
}) => (
  <UiComponent
    inProgress={inProgress}
    status={status}
    token={token}
    user={user}
    loaded={loaded}
    message={message}
    onLoginSubmit={onLoginSubmit}
    onLoginUnload={onLoginUnload}
    onLoginSSO={onLoginSSO}
  />
);

Login.propTypes = {
  UiComponent: PropTypes.func.isRequired,
  inProgress: PropTypes.bool.isRequired,
  token: PropTypes.string,
  user: PropTypes.shape({}),
  status: PropTypes.string,
  message: PropTypes.string,
  loaded: PropTypes.bool
};

Login.defaultProps = {
  status: null,
  message: null,
  token: null,
  user: null,
  loaded: false
};

const mapStateToProps = state => ({
  inProgress: state.auth.inProgress,
  status: state.app.status,
  message: state.app.message,
  token: state.app.token,
  user: state.auth.user,
  loaded: state.auth.loaded
});

const mapDispatchToProps = dispatch => ({
  onLoginSubmit: (identity, password) =>
    dispatch({
      type: APP_LOGIN,
      payload: request.auth.login(identity, password)
    }),
  onLoginUnload: () => dispatch({ type: APP_LOGIN_UNLOAD }),
  onLoginSSO: (clientKey, email, ssoToken) =>
    dispatch({
      type: APP_LOGIN_SSO,
      payload: request.auth.loginSSO(clientKey, email, ssoToken)
    })
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);