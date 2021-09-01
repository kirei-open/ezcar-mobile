import React, { PureComponent } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
// import { MapView } from 'expo';

const { width } = Dimensions.get('window');
// const { Marker } = MapView;

const LATITUDE = -6.1751;
const LONGITUDE = 106.865;
const LATITUDE_DELTA = 50; // 0.0922;
const LONGITUDE_DELTA = 50; // 0.0421;

const style = StyleSheet.create({
  container: {
    flex: 1,
    height: 200,
    width: width - 24,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  map: {
    ...StyleSheet.absoluteFillObject
  }
});

class AccidentMap extends PureComponent {
  render() {
    const { location, title } = this.props;

    return (
      <View style={style.container}>
        {/* <MapView
          provider="google"
          style={style.map}
          initialRegion={{
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          }}
          ref={map => {
            this._accidentMap = map;
          }}
          onMapReady={() => this._accidentMap.fitToElements(false)}
        >
          {location &&
            location.coordinates && (
              <Marker
                title={title}
                coordinate={{
                  latitude: location.coordinates[1],
                  longitude: location.coordinates[0]
                }}
              />
            )}
        </MapView> */}
      </View>
    );
  }
}

export default AccidentMap;
