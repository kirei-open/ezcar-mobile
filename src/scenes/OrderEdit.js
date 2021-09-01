import React, { Component } from 'react';
import { Container } from 'native-base';
import { Actions } from 'react-native-router-flux';
import uuidv4 from 'uuid/v4';

import OrderForm from '../containers/OrderForm';

class OrderEdit extends Component {
  constructor(props) {
    super(props);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  handleUpdate = value => {
    const { user, single } = this.props;
    if (user) {
      const embedUser = {
        ...value,
        passenger: user._id,
        division: user.division,
        company: user.company
      };

      this.props.onOrderUpdate(single._id, embedUser);
      Actions.popTo('orderdetail', {
        orderId: single._id,
        refreshScene: uuidv4()
      });
    }
  };

  render() {
    const { user, single, list } = this.props;

    return (
      <Container>
        {Object.keys(single).length > 0 && (
          <OrderForm
            onFormSubmit={this.handleUpdate}
            user={user}
            list={list}
            order={this.props.single}
          />
        )}
      </Container>
    );
  }
}

export default OrderEdit;
