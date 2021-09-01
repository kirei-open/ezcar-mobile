import React, { Component } from 'react';
import OrderDetailItem from '../containers/OrderDetailItem';
import OrderDetailShared from '../shared/OrderDetail';

class OrderDetail extends Component {
  render() {
    const { orderId, allOrder } = this.props;
    
    return (
      <OrderDetailShared
        UiComponent={OrderDetailItem}
        orderId={orderId}
        order={allOrder}
        {...this.props}
        reload
      />
    );
  }
}

export default OrderDetail;
