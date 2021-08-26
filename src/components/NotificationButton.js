import React from 'react';
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Button, Icon, Text, Badge } from 'native-base';
import { Permissions } from 'expo';
import * as Notifications from 'expo-notifications';
import {
  NOTIFICATION_READ,
  NOTIFICATION_SHORT_LOAD
} from '../modules/constants/actions';
import request from '../modules/request';
import { listenEvent, removeEvent } from '../modules/socket';

class NotificationButton extends React.Component {
  componentDidMount() {
    listenEvent('send notification', data => {
      if (Platform.OS === 'ios') {
        this._incrementCounter();
      }
      this._popNotification(data);
      this.props.getShortNotification();
    });
  }

  componentWillUnmount() {
    removeEvent('send notification');
  }

  onPressButton = () => {
    this._readNotification();
  };

  _popNotification = async data => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );

    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return;
    }

    await Notifications.presentLocalNotificationAsync({
      title: data.title,
      body: data.content,
      ios: {
        sound: true
      },
      android: {
        sound: true,
        vibrate: true
      }
    });
  };

  // IOS only
  _incrementCounter = async () => {
    const { unread } = this.props;

    await Notifications.setBadgeNumberAsync(unread);
  };

  // Android only
  _readNotification = async () => {
    console.log("clicked")
    // if (Platform.OS === 'android') {
      // await Notifications.dismissNotificationsAsync();
      // this.props.readNotification();
    // }

    // this.props.readNotification();
    Actions.notification();
  };

  render() {
    const { unread, navigationState } = this.props;
    return (
      <Button
        badge={unread > 0}
        vertical
        // active={navigationState.index === 2}
        onPress={() => this.onPressButton()}
      >
        {unread > 0 && (
          <Badge>
            <Text>{unread}</Text>
          </Badge>
        )}
        <Icon
          name="ios-notifications-outline"
          // active={navigationState.index === 2}
        />
        <Text>Alert</Text>
      </Button>
    );
  }
}
const mapStateToProps = state => ({
  unread: state.notification.unread
});

const mapDispatchToProps = dispatch => ({
  readNotification: () =>
    dispatch({
      type: NOTIFICATION_READ,
      payload: request.notification.read()
    }),
  getShortNotification: () =>
    dispatch({
      type: NOTIFICATION_SHORT_LOAD,
      payload: request.notification.shortList()
    })
});

export default connect(mapStateToProps, mapDispatchToProps)(NotificationButton);
