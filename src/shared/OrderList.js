import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ORDER_LIST_LOAD, ORDER_UNLOAD } from '../modules/constants/actions';
import request from '../modules/request';

const OrderList = ({
  UiComponent,
  list,
  user,
  getOrderList,
  onOrderListUnload,
  ...rest
}) => (
  <UiComponent
    user={user}
    list={list}
    getOrderList={getOrderList}
    onOrderListUnload={onOrderListUnload}
    {...rest}
  />
);

OrderList.propTypes = {
  UiComponent: PropTypes.func.isRequired,
  list: PropTypes.shape({}),
  user: PropTypes.shape({})
};

OrderList.defaultProps = {
  list: {},
  user: null
};

const mapStateToProps = state => ({
  list: state.order.list,
  user: state.auth.user
});

const mapDispatchToProps = dispatch => ({
  getOrderList: query =>
    dispatch({ type: ORDER_LIST_LOAD, payload: request.order.list(query) }),
  onOrderListUnload: () => dispatch({ type: ORDER_UNLOAD })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderList);
