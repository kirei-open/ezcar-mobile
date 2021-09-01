import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ORDER_SUMMARY, ORDER_UNLOAD } from '../modules/constants/actions';
import request from '../modules/request';

const OrderOverview = ({
  UiComponent,
  user,
  summaries,
  getOrderSummaries,
  onOrderUnload
}) => (
  <UiComponent
    summaries={summaries}
    user={user}
    getOrderSummaries={getOrderSummaries}
    onOrderUnload={onOrderUnload}
  />
);

OrderOverview.propTypes = {
  UiComponent: PropTypes.func.isRequired,
  summaries: PropTypes.shape({}),
  user: PropTypes.shape().isRequired
};

OrderOverview.defaultProps = {
  summaries: {}
};

const mapStateToProps = state => ({
  summaries: state.order.summaries,
  user: state.auth.user
});

const mapDispatchToProps = dispatch => ({
  getOrderSummaries: query =>
    dispatch({ type: ORDER_SUMMARY, payload: request.order.summary(query) }),
  onOrderUnload: () => dispatch({ type: ORDER_UNLOAD })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderOverview);
