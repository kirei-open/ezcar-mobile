import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
// import 'moment/locale/id';
import validate from 'validate.js';
import { TouchableOpacity, StyleSheet, View, Alert, ScrollView } from 'react-native';
import {
  Content,
  Item,
  Input,
  Button,
  Text,
  Footer,
  Label,
  Segment,
  Card,
  CardItem,
  Container,
  Icon,
  Picker,
  FooterTab,
  Right,
  Radio,
  Toast
} from 'native-base';

import OrderPlace from './OrderPlace';
import OrderPlaceModal from './OrderPlaceModal';
import PassengerModal from './PassengerModal';
import config from '../modules/constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const style = StyleSheet.create({
  cardHeader: {
    paddingVertical: 7
  },
  picker: {
    marginLeft: 10,
    marginRight: 10
  },
  noborder: {
    borderWidth: 0,
    borderColor: 'transparent'
  },
  inlineInner: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
});

const initialModalPlace = {
  showModal: false,
  title: undefined,
  subtitle: undefined,
  name: undefined,
  number: undefined,
  address: undefined,
  latitude: undefined,
  longitude: undefined
};

validate.extend(validate.validators.datetime, {
  parse(value) {
    return +moment.utc(value);
  },
  // Input is a unix timestamp
  format(value, options) {
    const format = options.dateOnly ? 'YYYY-MM-DD' : 'YYYY-MM-DD hh:mm:ss';
    return moment.utc(value).format(format);
  }
});

const validations = {
  shuttle: {
    presence: true,
    inclusion: ['With driver', 'Without driver']
  },
  trip: {
    presence: true,
    inclusion: ['On the spot', 'Plan single-trip', 'Plan multi-trip']
  },
  seat: {
    presence: true,
    numericality: true
  },
  allSeat: {
    presence: true
  },
  estimationHour: {
    presence: true,
    numericality: {
      greaterThan: 0
    }
  },
  pickupTime: {
    presence: true,
    datetime: true
  },
  dropTime: {
    presence: true,
    datetime: true
  },
  routes: {
    presence: true
  }
};

const routeValidations = {
  pickupAddress: {
    presence: {
      message: "(Departure) can't be blank"
    }
  },
  'pickupLocation.coordinates': {
    presence: {
      message: '(Departure) not found'
    }
  },
  dropAddress: {
    presence: {
      message: "(Arrival) can't be blank"
    }
  },
  'dropLocation.coordinates': {
    presence: {
      message: '(Arrival) not found'
    }
  }
};

class OrderForm extends PureComponent {
  constructor(props) {
    super(props);

    const { order } = props;

    this.state = {
      user: '',
      role: '',
      shuttle: order ? order.shuttle : 'With driver',
      trip: order ? order.trip : 'On the spot',
      roundTrip: order ? order.roundTrip : false,
      seat: order ? String(order.seat) : '1',
      routes: order
        ? order.routes
        : [
            {
              id: 'route-0',
              pickupAddress: undefined,
              pickupLocation: {
                type: 'Point',
                coordinates: undefined
              },
              dropAddress: undefined,
              dropLocation: {
                type: 'Point',
                coordinates: undefined
              }
            }
          ],
      allSeat: order ? order.allSeat : false,
      pickupTime: order
        ? moment(order.pickupTime, 'DD MMMM YYYY, [pukul] HH:mm').toDate()
        : new Date(),
      dropTime: order
        ? moment(order.dropTime, 'DD MMMM YYYY, [pukul] HH:mm').toDate()
        : moment()
            .add(1, 'h')
            .toDate(),
      estimationHour: order ? String(order.estimationHour) : '1',
      notes: order ? order.notes : '',
      placeNumber: order ? order.routes.length - 1 : 0,
      modalPickup: false,
      modalDrop: false,
      modalPlace: initialModalPlace,
      errors: {},
      settingsOrder: config.settings.order,
      showModalPassenger: false,
      userState: {}
    };

    this.onChangeInput = this.onChangeInput.bind(this);
    this.onRoundTripChange = this.onRoundTripChange.bind(this);
    this.incrementPlace = this.incrementPlace.bind(this);
    this.removePlace = this.removePlace.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.openModalPlace = this.openModalPlace.bind(this);
    this.closeModalPlace = this.closeModalPlace.bind(this);
    this.retrievePlaceValue = this.retrievePlaceValue.bind(this);
    this.setDateTime = this.setDateTime.bind(this);
    this._renderPicker = this._renderPicker.bind(this);
    this.openModalPassenger = this.openModalPassenger.bind(this);
    this.onSearchPassenger = this.onSearchPassenger.bind(this);
    this.getPassenger = this.getPassenger.bind(this);
  }

  async componentDidMount() {
    const role = await AsyncStorage.getItem("role");
    const data = await AsyncStorage.getItem("user");
    const user = JSON.parse(data)
    this.setState({ role , user})
  }

  onChangeInput(name, value) {
    if (this.state[name] !== value) {
      this.setState({
        [name]: value
      });
    }
  }

  onRoundTripChange(value) {
    const { trip, roundTrip } = this.state;
    if (value !== roundTrip) {
      if (value && trip === 'Plan multi-trip') {
        this.setState({
          trip: 'Plan single-trip',
          roundTrip: value
        });
      } else {
        this.setState({
          roundTrip: value
        });
      }
    }
  }

  onSearchPassenger(value) {
    if (!value) {
      return;
    }
    const params = {
      limit: 5,
      q: {
        name: value
      },
      page: 1
    };

    this.props.searchPassenger(params);
  }

  setEstimationHour = async () => {
    const { shuttle, estimationHour, pickupTime } = this.state;

    if (pickupTime && shuttle === 'With driver') {
      const dropTime = moment(pickupTime)
        .add(Number(estimationHour), 'hours')
        .toDate();
      await this.setState({
        dropTime
      });
    }
  };

  setDateTime(name, date) {
    const { pickupTime, dropTime, shuttle } = this.state;

    const modalName = name === 'pickupTime' ? 'modalPickup' : 'modalDrop';
    if (shuttle === 'Without driver') {
      if (modalName === 'modalDrop') {
        const pickupTimeAfter =
          name === 'pickupTime' ? moment(date) : moment(pickupTime);
        const dropTimeAfter =
          name === 'dropTime' ? moment(date) : moment(dropTime);
        const estimation = dropTimeAfter.diff(pickupTimeAfter, 'hours');
        this.setState({
          [modalName]: false,
          [name]: date,
          estimationHour: String(estimation)
        });
      } else {
        this.setState({
          [modalName]: false,
          [name]: date,
          modalDrop: true
        });
      }
    } else {
      this.setState({
        [modalName]: false,
        [name]: date
      });
    }
  }

  getPassenger(user) {
    this.setState({
      userState: user
    });
  }

  openModalPassenger(param) {
    this.setState({
      showModalPassenger: param
    });
  }

  async handleSubmit() {
    await this.setEstimationHour();

    const {
      modalDrop,
      modalPickup,
      modalPlace,
      errors,
      placeNumber,
      ...rest
    } = this.state;

    const validationResult = validate(rest, validations);

    const copyRoutes = rest.routes.slice(0);
    const validationRoutes = copyRoutes
      .map(item => validate(item, routeValidations))
      .filter(i => i);

    const dateCheck = moment(rest.dropTime).isAfter(moment(rest.pickupTime));

    if (
      !validationResult &&
      rest.routes.length > 0 &&
      validationRoutes.length === 0 &&
      dateCheck
    ) {
      const results = {
        ...rest,
        ...config.settings.order.force
      };
      if (rest.trip !== 'Plan multi-trip') {
        results.routes = results.routes.filter((item, index) => index === 0);
      }

      if (rest.roundTrip) {
        results.routes[1] = {
          pickupLocation: results.routes[0].dropLocation,
          pickupAddress: results.routes[0].dropAddress,
          dropLocation: results.routes[0].pickupLocation,
          dropAddress: results.routes[0].pickupAddress
        };
      }

      if (rest.shuttle === 'With driver') {
        results.seat = String(parseInt(results.seat, 10) + 1);
      }

      Alert.alert(
        'Are you sure to submit order?',
        'Check your form again. Before submiting',
        [
          { text: 'Cancel', onPress: () => {}, style: 'cancel' },
          {
            text: 'Submit now',
            onPress: () => this.props.onFormSubmit(results)
          }
        ]
      );
    } else {
      const errorMessage = {
        ...validationResult,
        routes: validationRoutes
      };

      if (!dateCheck) {
        errorMessage.pickupTime = 'Pickup time must before drop time';
      }

      this.setState(
        {
          errors: errorMessage
        },
        () => {
          Toast.show({
            text: 'Please check your form again',
            position: 'bottom',
            type: 'error',
            buttonText: 'Okay'
          });
        }
      );
    }
  }

  removePlace(id) {
    const { routes } = this.state;

    const newRoutes = routes.filter((route, index) => index !== id);
    this.setState({
      routes: newRoutes
    });
  }

  incrementPlace() {
    const { routes } = this.state;
    const previousIndex = routes.length - 1;

    this.setState(prevState => ({
      placeNumber: prevState.placeNumber + 1,
      routes: [
        ...prevState.routes,
        {
          id: `route-${prevState.placeNumber}`,
          pickupAddress: routes[previousIndex]
            ? routes[previousIndex].dropAddress
            : undefined,
          pickupLocation: {
            type: 'Point',
            coordinates:
              routes[previousIndex] && routes[previousIndex].dropLocation
                ? routes[previousIndex].dropLocation.coordinates
                : undefined
          },
          dropAddress: undefined,
          dropLocation: {
            type: 'Point',
            coordinates: undefined
          }
        }
      ]
    }));
  }

  openModalPlace(data) {
    this.setState({
      modalPlace: {
        ...this.state.modalPlace,
        showModal: true,
        ...data
      }
    });
  }

  closeModalPlace() {
    this.setState({
      modalPlace: initialModalPlace
    });
  }

  retrievePlaceValue(result) {
    console.log('retrievePlaceValue', result);
    const { address, name, number, latitude, longitude } = result;
    const { routes } = this.state;
    const locationName =
      name === 'pickupAddress' ? 'pickupLocation' : 'dropLocation';
    console.log('routes before', routes);
    const changedRoutes = routes.map((route, index) => {
      if (index === number) {
        return {
          ...route,
          [name]: address,
          [locationName]: {
            ...route[locationName],
            type: 'Point',
            coordinates: [longitude, latitude]
          }
        };
      } else if (index === number + 1 && name === 'dropAddress') {
        return {
          ...route,
          pickupAddress: address,
          pickupLocation: {
            ...route.pickupLocation,
            type: 'Point',
            coordinates: [longitude, latitude]
          }
        };
      }

      return route;
    });

    this.setState({
      routes: changedRoutes
    });
    console.log('routes after', this.state.routes);
  }

  _renderPicker() {
    const { roundTrip, trip } = this.state;
    const availableTrip = ['On the spot', 'Plan single-trip'];
    if (!roundTrip) {
      availableTrip.push('Plan multi-trip');
    }

    const mappedTrip = availableTrip.map(item => (
      <Picker.Item key={item} value={item} label={item} />
    ));

    return (
      <Picker
        mode="dropdown"
        placeholder="Trip Selection"
        selectedValue={trip}
        onValueChange={value => this.onChangeInput('trip', value)}
        style={style.picker}
      >
        {mappedTrip}
      </Picker>
    );
  }

  render() {
    const {
      shuttle,
      trip,
      seat,
      roundTrip,
      routes,
      allSeat,
      pickupTime,
      dropTime,
      estimationHour,
      notes,
      modalPlace,
      errors,
      settingsOrder,
      visible,
      picked,
      userState,
      role,
      user
    } = this.state;

    const { list } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <DateTimePicker
          isVisible={this.state.modalPickup}
          mode="datetime"
          titleIOS="Choose pickup time"
          onConfirm={date => this.setDateTime('pickupTime', date)}
          onCancel={() => this.onChangeInput('modalPickup', false)}
          date={pickupTime}
        />
        <DateTimePicker
          isVisible={this.state.modalDrop}
          titleIOS="Choose drop time"
          mode="datetime"
          onConfirm={date => this.setDateTime('dropTime', date)}
          onCancel={() => this.onChangeInput('modalDrop', false)}
          minimumDate={pickupTime}
          date={dropTime}
        />
        <Container>
          <Segment>
            <Button
              first
              active={shuttle === 'With driver'}
              onPress={() => this.onChangeInput('shuttle', 'With driver')}
            >
              <Text>With driver</Text>
            </Button>
            <Button
              last
              active={shuttle === 'Without driver'}
              onPress={() => this.onChangeInput('shuttle', 'Without driver')}
            >
              <Text>Without driver</Text>
            </Button>
          </Segment>
          <OrderPlaceModal
            {...modalPlace}
            retrieveValue={this.retrievePlaceValue}
            closeModal={this.closeModalPlace}
          />
          <ScrollView>
            <Card>
              <CardItem header style={style.cardHeader}>
                <Icon name="pin" />
                <Text>Route</Text>
              </CardItem>
              <CardItem>
                <Item fixedLabel style={style.noborder}>
                  <Label>Round trip</Label>
                  <Right style={style.inlineInner}>
                    <TouchableOpacity
                      onPress={() => this.onRoundTripChange(true)}
                    >
                      <Radio
                        selected={roundTrip}
                        onPress={() => this.onRoundTripChange(true)}
                      />
                      <Text> Yes </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.onRoundTripChange(false)}
                    >
                      <Radio
                        selected={!roundTrip}
                        onPress={() => this.onRoundTripChange(false)}
                      />
                      <Text> No</Text>
                    </TouchableOpacity>
                  </Right>
                </Item>
              </CardItem>
              {this._renderPicker()}
              <OrderPlace
                multiplace={trip === 'Plan multi-trip'}
                routes={routes}
                onRemovePlace={this.removePlace}
                onAddPlace={this.incrementPlace}
                openModal={this.openModalPlace}
                errors={errors}
              />
            </Card>
            <Card>
            <CardItem header style={style.cardHeader}>
              <Icon name="car" />
              <Text>Fleet</Text>
            </CardItem>
            {settingsOrder.show.allSeat && (
              <CardItem>
                <Item fixedLabel style={style.noborder}>
                  <Label>Book all seat</Label>
                  <Right style={style.inlineInner}>
                    <TouchableOpacity
                      onPress={() => this.onChangeInput('allSeat', true)}
                    >
                      <Radio
                        selected={allSeat}
                        onPress={() => this.onChangeInput('allSeat', true)}
                      />
                      <Text> Yes </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.onChangeInput('allSeat', false)}
                    >
                      <Radio
                        selected={!allSeat}
                        onPress={() => this.onChangeInput('allSeat', false)}
                      />
                      <Text> No</Text>
                    </TouchableOpacity>
                  </Right>
                </Item>
              </CardItem>
            )}
            <CardItem>
              <Item fixedLabel style={style.noborder}>
                <Label>Total seat</Label>
                <Right>
                  <Input
                    value={seat}
                    style={{
                      textAlign: 'right',
                      alignSelf: 'flex-end'
                    }}
                    onChangeText={value => this.onChangeInput('seat', value)}
                    keyboardType="numeric"
                  />
                </Right>
              </Item>
            </CardItem>
          </Card>
          <Card>
            <CardItem header style={style.cardHeader}>
              <Icon name="calendar" />
              <Text>Time</Text>
            </CardItem>
            <CardItem style={{ flexDirection: 'column' }}>
              <Item fixedLabel style={style.noborder}>
                <Label>Pickup</Label>
                <TouchableOpacity
                  onPress={() => {
                    if (this.state.trip !== 'On the spot') {
                      this.onChangeInput('modalPickup', true);
                    }
                  }}
                >
                  <Right style={style.inlineInner}>
                    <Text>
                      {moment(pickupTime).format('DD MMMM YYYY, HH:mm')}{' '}
                    </Text>
                  </Right>
                </TouchableOpacity>
              </Item>
              {errors.pickupTime && (
                <Text
                  style={{ color: '#FF4E54', fontSize: 12, textAlign: 'right' }}
                >
                  {errors.pickupTime}
                </Text>
              )}
            </CardItem>
            {this.state.shuttle === 'Without driver' && (
              <CardItem style={{ flexDirection: 'column' }}>
                <Item fixedLabel style={style.noborder}>
                  <Label>Drop</Label>
                  <TouchableOpacity
                    onPress={() => this.onChangeInput('modalDrop', true)}
                  >
                    <Right style={style.inlineInner}>
                      <Text>
                        {dropTime
                          ? moment(dropTime).format('DD MMMM YYYY, HH:mm')
                          : 'Tap to choose drop time'}{' '}
                      </Text>
                    </Right>
                  </TouchableOpacity>
                </Item>
                {errors.dropTime && (
                  <Text
                    style={{
                      color: '#FF4E54',
                      fontSize: 12,
                      textAlign: 'right',
                      alignSelf: 'flex-end'
                    }}
                  >
                    {errors.dropTime}
                  </Text>
                )}
              </CardItem>
            )}
            <CardItem
              style={{
                paddingTop: 0,
                paddingBottom: shuttle === 'Without driver' ? 0 : 12,
                flexDirection: 'column'
              }}
            >
              <Item
                fixedLabel
                style={{
                  borderWidth: 0,
                  borderColor: 'transparent'
                }}
              >
                <Label>Usage Estimation</Label>
                <Right>
                  <Input
                    style={{
                      textAlign: 'right',
                      alignSelf: 'flex-end'
                    }}
                    value={estimationHour}
                    onChangeText={value =>
                      this.onChangeInput('estimationHour', value)
                    }
                    disabled={shuttle === 'Without driver'}
                    keyboardType="numeric"
                  />
                </Right>
              </Item>
              {errors.estimationHour && (
                <Text style={{ color: '#FF4E54', fontSize: 12 }}>
                  {errors.estimationHour}
                </Text>
              )}
            </CardItem>
            {this.state.shuttle === 'Without driver' && (
              <CardItem
                style={{ marginTop: 0, paddingTop: 0, alignSelf: 'flex-end' }}
              >
                <Text note>Calculated from pickup time and drop time</Text>
              </CardItem>
            )}
          </Card>
          <Card>
            <CardItem header style={style.cardHeader}>
              <Icon name="clipboard" />
              <Text>Additional</Text>
            </CardItem>
            <CardItem>
              <Item regular>
                <Input
                  multiline
                  placeholder="Notes"
                  numberOfLines={2}
                  value={notes}
                  onChangeText={value => this.onChangeInput('notes', value)}
                  style={{ textAlignVertical: 'top' }}
                />
              </Item>
            </CardItem>
          </Card>
          {['admin_super', 'admin_company', 'admin_division'].indexOf(
            role
          ) > -1 && (
            <Card style={{ marginBottom: 20 }}>
              <CardItem header style={style.cardHeader}>
                <Icon name="person" />
                <Text>Passenger</Text>
              </CardItem>
              <CardItem style={{ flexDirection: 'column' }}>
                <Item fixedLabel style={style.noborder}>
                  <Button
                    transparent
                    onPress={() => {
                      this.openModalPassenger(true);
                    }}
                  >
                    <Label>Passenger</Label>
                  </Button>
                  <Right>
                    <Text>{userState ? userState.name : ''}</Text>
                  </Right>
                </Item>
              </CardItem>
              <PassengerModal
                showModal={this.state.showModalPassenger}
                openModalPassenger={this.openModalPassenger}
                user={user} 
                list={list}
                onSearchPassenger={this.onSearchPassenger}
                getPassenger={this.getPassenger}
              />
            </Card>
          )}
          </ScrollView>
         
        </Container>
        <Footer>
          <FooterTab>
            <Button full primary onPress={() => this.handleSubmit()}>
              <Text style={{ color: '#fff', fontWeight: '500' }}>Submit</Text>
            </Button>
          </FooterTab>
        </Footer>
      </View>
    );
  }
}

OrderForm.propTypes = {
  onFormSubmit: PropTypes.func.isRequired,
  searchPassenger: PropTypes.func.isRequired,
  user: PropTypes.shape({}).isRequired,
  list: PropTypes.shape({}).isRequired
};

export default OrderForm;
