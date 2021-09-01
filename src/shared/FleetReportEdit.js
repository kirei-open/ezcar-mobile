import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import request from '../modules/request';
import {
  FLEET_REPORT_SINGLE_LOAD,
  FLEET_REPORT_UPDATE,
  FLEET_REPORT_SINGLE_UNLOAD
} from '../modules/constants/actions';

const FleetReportEdit = ({
  UiComponent,
  token,
  user,
  single,
  reportId,
  getSingleReport,
  updateFleetReport,
  unmountSingleReport
}) => (
  <UiComponent
    token={token}
    user={user}
    single={single}
    reportId={reportId}
    updateFleetReport={updateFleetReport}
    getSingleReport={getSingleReport}
    unmountSingleReport={unmountSingleReport}
  />
);

FleetReportEdit.propTypes = {
  UiComponent: PropTypes.func.isRequired,
  user: PropTypes.shape({}),
  token: PropTypes.string.isRequired
};

FleetReportEdit.defaultProps = {
  user: null
};

const mapStateToProps = state => ({
  single: state.fleetReport.single,
  user: state.auth.user,
  token: state.app.token
});

const mapDispatchToProps = dispatch => ({
  getSingleReport: id =>
    dispatch({
      type: FLEET_REPORT_SINGLE_LOAD,
      payload: request.fleetReport.get(id)
    }),
  unmountSingleReport: () => dispatch({ type: FLEET_REPORT_SINGLE_UNLOAD }),
  updateFleetReport: (id, payload) =>
    dispatch({
      type: FLEET_REPORT_UPDATE,
      payload: request.fleetReport.update(id, payload)
    })
});

export default connect(mapStateToProps, mapDispatchToProps)(FleetReportEdit);
