import React, { Component } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
// import { MapView } from 'expo';
import MapView, { Marker } from 'react-native-maps';
import moment from 'moment';

import { listenEvent, sendEvent, removeEvent } from '../modules/socket';
import driverImage from '../../assets/rsz_marker-driver.png';
import carImage from '../../assets/marker-car.png';

const { width } = Dimensions.get('window');

// const { Marker } = MapView;

const LATITUDE = -6.1751;
const LONGITUDE = 106.865;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = 0.0421;

const style = StyleSheet.create({
  container: {
    flex: 1,
    height: 300,
    width,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  map: {
    ...StyleSheet.absoluteFillObject
  }
});

class OrderDetailMap extends Component {
  state = {
    driverPosition: {
      latitude: undefined,
      longitude: undefined
    }
  };

  componentDidMount() {
    const { driver, user } = this.props;
    if (driver && driver._id && user && user._id) {
      sendEvent('request driver position', {
        targetId: driver._id,
        userid: user._id
      });
      this._driverPositionTimer = setInterval(() => {
        sendEvent('request driver position', {
          targetId: driver._id,
          userid: user._id
        });
      }, 1000 * 10);
    }
    listenEvent('receive user position', userPosition => {
      const { position } = userPosition;
      if (position) {
        const { coordinates } = position;
        if (Array.isArray(coordinates) && coordinates.length === 2) {
          this.setState({
            driverPosition: {
              latitude: coordinates[1],
              longitude: coordinates[0]
            }
          });
        }
      }
    });
  }

  componentDidUpdate() {
    this._detailMap.fitToElements(true);
  }

  componentWillUnmount() {
    clearInterval(this._driverPositionTimer);
    removeEvent('receive user position');
  }

  render() {
    const { routes, orderID, driver, points } = this.props;
    const { driverPosition } = this.state;

    let departures = [];
    let arrivals = [];
    let lat;
    let long;
    if (routes.length > 0) {
      departures = routes.map((route, id) => ({
        id: `departure-${orderID || id}-${id}`,
        title: route.pickupAddress,
        coordinate: {
          latitude: route.pickupLocation
            ? route.pickupLocation.coordinates[1]
            : LATITUDE,
          longitude: route.pickupLocation
            ? route.pickupLocation.coordinates[0]
            : LONGITUDE
        }
      }));

      arrivals = routes.map((route, id) => ({
        id: `arrival-${orderID || id}-${id}`,
        title: route.dropAddress,
        coordinate: {
          latitude: route.dropLocation
            ? route.dropLocation.coordinates[1]
            : LATITUDE,
          longitude: route.dropLocation
            ? route.dropLocation.coordinates[0]
            : LONGITUDE
        }
      }));
    }

    let fleetPositions1 = [];
    if (points && points.length > 0) {
      fleetPositions1 = points
        .map((point, id) => ({
          id: `fleetPositions-index-${id}`,
          coordinate:
            point.latitude && point.longitude
              ? { latitude: point.latitude, longitude: point.longitude}
              : {},
          title: `${point.plateNumber}, ${point.address} ${moment(
            point.deviceTime
          ).format('DD MMMM YYYY, [pukul] HH:mm')}`
        }))
        .filter(
          p =>
            typeof p.coordinate === 'object' &&
            Object.keys(p.coordinate).length > 0
        );
    }

    const uSet = new Set(fleetPositions1);
    const fleetPositions = [...uSet];

    console.log('fleetPositions', fleetPositions);

    routes.map(item => {
      long = item.pickupLocation.coordinates[0]
      lat = item.pickupLocation.coordinates[1]
    })

    const region = {
      latitude: lat,
      longitude: long,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
    }

    return (
      <View style={style.container}>
        <MapView
          provider="google"
          style={style.map}
          region={region}
          initialRegion={{
            latitude: lat,
            longitude: long,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          }}
          ref={map => {
            this._detailMap = map;
          }}
          onMapReady={() => this._detailMap.fitToElements(false)}
        >
          {departures.length > 0 &&
            departures.map(departure => (
              <Marker
                key={departure.id}
                title={departure.title}
                coordinate={departure.coordinate}
              />
            ))}
          {arrivals.length > 0 &&
            arrivals.map(arrival => (
              <Marker
                key={arrival.id}
                title={arrival.title}
                coordinate={arrival.coordinate}
              />
            ))}
          {driverPosition.latitude && driverPosition.longitude && (
            <Marker
              key={driver._id}
              title={driver.name}
              coordinate={driverPosition}
              image={driverImage}
            />
          )}
          {fleetPositions.length > 0 &&
            fleetPositions.map(fleetPosition => (
              <Marker
                key={fleetPosition.id}
                title={fleetPosition.title}
                coordinate={fleetPosition.coordinate}
                image={carImage}
              />
            ))}
        </MapView>
      </View>
    );
  }
}

OrderDetailMap.defaultProps = {
  routes: [],
  points: [],
  orderID: '1'
};

export default OrderDetailMap;
