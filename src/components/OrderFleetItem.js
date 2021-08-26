import React, { PureComponent } from 'react';
import { TouchableOpacity } from 'react-native';
import { Card, CardItem, Text, Left, Body, Thumbnail } from 'native-base';
import config from '../modules/constants/config';
import UserImage from './UserImage';

export default class OrderFleetItem extends PureComponent {
  render() {
    const { single, style } = this.props;

    return (
      <Card>
        <CardItem header style={style.cardHeader}>
          <Text>Fleet Information</Text>
        </CardItem>
        <CardItem>
          <Left style={{ flex: 0.3 }}>
            <Text note style={{ marginLeft: 0 }}>
              Fleet
            </Text>
          </Left>
          <Body
            style={{ flex: 0.7, flexDirection: 'row', alignItems: 'center' }}
          >
            {single.fleet.photos &&
              single.fleet.photos[0] &&
              single.fleet.photos[0].source && (
                <Thumbnail
                  small
                  circular
                  source={{
                    uri: `${config.api}${single.fleet.photos[0].source}`
                  }}
                />
              )}
            <Text style={{ marginLeft: 6, alignSelf: 'center' }}>
              {single.fleet.plateNumber}
            </Text>
          </Body>
        </CardItem>
        <CardItem>
          <Left style={{ flex: 0.3 }}>
            <Text note style={{ marginLeft: 0 }}>
              Driver
            </Text>
          </Left>
          <Body
            style={{ flex: 0.7, flexDirection: 'row', alignItems: 'center' }}
          >
            <UserImage
              size="small"
              user={single.driver}
              mode="circle"
              styleContainer={{ marginRight: 6 }}
            />
            <TouchableOpacity
              style={{ alignSelf: 'center' }}
              onPress={() => this.props.callDriver(single.driver.profile.phone)}
            >
              <Text>{single.driver.name}</Text>
              <Text note>
                {single.driver.profile && single.driver.profile.phone
                  ? single.driver.profile.phone
                  : 'No phones found'}
              </Text>
              <Text note>
                {single.driver.profile &&
                  single.driver.profile.phone &&
                  '(Tap to call)'}
              </Text>
            </TouchableOpacity>
          </Body>
        </CardItem>
        <CardItem>
          <Left style={{ flex: 0.3 }}>
            <Text note style={{ marginLeft: 0 }}>
              Pool
            </Text>
          </Left>
          <Body style={{ flex: 0.7 }}>
            <Text>{single.pool.name}</Text>
          </Body>
        </CardItem>
      </Card>
    );
  }
}
