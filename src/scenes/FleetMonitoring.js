import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Button, Container, Icon, Body, Header, Title, Left, Right } from 'native-base';
import MapView, { Marker } from 'react-native-maps';
import uuidv1 from 'uuid/v1';
import BackButton from '../components/BackButton';
import FilterMonitoring from '../components/FilterMonitoring';
// import L from 'leaflet';
import { sendEvent, listenEvent, removeEvent } from '../modules/socket';
import io from 'socket.io-client';

import markerCarAvailable from '../../assets/marker-car-green.png';
import markerCar from '../../assets/marker-car.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height, width } = Dimensions.get('window');

const LATITUDE = -6.1751;
const LONGITUDE = 106.865;
const LATITUDE_DELTA = 50; // 0.0922;
const LONGITUDE_DELTA = 50; // 0.0421;

const style = StyleSheet.create({
  container: {
    flex: 1,
    height,
    width,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  plainCallout: {
    width: 200,
    backgroundColor: '#ffffff',
    paddingTop: 6,
    borderRadius: 10
  },
  plainText: {
    paddingTop: 6
  }
});

/* eslint class-methods-use-this: ["error", { "exceptMethods": ["regionFrom"] }] */
class FleetMonitoring extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fleetPositions: [],
      user: '',
      token: '',
    };

    this.homeTimer1 = null;

    this.getFleetPositionsById = this.getFleetPositionsById.bind(this);
    this.regionFrom = this.regionFrom.bind(this);
  }

  async getUser() {
    const token = await AsyncStorage.getItem("token")
    const data = await AsyncStorage.getItem("user");
    const user = JSON.parse(data);
    this.setState({ user, token })
  }

  componentDidMount() {
    this.getUser();
    Actions.refresh({
      albumButton: this.renderAlbumButton()
    });
    listenEvent('receive positions', fleetPositions => {
      if (fleetPositions) {
        this.setState({ fleetPositions });
      }
      Actions.refresh({ title: `Fleet Monitoring (${fleetPositions.length})` });
    });
  }

  componentWillUnmount() {
    clearInterval(this.homeTimer1);
    // removeEvent('receive positions');
    this.props.onFleetUnload();
  }

  getFleetPositionsById(fleetIds) {
    const { user } = this.state;

    clearInterval(this.homeTimer1);

    sendEvent('request positions by ids', {
      ids: fleetIds,
      user
    });

    this.homeTimer1 = setInterval(() => {
      sendEvent('request positions by ids', {
        ids: fleetIds,
        user
      });
    }, 1000 * 30);
  }

  regionFrom(lat, lon, dist) {
    const distance = dist / 2;
    const circumference = 40075;
    const oneDegreeOfLatitudeInMeters = 111.32 * 1000;
    const angularDistance = distance / circumference;

    const latitudeDelta = distance / oneDegreeOfLatitudeInMeters;
    const longitudeDelta = Math.abs(
      Math.atan2(
        Math.sin(angularDistance) * Math.cos(lat),
        Math.cos(angularDistance) - Math.sin(lat) * Math.sin(lat)
      )
    );

    return {
      latitude: lat,
      longitude: lon,
      latitudeDelta,
      longitudeDelta
    };
  }

  submitFilter() {
    console.log('test');
  }

  renderAlbumButton(checkeds) {
    return (
      <Button
        transparent
        onPress={() => {
          Actions.fleetmonitorfiltering({
            checkeds,
            onSubmit: this.getFleetPositionsById
          });
        }}
      >
        <Icon name="car" style={{ color: 'black' }} />
      </Button>
    );
  }

  render() {
    const { fleetPositions } = this.state;

    const latitude = LATITUDE; // -3.8827393;
    const longitude = LONGITUDE; // 108.3488289;

    return (
      <Container>
        <Header>
          <Left style={{ flex: 0.5 }}>
            <BackButton iconStyle={{ color: 'black' }} />
          </Left>
          <Body style={{ flex: 1 }}>
            <Title>
              Fleet Monitoring
            </Title>
          </Body>
          <Right style={{ flex: 0.5 }}>{this.renderAlbumButton()}</Right>
        </Header>
        <View style={style.container}>
          <MapView
            provider="google"
            region={{
              latitude,
              longitude
            }}
            initialRegion={{
              latitude,
              longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA
            }}
            style={style.map}
            rotateEnabled={false}
            ref={map => {
              this._map = map;
            }}
            onLayout={() => {
              // this._map.fitToElements(false);
              if (this._orderMarker) {
                this._orderMarker.showCallout();
              }
            }}
          >
            {fleetPositions &&
              fleetPositions.length > 0 &&
              fleetPositions.map(item => (
                <Marker
                  key={uuidv1()}
                  title={item.fleet.plateNumber}
                  description={item.status}
                  coordinate={{
                    latitude: item.position.coordinates[1],
                    longitude: item.position.coordinates[0]
                  }}
                  image={
                    item.deviceStatus && item.deviceStatus === 'online'
                      ? markerCarAvailable
                      : markerCar
                  }
                  rotation={item.course}
                  onPress={() => {}}
                  ref={mapMarker => {
                    this._orderMarker = mapMarker;
                  }}
                >
                  {/* <carIconAvailable /> */}
                </Marker>
              ))}
          </MapView>
        </View>
      </Container>
    );
  }
}

export default FleetMonitoring;