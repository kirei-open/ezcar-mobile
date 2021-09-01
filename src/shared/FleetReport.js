import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import request from '../modules/request';
import {
  FLEET_REPORT_LIST_LOAD,
  FLEET_REPORT_UNLOAD,
  FLEET_REPORT_CREATE,
  FLEET_REPORT_REMOVE,
  FLEET_REPORT_UPDATE,
  FLEET_REPORT_SINGLE_LOAD
} from '../modules/constants/actions';

const FleetReport = ({ UiComponent, ...rest }) => <UiComponent {...rest} />;

FleetReport.propTypes = {
  UiComponent: PropTypes.func.isRequired,
  list: PropTypes.shape({}),
  single: PropTypes.shape({}),
  user: PropTypes.shape({}),
  inProgress: PropTypes.bool,
  reload: PropTypes.bool,
  token: PropTypes.string
};

FleetReport.defaultProps = {
  list: {},
  single: {},
  user: null,
  inProgress: false,
  reload: false,
  token: null
};

const mapStateToProps = state => ({
  list: state.fleetReport.list,
  single: state.fleetReport.single,
  inProgress: state.fleetReport.inProgress,
  user: state.auth.user,
  reload: state.app.reload,
  token: state.app.token
});

const mapDispatchToProps = dispatch => ({
  getFleetReportList: query =>
    dispatch({
      type: FLEET_REPORT_LIST_LOAD,
      payload: request.fleetReport.list(query)
    }),
  getSingleFleetReport: id =>
    dispatch({
      type: FLEET_REPORT_SINGLE_LOAD,
      payload: request.fleetReport.get(id)
    }),
  createFleetReport: payload =>
    dispatch({
      type: FLEET_REPORT_CREATE,
      payload: request.fleetReport.create(payload)
    }),
  updateFleetReport: (id, payload) =>
    dispatch({
      type: FLEET_REPORT_UPDATE,
      payload: request.fleetReport.update(id, payload)
    }),
  removeFleetReport: id =>
    dispatch({
      type: FLEET_REPORT_REMOVE,
      payload: request.fleetReport.delete(id)
    }),
  onFleetReportUnload: () => dispatch({ type: FLEET_REPORT_UNLOAD })
});

export default connect(mapStateToProps, mapDispatchToProps)(FleetReport);
