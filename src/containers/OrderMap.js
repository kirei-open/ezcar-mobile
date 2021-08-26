import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Dimensions } from 'react-native';
// import {MapView} from 'expo';
import MapView, {Marker} from 'react-native-maps';
import isEqual from 'lodash';

const { height, width } = Dimensions.get('window');

const LATITUDE = -6.1751;
const LONGITUDE = 106.865;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = 0.0421;

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

class OrderMap extends Component {
  shouldComponentUpdate(nextProps) {
    const changeCoordinates = isEqual(
      nextProps.coordinates,
      this.props.coordinates
    );
    const changeDescription = nextProps.description !== this.props.description;

    return changeCoordinates || changeDescription;
  }

  componentWillUpdate() {
    if (this._orderMarker) {
      this._orderMarker.hideCallout();
    }
  }

  componentDidUpdate() {
    this._map.fitToElements(true);
    if (this._orderMarker) {
      this._orderMarker.showCallout();
    }
  }

  onDragMarker = ({ coordinate }) => {
    const { latitude, longitude } = coordinate;
    this.props.onDragMarker(latitude, longitude);
  };

  render() {
    const { map, description, coordinates } = this.props;
    // console.log(map)

    return (
      <View style={style.container}>
        <MapView
          provider="google"
          style={style.map}
          region={map}
          initialRegion={{
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          }}
          rotateEnabled={false}
          ref={map => {
            this._map = map;
          }}
          onLayout={() => {
            this._map.fitToElements(false);
            if (this._orderMarker) {
              this._orderMarker.showCallout();
            }
          }}
        >
          {coordinates &&
            coordinates.length > 0 &&
            description && (
              <Marker
                title="USE THIS LOCATION"
                description={description}
                coordinate={{
                  latitude: coordinates[1],
                  longitude: coordinates[0]
                }}
                draggable
                onDrag={() => this._orderMarker.hideCallout()}
                onDragEnd={e => this.onDragMarker(e.nativeEvent)}
                onCalloutPress={() => this.props.onPlaceSelected()}
                onPress={() => this.props.onPlaceSelected()}
                ref={mapMarker => {
                  this._orderMarker = mapMarker;
                }}
              />
            )}
        </MapView>
      </View>
    );
  }
}

OrderMap.propTypes = {
  onPlaceSelected: PropTypes.func.isRequired,
  coordinates: PropTypes.arrayOf(PropTypes.number),
  description: PropTypes.string,
  onDragMarker: PropTypes.func.isRequired
};

OrderMap.defaultProps = {
  coordinates: [],
  description: ''
};

export default OrderMap;
