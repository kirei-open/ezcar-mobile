import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Container,
  Content,
  Left,
  Body,
  Right,
  Card,
  CardItem,
  Text,
  Spinner,
  Button,
  Header,
  Title,
  Subtitle,
  Icon
} from 'native-base';
import moment from 'moment';

import utils from '../modules/utils';
import navigationStyle from '../constants/navigation';
import BackButton from '../components/BackButton';
import OrderDetailMap from '../containers/OrderDetailMap';

const style = StyleSheet.create({
  cardHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#c9c9c9'
  }
});

class FleetMovement extends PureComponent {
  componentWillMount() {
    this.loadFleetHistory();
  }

  loadFleetHistory() {
    const { order } = this.props;
    const query = {};
    query.deviceId = order && order.fleet && order.fleet.traccarId;
    query.from = moment(order.pickupTime).toISOString();
    query.to = order.actualDropTime
      ? moment(order.actualDropTime).toISOString()
      : moment().toISOString();

    this.props.getFleetHistory({
      q: utils.jsonToQueryString(query)
    });
  }

  render() {
    const { order, histories, user } = this.props;

    let prevAddr = null;
    const fleetHistories =
      histories && histories.length
        ? histories
            .map((item, key) => {
              if (!item.address) {
                if (histories[key - 1]) {
                  prevAddr = histories[key - 1].address;
                }

                if (prevAddr) {
                  histories[key].address = prevAddr;
                  return item;
                }
                return null;
              }
              item.plateNumber =
                order && order.fleet && order.fleet.plateNumber
                  ? order.fleet.plateNumber
                  : '-';
              item.title = `${moment(item.deviceTime).format(
                'DD MMMM YYYY, [pukul] HH:mm'
              )}. ${item.address}`;
              return item;
            })
            .filter(item => item)
        : [];

    // console.log('fleetHistories', fleetHistories);
    console.log(order)

    return (
      <Container>
        <Header style={navigationStyle.navbarProps.navigationBarStyle}>
          <Left style={{ flex: 0 }}>
            <BackButton iconStyle={{ color: 'black' }} />
          </Left>
          <Body style={{ flex: 1 }}>
            <Title style={navigationStyle.navbarProps.titleStyle}>
              Fleet History Position
            </Title>
            <Subtitle>
              {`Order ${order.item.changePickupTime} by ${order.item.passenger.name}`}
            </Subtitle>
          </Body>
        </Header>
        {Object.keys(order).length > 0 ? (
          <>
            <OrderDetailMap
              orderID={order.item._id}
              routes={order.item.routes}
              driver={order.driver}
              points={fleetHistories}
              user={user}
            />
            <View style={{ flex: 1, padding: 12 }}>
              <Card>
                <CardItem header style={style.cardHeader}>
                  <Body>
                    <Text style={{ fontWeight: '600' }}>Planned</Text>
                  </Body>
                </CardItem>
                <CardItem>
                  <Body>
                    <Text>From</Text>
                    <Text note>{order && order.item.changePickupTime}</Text>
                    <Text>To</Text>
                    <Text note>{order && order.item.changeDropTime}</Text>
                  </Body>
                </CardItem>
              </Card>
              <Card>
                <CardItem header style={style.cardHeader}>
                  <Body>
                    <Text style={{ fontWeight: '600' }}>Actual</Text>
                  </Body>
                </CardItem>
                <CardItem>
                  <Body>
                    <Text>From</Text>
                    <Text note>
                      {order &&
                        order.item.actualPickupTime &&
                        moment(order.item.actualPickupTime).format(
                          'DD MMMM YYYY, [pukul] HH:mm'
                        )}
                    </Text>
                    <Text>To</Text>
                    <Text note>
                      {order &&
                        order.item.actualDropTime &&
                        moment(order.item.actualDropTime).format(
                          'DD MMMM YYYY, [pukul] HH:mm'
                        )}
                    </Text>
                  </Body>
                </CardItem>
              </Card>
            </View>
          </>
        ) : (
          <Spinner />
        )}
      </Container>
    );
  }
}

export default FleetMovement;
