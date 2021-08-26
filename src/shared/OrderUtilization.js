import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  ORDER_SUMMARY,
  ORDER_UNLOAD,
  ORDER_LIST_LOAD,
  ORDER_UTILIZATION_LOAD,
  ORDER_UTILIZATION_UNLOAD,
  FLEET_HISTORY_LOAD,
  APP_SET_LOCATION
} from '../modules/constants/actions';
import request from '../modules/request';

const OrderUtilization = ({
  UiComponent,
  user,
  summaries,
  list,
  utilization,
  histories,
  getOrderList,
  getOrderSummaries,
  getOrderUtilization,
  getFleetHistories,
  onOrderUnload,
  ...rest
}) => (
  <UiComponent
    summaries={summaries}
    user={user}
    list={list}
    utilization={utilization}
    histories={histories}
    getOrderList={getOrderList}
    getOrderSummaries={getOrderSummaries}
    getOrderUtilization={getOrderUtilization}
    getFleetHistories={getFleetHistories}
    onOrderUnload={onOrderUnload}
    {...rest}
  />
);

OrderUtilization.propTypes = {
  UiComponent: PropTypes.func.isRequired,
  summaries: PropTypes.shape({}),
  user: PropTypes.shape().isRequired,
  list: PropTypes.shape({}),
  utilization: PropTypes.shape({}),
  histories: PropTypes.shape([])
};

OrderUtilization.defaultProps = {
  summaries: {},
  list: {},
  utilization: {},
  histories: []
};

const mapStateToProps = state => ({
  summaries: state.order.summaries,
  user: state.auth.user,
  list: state.order.list,
  utilization: state.order.utilization,
  histories: state.order.histories,
  position: state.app.location
});

const mapDispatchToProps = dispatch => ({
  getOrderSummaries: query =>
    dispatch({ type: ORDER_SUMMARY, payload: request.order.summary(query) }),
  onOrderUnload: () => dispatch({ type: ORDER_UNLOAD }),
  getOrderList: query =>
    dispatch({ type: ORDER_LIST_LOAD, payload: request.order.list(query) }),
  onOrderListUnload: () => dispatch({ type: ORDER_UNLOAD }),
  getOrderUtilization: query =>
    dispatch({
      type: ORDER_UTILIZATION_LOAD,
      payload: request.order.utilization(query)
    }),
  getFleetHistory: query =>
    dispatch({
      type: FLEET_HISTORY_LOAD,
      payload: request.fleet.history(query)
    }),
  onOrderUtilizationUnload: () => dispatch({ type: ORDER_UNLOAD }),
  setLocation: payload => dispatch({ type: APP_SET_LOCATION, payload })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderUtilization);
