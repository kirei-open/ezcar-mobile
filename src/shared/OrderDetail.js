import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import request from '../modules/request';
import {
  ORDER_SINGLE_LOAD,
  ORDER_UPDATE,
  ORDER_UNLOAD,
  ORDER_SINGLE_UNLOAD,
  ORDER_COMMAND,
  APP_SET_LOCATION
} from '../modules/constants/actions';

const OrderDetail = ({ UiComponent, ...rest }) => <UiComponent {...rest} />;

OrderDetail.propTypes = {
  UiComponent: PropTypes.func.isRequired,
  orderId: PropTypes.string,
  user: PropTypes.shape({}).isRequired,
  single: PropTypes.shape({}),
  reload: PropTypes.bool.isRequired,
  inProgress: PropTypes.bool.isRequired
};

OrderDetail.defaultProps = {
  single: {},
  orderId: null
};

const mapStateToProps = state => ({
  single: state.order.single,
  user: state.auth.user,
  reload: state.app.reload,
  inProgress: state.order.inProgress,
  position: state.app.location
});

const mapDispatchToProps = dispatch => ({
  getOrderDetail: id =>
    dispatch({ type: ORDER_SINGLE_LOAD, payload: request.order.get(id) }),
  onOrderUpdate: (id, data) =>
    dispatch({ type: ORDER_UPDATE, payload: request.order.update(id, data) }),
  onDetailUnload: () => dispatch({ type: ORDER_UNLOAD }),
  onSingleUnload: () => dispatch({ type: ORDER_SINGLE_UNLOAD }),
  sendCommand: (command, id, payload) =>
    dispatch({
      type: ORDER_COMMAND,
      payload: request.order.command(command, id, payload)
    }),
  setLocation: payload => dispatch({ type: APP_SET_LOCATION, payload })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderDetail);
