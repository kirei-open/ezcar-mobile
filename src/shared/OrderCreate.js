import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  ORDER_CREATE,
  ORDER_UNLOAD,
  APP_SET_LOCATION,
  USER_SEARCH
} from '../modules/constants/actions';
import request from '../modules/request';

const OrderCreate = ({
  UiComponent,
  inProgress,
  user,
  onOrderSubmit,
  onOrderUnload,
  position,
  onSearchPassenger,
  list
}) => (
  <UiComponent
    user={user}
    list={list}
    inProgress={inProgress}
    position={position}
    onOrderSubmit={onOrderSubmit}
    onOrderUnload={onOrderUnload}
    onSearchPassenger={onSearchPassenger}
  />
);

OrderCreate.propTypes = {
  UiComponent: PropTypes.func.isRequired,
  inProgress: PropTypes.bool,
  user: PropTypes.shape({}),
  list: PropTypes.shape({}),
};

OrderCreate.defaultProps = {
  inProgress: false,
  user: null,
  list: null
};

const mapStateToProps = state => ({
  inProgress: state.order.inProgress,
  user: state.auth.user,
  routes: state.order.routes,
  position: state.app.location,
  list: state.user.list
});

const mapDispatchToProps = dispatch => ({
  onOrderSubmit: data =>
    dispatch({ type: ORDER_CREATE, payload: request.order.create(data) }),
  onOrderUnload: () => dispatch({ type: ORDER_UNLOAD }),
  setLocation: payload => dispatch({ type: APP_SET_LOCATION, payload }),
  onSearchPassenger: query =>
    dispatch({ type: USER_SEARCH, payload: request.user.search(query) })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderCreate);
