import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import request from '../modules/request';
import { FLEET_REPORT_CREATE } from '../modules/constants/actions';

const FleetReportCreate = ({ UiComponent, token, user, createFleetReport }) => (
  <UiComponent
    token={token}
    user={user}
    createFleetReport={createFleetReport}
  />
);

FleetReportCreate.propTypes = {
  UiComponent: PropTypes.func.isRequired,
  user: PropTypes.shape({}),
  token: PropTypes.string.isRequired
};

FleetReportCreate.defaultProps = {
  user: null
};

const mapStateToProps = state => ({
  user: state.auth.user,
  token: state.app.token
});

const mapDispatchToProps = dispatch => ({
  createFleetReport: payload =>
    dispatch({
      type: FLEET_REPORT_CREATE,
      payload: request.fleetReport.create(payload)
    })
});

export default connect(mapStateToProps, mapDispatchToProps)(FleetReportCreate);
