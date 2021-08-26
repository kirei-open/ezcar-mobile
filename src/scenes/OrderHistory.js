import React, { Component } from 'react';
import { Container, Header, Left, Right, Title, Body } from 'native-base';
import { View } from 'react-native';
import ListOrder from '../components/ListOrder';
import OrderListShared from '../shared/OrderList';
import BackButton from '../components/BackButton';

class OrderHistory extends Component {
  render() {
    return (
      <Container>
        <Header>
          <Left style={{ flex: 0.5 }}>
            <BackButton iconStyle={{ color: 'black' }} />
          </Left>
          <Body style={{ flex: 1 }}>
            <Title>
              Order History
            </Title>
          </Body>
          <Right style={{ flex: 0.5 }}><View></View></Right>
        </Header>
        <OrderListShared
          UiComponent={ListOrder}
          listLimit={6}
          listSort="-updatedAt"
          listCheckType="historyOrder"
        />
      </Container>
    );
  }
}

export default OrderHistory;
