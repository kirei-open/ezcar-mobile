import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  NOTIFICATION_LONG_LOAD,
  NOTIFICATION_LONG_UNLOAD
} from '../modules/constants/actions';
import request from '../modules/request';

const Notification = ({
  UiComponent,
  user,
  notifications,
  onMount,
  onUnmount
}) => (
  <UiComponent
    notifications={notifications}
    user={user}
    onMount={onMount}
    onUnmount={onUnmount}
  />
);

Notification.propTypes = {
  UiComponent: PropTypes.func.isRequired,
  notifications: PropTypes.shape({}),
  user: PropTypes.shape({})
};

Notification.defaultProps = {
  notifications: {},
  user: null
};

const mapStateToProps = state => ({
  notifications: state.notification.longList,
  user: state.auth.user
});

const mapDispatchToProps = dispatch => ({
  onMount: query =>
    dispatch({
      type: NOTIFICATION_LONG_LOAD,
      payload: request.notification.longList(query)
    }),
  onUnmount: () => dispatch({ type: NOTIFICATION_LONG_UNLOAD })
});

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
