import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import request from '../modules/request';
import {
  POOL_LIST_LOAD,
  POOL_UNLOAD,
  POOL_CREATE,
  POOL_REMOVE,
  POOL_UPDATE,
  POOL_SINGLE_LOAD
} from '../modules/constants/actions';

const Pool = ({
  UiComponent,
  list,
  single,
  user,
  reload,
  inProgress,
  getPoolList,
  getSinglePool,
  createPool,
  updatePool,
  removePool,
  onPoolUnload
}) => (
  <UiComponent
    user={user}
    list={list}
    single={single}
    reload={reload}
    getPoolList={getPoolList}
    getSinglePool={getSinglePool}
    createPool={createPool}
    updatePool={updatePool}
    removePool={removePool}
    inProgress={inProgress}
    onPoolUnload={onPoolUnload}
  />
);

Pool.propTypes = {
  UiComponent: PropTypes.func.isRequired,
  list: PropTypes.shape({}),
  single: PropTypes.shape({}),
  user: PropTypes.shape({}),
  inProgress: PropTypes.bool,
  reload: PropTypes.bool
};

Pool.defaultProps = {
  list: {},
  single: {},
  user: null,
  inProgress: false,
  reload: false
};

const mapStateToProps = state => ({
  list: state.pool.list,
  single: state.pool.single,
  inProgress: state.pool.inProgress,
  user: state.auth.user,
  reload: state.app.reload
});

const mapDispatchToProps = dispatch => ({
  getPoolList: query =>
    dispatch({
      type: POOL_LIST_LOAD,
      payload: request.pool.list(query)
    }),
  getSinglePool: id =>
    dispatch({ type: POOL_SINGLE_LOAD, payload: request.pool.get(id) }),
  createPool: payload =>
    dispatch({
      type: POOL_CREATE,
      payload: request.pool.create(payload)
    }),
  updatePool: (id, payload) =>
    dispatch({
      type: POOL_UPDATE,
      payload: request.pool.update(id, payload)
    }),
  removePool: id =>
    dispatch({ type: POOL_REMOVE, payload: request.pool.delete(id) }),
  onPoolUnload: () => dispatch({ type: POOL_UNLOAD })
});

export default connect(mapStateToProps, mapDispatchToProps)(Pool);
