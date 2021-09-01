import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { View, Modal, SafeAreaView, ScrollView } from 'react-native';
import { Content, Button, Icon, Text, Container, Header, Body, Title, Subtitle, Left, Right } from 'native-base';
import { Permissions, Location } from 'expo';
import qs from 'query-string';

// import Layout from '../components/Layout';
import OrderMap from './OrderMap';
import config from '../modules/constants/config';

const initialState = {
  address: undefined,
  latitude: undefined,
  longitude: undefined
};

const style = {
  textInputContainer: {
    backgroundColor: 'rgba(0,0,0,0)',
    borderTopWidth: 0,
    borderBottomWidth: 0
  },
  textInput: {
    marginLeft: 0,
    marginRight: 0,
    height: 38,
    color: '#5d5d5d',
    fontSize: 16
  },
  predefinedPlacesDescription: {
    color: '#1faadb'
  }
};

class OrderPlaceModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...initialState,
      address: props.address,
      latitude: props.latitude,
      longitude: props.longitude,
      current: {
        latitude: undefined,
        longitude: undefined,
        address: undefined
      }
    };

    this.handleRemoveText = this.handleRemoveText.bind(this);
  }

  componentWillMount() {
    this._getCurrentLocation();
  }

  onRegionChange(description, region, latitude, longitude) {
    this.setState({
      mapRegion: region,
      latitude: latitude,
      longitude: longitude,
      address: description
    })
  }

  selectedPlace = (data, details) => {
    const { description } = data;
    const { geometry } = details;
    const { location } = geometry;
    const { lat, lng } = location;

    this.setState({
      address: description,
      latitude: lat,
      longitude: lng
    });

    this.handleRemoveText();
  };

  sendBackPlace = () => {
    const { number, name } = this.props;
    const { address, latitude, longitude } = this.state;
    const result = {
      address: address || this.props.address,
      latitude: latitude || this.props.latitude,
      longitude: longitude || this.props.longitude,
      name,
      number
    };
    this.props.retrieveValue(result);
    this.resetAndClose();
  };

  resetAndClose = () => {
    this.setState(initialState, () => {
      this.props.closeModal();
    });
  };

  handleRemoveText() {
    this._autocomplete.setAddressText('');
  }

  _getCurrentLocation = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true
      });
      const { coords } = currentLocation;

      const url = 'https://maps.googleapis.com/maps/api/geocode/json?';
      const params = qs.stringify({
        latlng: `${coords.latitude},${coords.longitude}`,
        key: config.googleApiMobile
      });
      const foundAddress = await fetch(`${url}${params}`).then(response =>
        response.json()
      );
      const { results } = foundAddress;
      if (Array.isArray(results) && results.length > 0) {
        const { formatted_address: address } = results[0];
        this.setState({
          current: {
            latitude: coords.latitude,
            longitude: coords.longitude,
            address
          }
        });
      }
    } catch (error) {
      console.warn(error);
    }
  };

  handleDragMarker = async (latitude, longitude) => {
    try {
      const url = 'https://maps.googleapis.com/maps/api/geocode/json?';
      const params = qs.stringify({
        latlng: `${latitude},${longitude}`,
        key: config.googleApiMobile
      });
      const foundAddress = await fetch(`${url}${params}`).then(response =>
        response.json()
      );
      if (foundAddress) {
        const { results } = foundAddress;
        if (Array.isArray(results) && results.length > 0) {
          const { formatted_address: address } = results[0];
          this.setState({
            address,
            latitude,
            longitude
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useCurrentLocation = () => {
    const { current, address } = this.state;
    const { address: curAddr, longitude: curLong, latitude: curLat } = current;

    if (address !== curAddr) {
      this.setState({
        address: curAddr,
        longitude: curLong,
        latitude: curLat
      });
    }
  };

  render() {
    const {
      enableSegment,
      enableTab,
      title,
      subtitle,
      showModal,
      address,
      // latitude,
      // longitude
    } = this.props;

    const { mapRegion, longitude, latitude } = this.state

    let previousPlace = null;
    let coordinates = [];

    if (address) {
      previousPlace = {
        description: address,
        geometry: {
          location: {
            lat: latitude,
            lng: longitude
          }
        }
      };
    }

    if (latitude && longitude) {
      coordinates = [longitude, latitude];
    }

    if (this.state.latitude && this.state.longitude) {
      coordinates = [this.state.longitude, this.state.latitude];
    }

    const predefinedLocation = [];
    if (previousPlace) {
      predefinedLocation.unshift(previousPlace);
    }

    // console.log(title)

    return (
      // <View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={showModal}
          onRequestClose={() => this.resetAndClose()}
        >
          {/* <Layout
            enableHeader
            title={title}
            subtitle={subtitle}
            LeftComponent={
              <Button
                large
                transparent
                dark
                onPress={() => this.resetAndClose()}
              >
                <Icon name="ios-arrow-back" />
              </Button>
            }
            RightComponent={<Text />}
          > */}
            {/* <Content> */}
            {/* <View> */}
                
              <ScrollView keyboardShouldPersistTaps="handled">
              <Header hasTabs={enableTab} hasSegment={enableSegment}>
                  <Left>
                    <Button transparent  dark onPress={() => this.resetAndClose()}>
                      <Icon name='ios-arrow-back' type='Ionicons' style={{fontSize: 30}} />
                    </Button>
                  </Left>
                <Body>
                  <Title style={{paddingLeft: 60}}>{title}</Title>
                  {subtitle && (
                    <Subtitle
                      adjustsFontSizeToFit
                      numberOfLines={1}
                      allowFontScaling
                      minimumFontScale={0.3}
                      style={{paddingLeft: 60}}
                    >
                      {subtitle}
                    </Subtitle>
                  )}
                </Body>
                <Right>
                  <Text></Text>
                </Right>
              </Header>
              <GooglePlacesAutocomplete
                placeholder="Type or use left button and drag"
                minLength={3}
                debounce={200}
                autoFocus={false}
                returnKeyType="search"
                query={{
                  key: config.googleApiMobile
                }}
                fetchDetails
                currentLocation={false}
                predefinedPlaces={predefinedLocation}
                onPress={(data, details = null) => {
                    const region = {
                      latitude: details.geometry.location.lat,
                      longitude: details.geometry.location.lng,
                      latitudeDelta: 0.00922 * 1.5,
                      longitudeDelta: 0.00421 * 1.5
                    };
                    this.onRegionChange(data.description, region, region.latitude, region.longitude);
                    // this.selectedPlace(data, details)
                  }
                }
                ref={autocomplete => {
                  this._autocomplete = autocomplete;
                }}
                renderLeftButton={() => (
                  <Button
                    transparent
                    primary
                    onPress={() => this.useCurrentLocation()}
                  >
                    <Icon name="pin" />
                  </Button>
                )}
                renderRightButton={() => (
                  <Button
                    transparent
                    danger
                    onPress={() => this.handleRemoveText()}
                  >
                    <Icon name="close" />
                  </Button>
                )}
              />
              <OrderMap
                onPlaceSelected={() => this.sendBackPlace()}
                description={this.state.address ? this.state.address : address}
                coordinates={coordinates}
                map={mapRegion}
                onDragMarker={this.handleDragMarker}
              />
              </ScrollView>
            {/* </Container> */}
              {/* </View> */}
            {/* </Content> */}
          {/* </Layout> */}
        </Modal>
      // </View>
    );
  }
}

OrderPlaceModal.propTypes = {
  title: PropTypes.string,
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  retrieveValue: PropTypes.func.isRequired,
  number: PropTypes.number,
  name: PropTypes.string,
  address: PropTypes.string,
  latitude: PropTypes.number,
  longitude: PropTypes.number
};

OrderPlaceModal.defaultProps = {
  title: 'Order Map',
  number: undefined,
  name: undefined,
  address: undefined,
  latitude: undefined,
  longitude: undefined
};

export default OrderPlaceModal;
