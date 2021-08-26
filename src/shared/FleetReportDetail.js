import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import request from '../modules/request';
import {
  FLEET_REPORT_SINGLE_LOAD,
  FLEET_REPORT_SINGLE_UNLOAD
} from '../modules/constants/actions';

const FleetReportDetail = ({ UiComponent, ...rest }) => (
  <UiComponent {...rest} />
);

FleetReportDetail.propTypes = {
  UiComponent: PropTypes.func.isRequired,
  reportId: PropTypes.string,
  single: PropTypes.shape({}),
  user: PropTypes.shape({}),
  token: PropTypes.string.isRequired
};

FleetReportDetail.defaultProps = {
  reportId: '',
  single: {},
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
  unmountSingleReport: () => dispatch({ type: FLEET_REPORT_SINGLE_UNLOAD })
});

export default connect(mapStateToProps, mapDispatchToProps)(FleetReportDetail);
