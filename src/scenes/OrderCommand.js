import React, { Component } from 'react';
import { SafeAreaView, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
// import StarRating from 'react-native-star-rating';
import { Rating } from 'react-native-ratings';
import uuidv4 from 'uuid/v4';
import {
  Container,
  Content,
  Form,
  Item,
  Picker,
  Text,
  Input,
  Button,
  Toast,
  Body,
  Header,
  Title,
  Left,
  Right
} from 'native-base';
import ImageUpload from '../components/ImageUpload';
import requests from '../modules/request';
import UserImage from '../components/UserImage';
import config from '../modules/constants/config';
import BackButton from '../components/BackButton';
import navigationStyle from '../constants/navigation'

const JoinCommand = ({ availableSeat, onSeatChange, seatValue }) => (
  <View style={{ padding: 12 }}>
    <View style={{ marginBottom: 12 }}>
      <Text>Total seat</Text>
      <Text note>Available seat: {availableSeat}</Text>
    </View>
    <Item regular>
      <Input
        value={seatValue}
        keyboardType="numeric"
        onChangeText={value => onSeatChange('seat', value)}
        maxLength={String(availableSeat).length}
      />
    </Item>
  </View>
);

const MileageCommand = ({
  type,
  onMileageChange,
  currValue,
  photos,
  handleChange
}) => (
  <View style={{ padding: 12 }}>
    <View style={{ marginBottom: 12 }}>
      <Text>Insert your Fleet Current Mileage (Km)</Text>
    </View>
    <Item regular>
      <Input
        value={currValue}
        keyboardType="numeric"
        onChangeText={value => onMileageChange(type, value)}
        maxLength={1000000000}
      />
    </Item>
    <View style={{ marginTop: 12, marginBottom: 12 }}>
      <View style={{ marginBottom: 12 }}>
        <Text>Fuel Photo</Text>
      </View>
      <Item regular>
        <ImageUpload
          containerStyle={{ paddingVertical: 12, paddingHorizontal: 6 }}
          group="image"
          attached="Order"
          images={photos}
          handleChange={images => handleChange(images)}
        />
      </Item>
    </View>
  </View>
);

const PickerCommand = ({
  pickerListItems,
  placeholder,
  title,
  labelName,
  pickerValue,
  onPickerChange
}) => (
  <View style={{ padding: 12 }}>
    <View style={{ marginBottom: 12 }}>
      <Text>{title}</Text>
    </View>
    <Picker
      mode="dialog"
      placeholder={placeholder}
      selectedValue={pickerValue}
      onValueChange={value => onPickerChange(value)}
      style={{ marginLeft: 12, marginRight: 12 }}
    >
      <Picker.Item label={placeholder} value="" />
      {pickerListItems.map(listItem => (
        <Picker.Item
          key={listItem._id}
          label={listItem[labelName]}
          value={listItem._id}
        />
      ))}
    </Picker>
  </View>
);

const NotesCommand = ({ title, label, placeholder, value, onNotesChange }) => (
  <View style={{ padding: 12 }}>
    <View style={{ alignSelf: 'center' }}>
      <Text>{title}</Text>
    </View>
    <View>
      <Text>{label}</Text>
      <Item regular>
        <Input
          placeholder={placeholder}
          multiline
          numberOfLines={2}
          value={value}
          onChangeText={newValue => onNotesChange(newValue)}
        />
      </Item>
    </View>
  </View>
);

const SubmitCommand = ({ onCancelCommand, onSubmitCommand }) => (
  <View
    style={{
      // flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 12
    }}
  >
    <View style={{ flex: 0.5 }}>
      <Button block bordered danger onPress={() => onCancelCommand()}>
        <Text>Cancel</Text>
      </Button>
    </View>
    <View style={{ flex: 0.5 }}>
      <Button block bordered primary onPress={() => onSubmitCommand()}>
        <Text>Okay</Text>
      </Button>
    </View>
  </View>
);

class OrderCommand extends Component {
  constructor(props) {
    super(props);

    this.state = {
      photos: [],
      endMileage: 0,
      startMileage: 0,
      notes: '',
      fleet: undefined,
      fleets: [],
      nextPIC: undefined,
      listPIC: [],
      loaded: false,
      check: null,
      message: '',
      seat: '0',
      rating: 0
    };

    this.onSubmitCommand = this.onSubmitCommand.bind(this);
    this.onInputSelected = this.onInputSelected.bind(this);
    this.getApprovers = this.getApprovers.bind(this);
    this.getDrivers = this.getDrivers.bind(this);
    this.getFleets = this.getFleets.bind(this);
    this.checkAvailability = this.checkAvailability.bind(this);
  }

  componentWillMount() {
    const { commandType } = this.props;
    if (commandType === 'switched') {
      this.getApprovers();
    } else if (commandType === 'assigned') {
      this.getDrivers();
      this.getFleets();
    } else if (commandType === 'approved') {
      this.checkAvailability();
    }
  }

  onSubmitCommand() {
    const {
      nextPIC,
      notes,
      fleet,
      seat,
      rating,
      startMileage,
      endMileage,
      photos
    } = this.state;
    const { commandType, order } = this.props;

    const toastConfig = {
      text: '',
      position: 'bottom',
      type: 'warning',
      duration: 2000
    };

    if (commandType === 'assigned' && (!fleet || !nextPIC)) {
      Toast.show({
        ...toastConfig,
        text: 'No fleet or driver found'
      });
    } else if (commandType === 'switched' && !nextPIC) {
      Toast.show({
        ...toastConfig,
        text: 'No approver assigned'
      });
    } else if (['rejected', 'suspended'].indexOf(commandType) > -1 && !notes) {
      Toast.show({
        ...toastConfig,
        text: 'You must include notes for this action command'
      });
    } else if (
      commandType === 'joined' &&
      (!seat || Number(seat) > order.fleet.totalSeat - order.seat)
    ) {
      Toast.show({
        ...toastConfig,
        text: 'Cannot join order with seat you inserted'
      });
    } else if (commandType === 'rated' && !rating) {
      Toast.show({
        ...toastConfig,
        text: 'Include rate for this action command'
      });
    } else {
      const fuelPhotos = photos.map(item => config.api + item.source);

      const format = {
        command: commandType,
        payload: {
          nextPIC,
          notes,
          startMileage,
          endMileage,
          fuelPhotos
        }
      };

      if (fleet) {
        format.payload.fleet = fleet;
      }

      if (Number(seat) > 0) {
        format.payload.seat = seat;
      }

      if (Number(rating) > 0) {
        format.payload.rating = rating;
      }

      // console.log('orderCommand format', format);

      this.props.commandSubmit(format.command, order._id, format.payload);
      Actions.popTo('orderdetail', {
        orderId: order._id,
        refreshScene: uuidv4()
      });
    }
  }

  onInputSelected(name, value) {
    this.setState({
      [name]: value
    });
  }

  async getApprovers() {
    const result = await requests.user.minilist({
      role: 'approver',
      division: this.props.order.division
    });
    const { users } = result.data;

    if (users && users.length > 0) {
      this.setState({
        listPIC: users,
        nextPIC: undefined
      });
    }
  }

  async getDrivers() {
    const { order } = this.props;
    const result = await requests.user.minilist({
      role: 'driver',
      company: this.props.order.company
    });
    const { users } = result.data;
    if (users && users.length > 0) {
      this.setState({
        listPIC: users,
        nextPIC: order.driver._id
      });
    }
  }

  async getFleets() {
    const { order } = this.props;
    const result = await requests.fleet.minilist({
      company: this.props.order.company,
      canOperate: true,
      onMarketplace: false,
      order: this.props.order._id
    });
    const { fleet } = result.data;
    if (fleet && fleet.length > 0) {
      this.setState({
        fleets: fleet,
        fleet: order.fleet._id
      });
    }
  }

  async checkAvailability() {
    const { order } = this.props;
    const result = await requests.order.check(order._id);
    const { check, message } = result.data;

    this.setState({
      check,
      loaded: true,
      message
    });
  }

  _renderCommand = () => {
    const { commandType, order } = this.props;

    if (['rejected', 'suspended'].indexOf(commandType) > -1) {
      return (
        <NotesCommand
          title="Please state the reason below"
          placeholder="Reason"
          value={this.state.notes}
          onNotesChange={value => this.onInputSelected('notes', value)}
        />
      );
    } else if (commandType === 'switched') {
      return (
        <PickerCommand
          title="Select user as approver"
          placeholder="Choose one"
          pickerListItems={this.state.listPIC}
          pickerValue={this.state.nextPIC}
          onPickerChange={value => this.onInputSelected('nextPIC', value)}
          labelName="name"
        />
      );
    } else if (commandType === 'assigned') {
      return (
        <View style={{ padding: 12 }}>
          {this.state.listPIC.length > 0 && (
            <View style={{ padding: 12 }}>
              <View style={{ marginBottom: 12 }}>
                <Text>Select driver for this order</Text>
              </View>
              <Picker
                mode="dialog"
                placeholder="Choose one driver"
                selectedValue={this.state.nextPIC}
                onValueChange={value => this.onInputSelected('nextPIC', value)}
                style={{ marginLeft: 12, marginRight: 12 }}
              >
                <Picker.Item label="Choose one driver" value="" />
                {this.state.listPIC.map(listItem => (
                  <Picker.Item
                    key={listItem._id}
                    label={`${listItem.name} - Pool ${listItem.pool.name}`}
                    value={listItem._id}
                  />
                ))}
              </Picker>
            </View>
          )}
          {this.state.fleets.length > 0 && (
            <View style={{ padding: 12 }}>
              <View style={{ marginBottom: 12 }}>
                <Text>Select fleet for this order</Text>
              </View>
              <Picker
                mode="dialog"
                placeholder="Choose one fleet"
                selectedValue={this.state.fleet}
                onValueChange={value => this.onInputSelected('fleet', value)}
                style={{ marginLeft: 12, marginRight: 12 }}
              >
                <Picker.Item label="Choose one driver" value="" />
                {this.state.fleets.map(listItem => (
                  <Picker.Item
                    key={listItem._id}
                    label={`${listItem.plateNumber} - Pool ${
                      listItem.pool.name
                    }`}
                    value={listItem._id}
                  />
                ))}
              </Picker>
            </View>
          )}
        </View>
      );
    } else if (commandType === 'approved') {
      return (
        <View style={{ margin: 12 }}>
          <Text note>Checking fleet, driver and pool</Text>
          <Text>{this.state.message}</Text>
        </View>
      );
    } else if (commandType === 'joined') {
      return (
        <JoinCommand
          onSeatChange={(name, value) => this.onInputSelected(name, value)}
          seatValue={this.state.seat}
          availableSeat={order.fleet.totalSeat - order.seat}
        />
      );
    } else if (commandType === 'rated') {
      return (
        <View style={{ padding: 12 }}>
          <View style={{ alignSelf: 'center' }}>
            <View style={{ alignSelf: 'center' }}>
              <UserImage
                user={order.driver}
                mode="circle"
                styleContainer={{
                  width: 70,
                  height: 70,
                  borderRadius: 70,
                  alignSelf: 'center'
                }}
              />
              <Text>{order.driver.name}</Text>
            </View>
            {/* <StarRating
              disabled={false}
              maxStars={5}
              rating={this.state.rating}
              selectedStar={value => this.onInputSelected('rating', value)}
              fullStarColor="yellow"
              emptyStar="ios-star-outline"
              fullStar="ios-star"
              iconSet="Ionicons"
            /> */}
            <Rating
              showRating={false}
              maxStars={5}
              onFinishRating={value => this.setState({rating: value})}
              style={{ paddingVertical: 10 }}
            />
          </View>
          <View style={{ paddingVertical: 12 }}>
            <Text>Comments:</Text>
            <Item regular>
              <Input
                placeholder="Any comments for this order"
                multiline
                numberOfLines={2}
                value={this.state.notes}
                onChangeText={value => this.onInputSelected('notes', value)}
              />
            </Item>
          </View>
        </View>
      );
    } else if (commandType === 'started') {
      return (
        <MileageCommand
          type="startMileage"
          onMileageChange={(name, value) => this.onInputSelected(name, value)}
          currValue={this.state.startMileage}
          photos={this.state.photos}
          handleChange={images => this.onInputSelected('photos', images)}
        />
      );
    } else if (commandType === 'ended') {
      return (
        <MileageCommand
          type="endMileage"
          onMileageChange={(name, value) => this.onInputSelected(name, value)}
          currValue={this.state.endMileage}
          photos={this.state.photos}
          handleChange={images => this.onInputSelected('photos', images)}
        />
      );
    }
    return null;
  };

  render() {
    const { check } = this.state;
    const { commandContent, commandType } = this.props;
    let title;
    if (commandType === 'approved') {
      title = "Approve Order"
    } else if (commandType === 'switched') {
      title = "Assign Approver"
    } else if (commandType === 'rejected') {
      title = "Reject Order"
    } else if (commandType === 'assigned') {
      title = "Reassign Order"
    } else if (commandType === 'locked') {
      title = "Locked Order"
    } else if (commandType === 'confirmed') { 
      title = "Confirm Order"
    } else if (commandType === 'started') {
      title = "Start Order"
    } else if (commandType === 'ended') {
      title = "End Order"
    } else if (commandType === 'rated') {
      title= "Rated Order"
    } else {
      title = "Suspend Order"
    }

    return (
      <SafeAreaView style={{backgroundColor: 'white'}}>
        <Header style={navigationStyle.navbarProps.navigationBarStyle}>
          <Left style={{ flex: 0.5 }}>
            <BackButton iconStyle={{ color: 'black' }} />
          </Left>
          <Body style={{ flex: 1 }}>
            <Title style={navigationStyle.navbarProps.titleStyle}>
              {title}
            </Title>
          </Body>
          <Right style={{ flex: 0.5 }}><View></View></Right>
        </Header>
        <View>
          {commandType !== 'approved' && (
            <View
              style={{
                // flex: 1,
                padding: 12,
                alignSelf: 'center'
              }}
            >
              <Text>{commandContent}</Text>
            </View>
          )}
          <Form>{this._renderCommand()}</Form>
          {commandType === 'approved' ? (
            <View style={{ padding: 12 }}>
              {check ? (
                <View>
                  <View
                    style={{
                      flex: 1,
                      paddingBottom: 12,
                      alignSelf: 'center'
                    }}
                  >
                    <Text>{commandContent}</Text>
                  </View>
                  <SubmitCommand
                    onSubmitCommand={() => this.onSubmitCommand()}
                    onCancelCommand={() => Actions.pop()}
                  />
                </View>
              ) : (
                <Button block bordered primary onPress={() => Actions.pop()}>
                  <Text>Go back</Text>
                </Button>
              )}
            </View>
          ) : (
            <SubmitCommand
              onSubmitCommand={() => this.onSubmitCommand()}
              onCancelCommand={() => Actions.pop()}
            />
          )}
        </View>
      </SafeAreaView>
    );
  }
}

export default OrderCommand;
