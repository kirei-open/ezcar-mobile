import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import request from '../modules/request';
import {
  FLEET_LIST_LOAD,
  FLEET_UNLOAD,
  FLEET_CREATE,
  FLEET_REMOVE,
  FLEET_ANALYSIS,
  FLEET_ANALYSIS1,
  FLEET_UTILIZATION,
  FLEET_ANALYSIS_DETAIL,
  FLEET_UPDATE,
  FLEET_SINGLE_LOAD
} from '../modules/constants/actions';

const Fleet = ({
  UiComponent,
  list,
  single,
  user,
  token,
  analysis,
  utilization,
  reload,
  inProgress,
  getFleetList,
  getSingleFleet,
  createFleet,
  updateFleet,
  removeFleet,
  getFleetAnalysis,
  getFleetAnalysis1,
  onFleetUnload,
  ...rest
}) => (
  <UiComponent
    user={user}
    list={list}
    single={single}
    token={token}
    reload={reload}
    analysis={analysis}
    utilization={utilization}
    getFleetList={getFleetList}
    getSingleFleet={getSingleFleet}
    createFleet={createFleet}
    updateFleet={updateFleet}
    removeFleet={removeFleet}
    getFleetAnalysis={getFleetAnalysis}
    getFleetAnalysis1={getFleetAnalysis1}
    inProgress={inProgress}
    onFleetUnload={onFleetUnload}
    {...rest}
  />
);

Fleet.propTypes = {
  UiComponent: PropTypes.func.isRequired,
  list: PropTypes.shape({}),
  single: PropTypes.shape({}),
  user: PropTypes.shape({}),
  analysis: PropTypes.shape({}),
  utilization: PropTypes.shape({}),
  inProgress: PropTypes.bool,
  reload: PropTypes.bool,
  token: PropTypes.string
};

Fleet.defaultProps = {
  list: {},
  single: {},
  user: null,
  analysis: {},
  utilization: {},
  inProgress: false,
  reload: false,
  token: ''
};

const mapStateToProps = state => ({
  list: state.fleet.list,
  single: state.fleet.single,
  inProgress: state.fleet.inProgress,
  user: state.auth.user,
  reload: state.app.reload,
  token: state.app.token,
  analysis: state.fleet.analysis,
  utilization: state.fleet.utilization
});

const mapDispatchToProps = dispatch => ({
  getFleetList: query =>
    dispatch({
      type: FLEET_LIST_LOAD,
      payload: request.fleet.list(query)
    }),
  getSingleFleet: id =>
    dispatch({ type: FLEET_SINGLE_LOAD, payload: request.fleet.get(id) }),
  createFleet: payload =>
    dispatch({
      type: FLEET_CREATE,
      payload: request.fleet.create(payload)
    }),
  updateFleet: (id, payload) =>
    dispatch({
      type: FLEET_UPDATE,
      payload: request.fleet.update(id, payload)
    }),
  removeFleet: id =>
    dispatch({ type: FLEET_REMOVE, payload: request.fleet.delete(id) }),
  getFleetAnalysis: query =>
    dispatch({ type: FLEET_ANALYSIS, payload: request.fleet.analysis(query) }),
  getFleetAnalysis1: query =>
    dispatch({
      type: FLEET_ANALYSIS1,
      payload: request.fleet.analysis1(query)
    }),
  getFleetUtilization: query =>
    dispatch({
      type: FLEET_UTILIZATION,
      payload: request.fleet.utilization(query)
    }),
  getFleetAnalysisDetail: query =>
    dispatch({
      type: FLEET_ANALYSIS_DETAIL,
      payload: request.fleet.analysis_detail(query)
    }),
  onFleetUnload: () => dispatch({ type: FLEET_UNLOAD })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Fleet);
