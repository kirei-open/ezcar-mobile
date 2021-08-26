import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import request from '../modules/request';
import {
  USER_LIST_LOAD,
  USER_UNLOAD,
  USER_CREATE,
  USER_REMOVE,
  USER_UPDATE,
  USER_SINGLE_LOAD,
  APP_LOAD,
  ORDER_LIST_LOAD
} from '../modules/constants/actions';

const User = ({
  UiComponent,
  list,
  single,
  user,
  token,
  reload,
  orders,
  inProgress,
  getUserList,
  getSingleUser,
  createUser,
  updateUser,
  removeUser,
  onUserUnload,
  onSelfUpdate,
  getOrderHistories
}) => (
  <UiComponent
    user={user}
    list={list}
    single={single}
    reload={reload}
    orders={orders}
    getUserList={getUserList}
    getSingleUser={getSingleUser}
    createUser={createUser}
    updateUser={updateUser}
    removeUser={removeUser}
    inProgress={inProgress}
    onUserUnload={onUserUnload}
    onSelfUpdate={onSelfUpdate}
    token={token}
    getOrderHistories={getOrderHistories}
  />
);

User.propTypes = {
  UiComponent: PropTypes.func.isRequired,
  list: PropTypes.shape({}),
  single: PropTypes.shape({}),
  user: PropTypes.shape({}),
  inProgress: PropTypes.bool,
  token: PropTypes.string,
  reload: PropTypes.bool
};

User.defaultProps = {
  list: {},
  single: {},
  user: null,
  inProgress: false,
  token: null,
  reload: false
};

const mapStateToProps = state => ({
  list: state.user.list,
  single: state.user.single,
  inProgress: state.user.inProgress,
  user: state.auth.user,
  token: state.app.token,
  reload: state.app.reload,
  orders: state.order.list
});

const mapDispatchToProps = dispatch => ({
  getUserList: query =>
    dispatch({ type: USER_LIST_LOAD, payload: request.user.list(query) }),
  getSingleUser: id =>
    dispatch({ type: USER_SINGLE_LOAD, payload: request.user.get(id) }),
  createUser: payload =>
    dispatch({ type: USER_CREATE, payload: request.user.create(payload) }),
  updateUser: (id, payload) =>
    dispatch({ type: USER_UPDATE, payload: request.user.update(id, payload) }),
  removeUser: id =>
    dispatch({ type: USER_REMOVE, payload: request.user.delete(id) }),
  onSelfUpdate: token =>
    dispatch({ type: APP_LOAD, payload: request.auth.info(), token }),
  onUserUnload: () => dispatch({ type: USER_UNLOAD }),
  getOrderHistories: query =>
    dispatch({
      type: ORDER_LIST_LOAD,
      payload: request.order.list(query)
    })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(User);
