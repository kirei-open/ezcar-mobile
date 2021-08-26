import React, { PureComponent } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Dimensions,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import get from 'lodash/get';
// import StarRating from 'react-native-star-rating';
import Modal from 'react-native-modalbox';
import uuidv4 from 'uuid/v4';
import moment from 'moment';
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

import navigationStyle from '../constants/navigation';
import OrderDetailMap from '../containers/OrderDetailMap';
import OrderBadge from '../components/OrderBadge';
import BackButton from '../components/BackButton';
import OrderFleetItem from '../components/OrderFleetItem';
import actionButtons from '../constants/orderAction';
import orderColor from '../constants/orderColor';
import UserImage from '../components/UserImage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Rating } from 'react-native-ratings';

const detailList = [
  { index: 'shuttle', label: 'Shuttle' },
  { index: 'trip', label: 'Trip' },
  { index: 'pickupTime', label: 'Pickup time' },
  { index: 'dropTime', label: 'Drop time' },
  { index: 'estimationHour', label: 'Estimation Hour' },
  { index: 'allSeat', label: 'Book all seat' },
  { index: 'seat', label: 'Total seat' }
];

const DetailItem = ({ name, value }) => (
  <CardItem>
    <Left style={{ flex: 0.3 }}>
      <Text note style={{ marginLeft: 0, fontSize: 14 }}>
        {name}
      </Text>
    </Left>
    <Body style={{ flex: 0.7 }}>
      {name === 'Book all seat' ? (
        <Text>{value ? 'Yes' : 'No'}</Text>
      ) : (
        <Text>{value}</Text>
      )}
    </Body>
  </CardItem>
);

const style = StyleSheet.create({
  cardHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#c9c9c9'
  }
});

class OrderDetailItem extends PureComponent {
  state = {
    availableButtons: [],
    showedEditButton: false,
    showedRateModal: false,
    role: '',
    user: '',
  };

  async componentDidMount() {
    const role = await AsyncStorage.getItem("role");
    const data = await AsyncStorage.getItem('user');
    const user = JSON.parse(data)
    this.setState({ user })
    const { orderId, allOrder, single } = this.props;
    this.props.getOrderDetail(orderId);
    // if (Object.keys(single).length > 0) {
    //   const availableButtons = actionButtons
    //   .filter(
    //     condition=>
    //       condition.locked === single.locked &&
          // Array.isArray(allOrder.status) &&
          // condition.showStatus.indexOf(allOrder.status) > -1 ||
          // condition.showStatus.length === 0 &&
          // condition.hideStatus.indexOf(allOrder.status) > -1 &&
          // condition.orderContidion(user, allOrder) &&
          // (condition.allowedRoles.length === 0 ||
          //   condition.allowedRoles.indexOf(role) > -1)
    //       Array.isArray(single.status) &&
    //       (single.statuses.some(
    //         order => condition.showStatus.indexOf(order.status) > -1
    //       ) ||
    //         condition.showStatus.length === 0) &&
    //       !single.statuses.some(
    //         order => condition.hideStatus.indexOf(order.status) > -1
    //       ) &&
    //       condition.otherCondition(user, single) &&
    //       (condition.allowedRoles.length === 0 ||
    //       condition.allowedRoles.indexOf(role) > -1)
    //   )
    //   .map(item => item.label)
    //   this.setState({
    //     availableButtons
    //   })
    // }
  }


  UNSAFE_componentWillReceiveProps(nextProps) {
    if (Object.keys(nextProps.single).length > 0) {
      const { single } = nextProps;
      const { user } = this.state;

      const availableButtons = actionButtons
        .filter(
          condition =>
            condition.locked === single.locked &&
            Array.isArray(single.statuses) &&
            (single.statuses.some(
              order => condition.showStatus.indexOf(order.status) > -1
            ) ||
              condition.showStatus.length === 0) &&
            !single.statuses.some(
              order => condition.hideStatus.indexOf(order.status) > -1
            ) &&
            condition.otherCondition(user, single) &&
            (condition.allowedRoles.length === 0 ||
              condition.allowedRoles.indexOf(user.role) > -1)
        )
        .map(item => item.label);
          // single.statuses.some(item => console.log(item.status !== 'rated'))
          const obj = (
            single.passenger &&
            single.passenger._id === user._id &&
            single.statuses.some(item => item.status === 'ended') &&
            !single.statuses.some(item => item.status === 'rated')
          )
          console.log(obj)
          this.setState({ showedRateModal: obj})
      this.setState({
        availableButtons,
        showedEditButton:
          single.passenger &&
          user._id === single.passenger._id &&
          Array.isArray(single.statuses) &&
          single.statuses.some(item => item.status === 'created') &&
          single.statuses.some(
            (item, key) =>
              key === single.statuses.length - 1 && item.status === 'suspended'
          ) &&
          !single.statuses.some(
            item => ['approved', 'rejected'].indexOf(item.status) > -1
          ),
        // showedRateModal:
          // single.passenger &&
          // single.passenger._id === user._id &&
          // single.statuses.some(item => item.status === 'ended') &&
          // !single.statuses.some(item => item.status === 'rated')
      });
    }

    if (nextProps.reload) {
      this.props.getOrderDetail(this.props.orderId);
    }
  }

  // async UNSAFE_componentWillReceiveProps(nextProps) {
  //   const role = await AsyncStorage.getItem('role');
  //   if (Object.keys(nextProps.single).length > 0) {
  //     const { single } = nextProps;
  //     console.log(single)
  //     const { user } = this.state;
  //     const { allOrder } = this.props;
  //     const availableButtons = actionButtons
  //       .filter(
  //         condition =>
  //           // condition.locked === allOrder.locked &&
  //           condition.locked === allOrder.locked,
  //           // Array.isArray(allOrder.status) &&
  //           // (single.statuses.some(
  //           //   order => condition.showStatus.indexOf(order.status) > -1
  //           // ) ||
  //           //   condition.showStatus.length === 0) &&
  //           // !single.statuses.some(
  //           //   order => condition.hideStatus.indexOf(order.status) > -1
  //           // ) &&
  //           // condition.otherCondition(user, single) &&
  //           // (condition.allowedRoles.length === 0 ||
  //           //   condition.allowedRoles.indexOf(role) > -1)
  //       )
  //       .map(item => item.label);
        
  //     this.setState({
  //       availableButtons,
  //       showedEditButton:
  //         allOrder.passenger &&
  //         user._id === allOrder.passenger._id &&
  //         // Array.isArray(single.statuses) &&
  //         // single.statuses.some(item => item.status === 'created') &&
  //         // single.statuses.some(
  //         //   (item, key) =>
  //         //     key === single.statuses.length - 1 && item.status === 'suspended'
  //         // ) &&
  //         // !single.statuses.some(
  //         //   item => ['approved', 'rejected'].indexOf(item.status) > -1
  //         // ),
  //         Array.isArray(allOrder.status) &&
  //         // single.statuses.some(item => item.status === 'created') &&
  //         (allOrder.status === 'created') &&
  //         // single.statuses.some(
  //         //   (item, key) =>
  //         //     key === single.statuses.length - 1 && item.status === 'suspended'
  //         // ) &&
  //         (allOrder.status === 'suspended') &&
  //         // !single.statuses.some(
  //         //   item => ['approved', 'rejected'].indexOf(item.status) > -1
  //         ['approved', 'rejected'].indexOf(allOrder.status) > -1,
  //       showedRateModal:
  //         allOrder.passenger &&
  //         allOrder.passenger._id === user._id &&
  //         // allOrder.status === 'ended' && 
  //         // !allOrder.status === 'rated'
  //         single.statuses.some(item => item.status === 'ended') &&
  //         !single.statuses.some(item => item.status === 'rated')
  //     });
  //   }

  //   if (nextProps.reload) {
  //     this.props.getOrderDetail(this.props.orderId);
  //   }
  // }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.showedRateModal &&
      prevState.showedRateModal !== this.state.showedRateModal
    ) {
      const { single, allOrder } = this.props;
      Actions.ordercommand({
        commandType: 'rated',
        title: 'Rate order',
        commandContent: 'Please rate your experience from this order',
        commandSubmit: this.props.sendCommand,
        order: allOrder
      });
    }
  }

  componentWillUnmount() {
    this.props.onSingleUnload();
  }

  callDriver = phoneNumber => {
    while (phoneNumber.charAt(0) === '0') {
      phoneNumber = phoneNumber.substr(1); // eslint-disable-line no-param-reassign
    }
    phoneNumber = phoneNumber.replace('+62', ''); // eslint-disable-line no-param-reassign
    Linking.openURL(`tel:+62${phoneNumber}`);
  };

  _renderActionButton() {
    const { availableButtons } = this.state;
    const { single, allOrder } = this.props;
    if (!availableButtons || availableButtons.length === 0) {
      return null;
    }
    // console.log(availableButtons)

    const convertedButtons = availableButtons.map(button =>
      actionButtons.find(actionButton => actionButton.label === button)
    );
    const buttons = convertedButtons.map(button => (
      <Button
        key={uuidv4()}
        iconLeft
        transparent
        onPress={() => {
          this.modalAction.close();
          Actions.ordercommand({
            commandType: button.status,
            title: button.label,
            commandContent: button.content,
            commandSubmit: this.props.sendCommand,
            order: allOrder
          });
        }}
      >
        <Icon
          name={button.icon}
          style={{
            color: orderColor[button.status]
          }}
        />
        <Text
          style={{
            color: orderColor[button.status]
          }}
        >
          {button.label}
        </Text>
      </Button>
    ));

    return buttons;
  }

  _renderRightButton() {
    const { single, allOrder } = this.props;
    const { showedEditButton } = this.state;

    if (showedEditButton) {
      return (
        <Button
          transparent
          onPress={() => Actions.editorder({ orderId: allOrder._id })}
          style={{ paddingLeft: 0, paddingRight: 0, tintColor: 'black' }}
        >
          <Text style={navigationStyle.navbarProps.titleStyle}>Edit</Text>
        </Button>
      );
    }

    return (
      <Button
        transparent
        onPress={() => {
          this.props.getOrderDetail(allOrder._id);
        }}
      >
        <Icon name="refresh" style={{ color: this.props.tintColor }} />
      </Button>
    );
  }

  _renderChat() {
    const { single, allOrder } = this.props;
    const { user } = this.state
    let title;
    if (
      allOrder.passenger._id === user._id &&
      allOrder.driver &&
      allOrder.driver.name
    ) {
      title = allOrder.driver.name;
    } else if (
      allOrder.driver &&
      allOrder.driver._id === user._id &&
      allOrder.passenger &&
      allOrder.passenger.name
    ) {
      title = allOrder.passenger.name;
    }

    if (title) {
      return (
        <View style={{ flex: 1 }}>
          <Button
            iconLeft
            disabled
            light
            block
            onPress={() =>
              Actions.orderchat({
                orderId: allOrder._id,
                title
              })
            }
          >
            <Icon name="chatbox-outline" />
            <Text>Chat</Text>
          </Button>
        </View>
      );
    }
    return null;
  }

  render() {
    const { single, allOrder } = this.props;
    const { availableButtons, user } = this.state;
    const updatedAt = moment(allOrder.updateAt).format('MMMM Do YYYY, h:mm:ss a');

    return (
      <SafeAreaView>
        <Header style={navigationStyle.navbarProps.navigationBarStyle}>
          <Left style={{ flex: 0.5 }}>
            <BackButton iconStyle={{ color: 'black' }} />
          </Left>
          <Body style={{ flex: 1 }}>
            <Title style={navigationStyle.navbarProps.titleStyle}>
              Order Detail
            </Title>
            {allOrder.passenger && <Subtitle>{allOrder.passenger.name}</Subtitle>}
          </Body>
          <Right style={{ flex: 0.5 }}>{this._renderRightButton()}</Right>
        </Header>
        <Modal
          position="bottom"
          ref={_modalAction => {
            this.modalAction = _modalAction;
          }}
          style={{
            padding: 12,
            justifyContent: 'flex-start',
            alignItems: 'center',
            // height: 'auto',
            width: Dimensions.get('window').width,
            height: '40%',
            flexDirection: 'column'
          }}
          backButtonClose
        >
          <Text style={{ fontWeight: '500', marginVertical: 6 }}>
            Available command
          </Text>
          <View style={{ width: '100%' }}>{this._renderActionButton()}</View>
        </Modal>
        {Object.keys(allOrder).length > 0 ? (
          <ScrollView>
            <OrderDetailMap
              orderID={allOrder._id}
              routes={allOrder.routes}
              driver={allOrder.driver}
              user={user}
            />
            <View style={{ flex: 1, padding: 12 }}>
              {availableButtons.length > 0 && (
                <View>
                  <Button
                    block
                    iconLeft
                    dark
                    onPress={() => this.modalAction.open()}
                  >
                    <Icon name="ios-browsers-outline" />
                    <Text>Action</Text>
                  </Button>
                </View>
              )}
              {/* {single.statuses &&
                !single.statuses.some(item => item.status === 'rated') &&
                // {allOrder.status === 'rated' &&
                this._renderChat()
                } */}
              {allOrder.rating ? (
                <Card>
                  <CardItem header style={style.cardHeader}>
                    <Left>
                      <Text style={{ fontWeight: '600', marginLeft: 0 }}>
                        Rating
                      </Text>
                    </Left>
                    <Right>
                      {/* <StarRating
                        disabled
                        maxStars={5}
                        fullStarColor="yellow"
                        rating={single.rating}
                        emptyStar="ios-star-outline"
                        fullStar="ios-star"
                        iconSet="Ionicons"
                      /> */}
                      <View style={{backgroundColor: 'transparent'}}>
                        <Rating 
                          startingValue={allOrder.rating}
                          readonly
                          style={{borderColor: 'black'}}
                        />
                      </View>
                    </Right>
                  </CardItem>
                </Card>
              ) : (
                <View></View>
              )} 
              {allOrder.status && allOrder.status[allOrder.status.length - 1] && (
                <Card>
                  <CardItem header style={style.cardHeader}>
                    <Body>
                      <Text style={{ fontWeight: '600' }}>Last Status</Text>
                    </Body>
                    <Right style={{ marginTop: -2 }}>
                      <OrderBadge
                        name={
                          allOrder.status
                        }
                      />
                    </Right>
                  </CardItem>
                  <CardItem>
                    <Body>
                      <Text>
                        {
                          allOrder.company.description
                        }
                      </Text>
                      <Text note>
                        {allOrder.notes
                          ? `Notes: ${
                              allOrder.notes
                            }`
                          : ''}
                      </Text>
                      <Text note>
                        Last updated:{' '}
                        {updatedAt}
                      </Text>
                    </Body>
                  </CardItem>
                </Card>
              )}
              {allOrder.fleet && allOrder.driver && (
                <OrderFleetItem
                  single={allOrder}
                  callDriver={phone => this.callDriver(phone)}
                  style={style}
                  user={user}
                />
              )}
              <Card>
                <CardItem header style={style.cardHeader}>
                  <Text>Passenger Info</Text>
                </CardItem>
                <CardItem>
                  <Left style={{ flex: 0.3 }}>
                    <Text note style={{ marginLeft: 0 }}>
                      Passenger
                    </Text>
                  </Left>
                  <Body
                    style={{
                      flex: 0.7,
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                  >
                    <UserImage
                      user={allOrder.passenger}
                      mode="circle"
                      size="small"
                      styleContainer={{ marginRight: 6 }}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        if (
                          allOrder.passenger &&
                          allOrder.passenger.profile &&
                          allOrder.passenger.profile.phone
                        ) {
                          this.callDriver(allOrder.passenger.profile.phone);
                        }
                      }}
                      style={{ alignSelf: 'center' }}
                    >
                      <Text>{allOrder.passenger.name}</Text>
                      <Text note>
                        {allOrder.passenger.profile &&
                        allOrder.passenger.profile.phone
                          ? allOrder.passenger.profile.phone
                          : 'No phones found'}
                      </Text>
                      <Text note>
                        {allOrder.passenger.profile &&
                          allOrder.passenger.profile.phone &&
                          '(Tap to call)'}
                      </Text>
                    </TouchableOpacity>
                  </Body>
                </CardItem>
                <CardItem>
                  <Left style={{ flex: 0.3 }}>
                    <Text note style={{ marginLeft: 0 }}>
                      Notes
                    </Text>
                  </Left>
                  <Body style={{ flex: 0.7 }}>
                    <Text>{allOrder.notes || 'No notes found'}</Text>
                  </Body>
                </CardItem>
              </Card>
              <Card>
                <CardItem header style={style.cardHeader}>
                  <Text>Order Details</Text>
                </CardItem>
                {detailList.map(item => (
                  <DetailItem
                    key={`detail-item-${allOrder._id}-${item.index}`}
                    name={item.label}
                    value={get(allOrder, item.index)}
                  />
                ))}
              </Card>
            </View>
          </ScrollView>
        ) : (
          <Spinner />
        )}
      </SafeAreaView>
    );
  }
}

export default OrderDetailItem;
