import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import request from '../modules/request';
import {
  FLEET_SINGLE_LOAD,
  FLEET_UNLOAD,
  FLEET_REPORT_LIST_LOAD,
  ORDER_LIST_LOAD,
  // FLEET_POSITION_SINGLE_LOAD,
  FLEET_REPORT_UNLOAD,
  FLEET_HISTORY_LOAD,
  ORDER_UNLOAD
} from '../modules/constants/actions';

const Fleet = ({
  UiComponent,
  fleet,
  reports,
  histories,
  list,
  user,
  inProgress,
  getSingleFleet,
  getFleetReport,
  getFleetHistories,
  getFleetHistory,
  onFleetUnload,
  onFleetReportUnload,
  onFleetHistoryUnload
}) => (
  <UiComponent
    list={list}
    user={user}
    fleet={fleet}
    reports={reports}
    histories={histories}
    getSingleFleet={getSingleFleet}
    getFleetReport={getFleetReport}
    getFleetHistories={getFleetHistories}
    getFleetHistory={getFleetHistory}
    inProgress={inProgress}
    onFleetUnload={onFleetUnload}
    onFleetReportUnload={onFleetReportUnload}
    onFleetHistoryUnload={onFleetHistoryUnload}
  />
);

Fleet.propTypes = {
  UiComponent: PropTypes.func.isRequired,
  fleet: PropTypes.shape({}),
  reports: PropTypes.shape({}),
  user: PropTypes.shape({}),
  inProgress: PropTypes.bool
};

Fleet.defaultProps = {
  fleet: {},
  reports: {},
  user: null,
  inProgress: false
};

const mapStateToProps = state => ({
  list: state.fleet.list,
  fleet: state.fleet.single,
  reports: state.fleetReport.list,
  histories: state.order.list,
  // positions: state.fleetPositions.list,
  inProgress: state.fleet.inProgress,
  user: state.auth.user
});

const mapDispatchToProps = dispatch => ({
  getSingleFleet: id =>
    dispatch({ type: FLEET_SINGLE_LOAD, payload: request.fleet.get(id) }),
  getFleetReport: query =>
    dispatch({
      type: FLEET_REPORT_LIST_LOAD,
      payload: request.fleetReport.list(query)
    }),
  getFleetHistories: query =>
    dispatch({
      type: ORDER_LIST_LOAD,
      payload: request.order.list(query)
    }),
  // getFleetPositions: id =>
  //   dispatch({
  //     type: FLEET_POSITION_SINGLE_LOAD,
  //     payload: request.fleetPosition.get(id)
  //   }),
  onFleetUnload: () => dispatch({ type: FLEET_UNLOAD }),
  onFleetReportUnload: () => dispatch({ type: FLEET_REPORT_UNLOAD }),
  onFleetHistoryUnload: () => dispatch({ type: ORDER_UNLOAD }),
  getFleetHistory: query =>
    dispatch({
      type: FLEET_HISTORY_LOAD,
      payload: request.fleet.history(query)
    })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Fleet);
