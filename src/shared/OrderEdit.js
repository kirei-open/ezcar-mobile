import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import request from '../modules/request';
import { ORDER_UPDATE } from '../modules/constants/actions';

const OrderEdit = ({ UiComponent, ...rest }) => <UiComponent {...rest} />;

OrderEdit.propTypes = {
  UiComponent: PropTypes.func.isRequired,
  orderId: PropTypes.string,
  user: PropTypes.shape({}).isRequired,
  single: PropTypes.shape({})
};

OrderEdit.defaultProps = {
  single: {},
  orderId: null
};

const mapStateToProps = state => ({
  single: state.order.single,
  user: state.auth.user
});

const mapDispatchToProps = dispatch => ({
  onOrderUpdate: (id, data) =>
    dispatch({ type: ORDER_UPDATE, payload: request.order.update(id, data) })
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderEdit);
