import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import request from '../modules/request';
import {
  DIVISION_LIST_LOAD,
  DIVISION_UNLOAD,
  DIVISION_CREATE,
  DIVISION_REMOVE,
  DIVISION_UPDATE,
  DIVISION_SINGLE_LOAD
} from '../modules/constants/actions';

const Division = ({
  UiComponent,
  list,
  single,
  user,
  inProgress,
  reload,
  getDivisionList,
  getSingleDivision,
  createDivision,
  updateDivision,
  removeDivision,
  onDivisionUnload
}) => (
  <UiComponent
    user={user}
    list={list}
    single={single}
    reload={reload}
    getDivisionList={getDivisionList}
    getSingleDivision={getSingleDivision}
    createDivision={createDivision}
    updateDivision={updateDivision}
    removeDivision={removeDivision}
    inProgress={inProgress}
    onDivisionUnload={onDivisionUnload}
  />
);

Division.propTypes = {
  UiComponent: PropTypes.func.isRequired,
  list: PropTypes.shape({}),
  single: PropTypes.shape({}),
  user: PropTypes.shape({}),
  inProgress: PropTypes.bool,
  reload: PropTypes.bool
};

Division.defaultProps = {
  list: {},
  single: {},
  user: null,
  inProgress: false,
  reload: false
};

const mapStateToProps = state => ({
  list: state.division.list,
  single: state.division.single,
  inProgress: state.division.inProgress,
  user: state.auth.user,
  reload: state.app.reload
});

const mapDispatchToProps = dispatch => ({
  getDivisionList: query =>
    dispatch({
      type: DIVISION_LIST_LOAD,
      payload: request.division.list(query)
    }),
  getSingleDivision: id =>
    dispatch({ type: DIVISION_SINGLE_LOAD, payload: request.division.get(id) }),
  createDivision: payload =>
    dispatch({
      type: DIVISION_CREATE,
      payload: request.division.create(payload)
    }),
  updateDivision: (id, payload) =>
    dispatch({
      type: DIVISION_UPDATE,
      payload: request.division.update(id, payload)
    }),
  removeDivision: id =>
    dispatch({ type: DIVISION_REMOVE, payload: request.division.delete(id) }),
  onDivisionUnload: () => dispatch({ type: DIVISION_UNLOAD })
});

export default connect(mapStateToProps, mapDispatchToProps)(Division);
