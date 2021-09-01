import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Dimensions, TouchableOpacity } from 'react-native';
import {
  CardItem,
  Body,
  Text,
  Left,
  Right,
  Button,
  Label,
  Item
} from 'native-base';
import uuidv1 from 'uuid/v1';

const deviceWidth = Dimensions.get('window').width;

class OrderPlace extends PureComponent {
  _renderCardItem = (item, index = 0, total = 1) => {
    const { multiplace, errors } = this.props;
    return (
      <CardItem
        key={uuidv1()}
        style={{
          flexDirection: 'column',
          alignItems: 'flex-start',
          borderTopWidth: 1,
          borderTopColor: '#c9c9c9'
        }}
      >
        {multiplace && (
          <Body style={{ flexDirection: 'row' }}>
            <Left style={{ flex: 1 }}>
              <Text>Route {index + 1}</Text>
            </Left>
            {total !== 1 && (
              <Right style={{ flex: 1 }}>
                <Button
                  bordered
                  danger
                  small
                  onPress={() => this.props.onRemovePlace(index)}
                >
                  <Text>Remove</Text>
                </Button>
              </Right>
            )}
          </Body>
        )}
        <Item
          stackedLabel
          style={{
            borderWidth: 0,
            borderColor: 'transparent'
          }}
        >
          <Label>Departure</Label>
          <TouchableOpacity
            onPress={() =>
              this.props.openModal({
                title: `Departure`,
                subtitle: `Route ${multiplace ? index + 1 : ''}`,
                name: 'pickupAddress',
                number: index,
                address: item.pickupAddress,
                latitude:
                  item.pickupLocation &&
                  item.pickupLocation.coordinates &&
                  item.pickupLocation.coordinates.length > 1
                    ? item.pickupLocation.coordinates[1]
                    : undefined,
                longitude:
                  item.pickupLocation &&
                  item.pickupLocation.coordinates &&
                  item.pickupLocation.coordinates.length > 0
                    ? item.pickupLocation.coordinates[0]
                    : undefined
              })
            }
            style={{ width: deviceWidth - 60 }}
          >
            <Text>{item.pickupAddress || 'Insert departure address'}</Text>
            {item &&
              !item.pickupAddress &&
              errors &&
              errors.routes &&
              errors.routes[index] &&
              !!errors.routes[index].pickupAddress && (
                <Text style={{ color: '#FF4E54', fontSize: 12 }}>
                  {errors.routes[index].pickupAddress[0]}
                </Text>
              )}
          </TouchableOpacity>
        </Item>
        <Item
          stackedLabel
          style={{
            borderWidth: 0,
            borderColor: 'transparent'
          }}
        >
          <Label>Arrival</Label>
          <TouchableOpacity
            onPress={() =>
              this.props.openModal({
                title: `Arrival`,
                subtitle: `Route ${multiplace ? index + 1 : ''}`,
                name: 'dropAddress',
                number: index,
                address: item.dropAddress,
                latitude:
                  item.dropLocation &&
                  item.dropLocation.coordinates &&
                  item.dropLocation.coordinates.length > 1
                    ? item.dropLocation.coordinates[1]
                    : undefined,
                longitude:
                  item.dropLocation &&
                  item.dropLocation.coordinates &&
                  item.dropLocation.coordinates.length > 0
                    ? item.dropLocation.coordinates[0]
                    : undefined
              })
            }
            style={{ width: deviceWidth - 60 }}
          >
            <Text>{item.dropAddress || 'Insert arrival address'}</Text>
            {item &&
              !item.dropAddress &&
              errors &&
              errors.routes &&
              errors.routes[index] &&
              !!errors.routes[index].dropAddress && (
                <Text style={{ color: '#FF4E54', fontSize: 12 }}>
                  {errors.routes[index].dropAddress[0]}
                </Text>
              )}
          </TouchableOpacity>
        </Item>
      </CardItem>
    );
  };

  render() {
    const { routes, multiplace } = this.props;

    return (
      <View>
        {multiplace
          ? routes.map((item, index) =>
              this._renderCardItem(item, index, routes.length)
            )
          : this._renderCardItem(routes[0])}
        {multiplace && (
          <Button
            block
            info
            style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
            onPress={() => this.props.onAddPlace()}
          >
            <Text>Add Route</Text>
          </Button>
        )}
      </View>
    );
  }
}

OrderPlace.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.shape({})),
  onRemovePlace: PropTypes.func.isRequired,
  onAddPlace: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  errors: PropTypes.shape({}),
  multiplace: PropTypes.bool
};

OrderPlace.defaultProps = {
  routes: [],
  errors: {},
  multiplace: false
};

export default OrderPlace;
