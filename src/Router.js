import React from 'react';
import { Router, Stack, Scene, Actions, Tabs } from 'react-native-router-flux';
import { StyleProvider, Root, Button, Icon } from 'native-base';
// import { Location } from 'expo';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import Notifications from 'expo-notifications';

import getTheme from '../native-base-theme/components';
import theme from '../native-base-theme/variables/commonColor';
import request from './modules/request';

/* Shared */
import HomeShared from './shared/Home';
import LoginShared from './shared/Login';
import AuthShared from './shared/Auth';
import OrderCreateShared from './shared/OrderCreate';
import OrderEditShared from './shared/OrderEdit';
import OrderChatShared from './shared/OrderChat';
import OrderOverviewShared from './shared/OrderOverview';
import OrderUtilizationShared from './shared/OrderUtilization';
import NotificationShared from './shared/Notification';
import FleetReportDetailShared from './shared/FleetReportDetail';
import FleetReportCreateShared from './shared/FleetReportCreate';
import FleetReportEditShared from './shared/FleetReportEdit';
import FleetShared from './shared/Fleet';
import UserShared from './shared/User';

/* Scene */
import HomeScene from './scenes/Home';
import LoginScene from './scenes/Login';
import NotificationScene from './scenes/Notification';
import SettingScene from './scenes/Settings';
import OrderCreateScene from './scenes/OrderCreate';
import OrderListScene from './scenes/Order';
import OrderDetailScene from './scenes/OrderDetail';
import OrderCommandScene from './scenes/OrderCommand';
import OrderHistoryScene from './scenes/OrderHistory';
import OrderEditScene from './scenes/OrderEdit';
import OrderChatScene from './scenes/OrderChat';
import FleetReportScene from './scenes/FleetReport';
import FleetReportDetailScene from './scenes/FleetReportDetail';
import FleetReportCreateScene from './scenes/FleetReportCreate';
import FleetReportEditScene from './scenes/FleetReportEdit';
import FleetMenuScene from './scenes/FleetMenus';
import FleetMonitoringScene from './scenes/FleetMonitoring';
import FleetMonitoringFilteringScene from './scenes/FleetMonitoringFilteringScene';
import FleetAnalysisScene from './scenes/FleetAnalysis';
import FilterSceneScene from './scenes/FilterScene';
import FleetUtilizationScene from './scenes/FleetUtilization';
import FleetAnalysis1Scene from './scenes/FleetAnalysis1';
import ModalImageScene from './scenes/ModalImage';
import UpdateProfileScene from './scenes/UpdateProfile';
import EditUserScene from './scenes/EditUser';
import OrderOverviewScene from './scenes/OrderOverview';
import OrderUtilizationScene from './scenes/OrderUtilization';
import FleetMovementScene from './scenes/FleetMovement';

import NavigationProps from './constants/navigation';
import BackButton from './components/BackButton';
import LayoutFooter from './components/LayoutFooter';
import { sendEvent } from './modules/socket';
import TabIcon from './components/TabIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TransparentButton = () => <Button transparent />;

class Route extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      user: null,
      role: ''
    }
  }

 async componentWillMount() {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      request.setToken(token);
    }
    // this.props.verifyToken(token ? request.auth.info() : null, token);
  }

  async componentDidMount() {
    this._unMountSubscription();
    const token = await AsyncStorage.getItem("token");
    const data = await AsyncStorage.getItem("user");
    const user = JSON.parse(data)
    const role = await AsyncStorage.getItem("role");
    if (token && user) {
      this._registerForPushNotificationsAsync();
      this._getLocationAsync(user);
      this.props.getShortNotification();
    }
    this.setState({ 
      token: token,
      user: user,
      role: role
    })
  }
  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.user) !== JSON.stringify(nextProps.user)) {
      this._unMountSubscription();
      if (nextProps.user && nextProps.token) {
        sendEvent('subscribe user', nextProps.user._id);
        sendEvent('user active', nextProps.user._id);
        this._registerForPushNotificationsAsync();
        this._getLocationAsync(nextProps.user);
        this.props.getShortNotification();
      }
    }

    if (!nextProps.token) {
      this.props.loggingOut();
    }
  }

  shouldComponentUpdate(nextProps) {
    if (
      JSON.stringify(nextProps.location) !== JSON.stringify(this.props.location)
    ) {
      return false;
    }

    if (nextProps.unread !== this.props.unread) {
      return false;
    }
    return true;
  }

  componentWillUnmount() {
    this._unMountSubscription();
  }

  _unMountSubscription = () => {
    if (this._notificationSubscription) {
      this._notificationSubscription.remove();
    }
    if (this._locationSubscription) {
      this._locationSubscription.remove();
    }
  };

  _registerForPushNotificationsAsync = async () => {
    try {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        return;
      }

      const token = await Notifications.getExpoPushTokenAsync();

      await request.auth.registerMobile(token);

      this._notificationSubscription = Notifications.addListener(
        this._onNotificationChange
      );
    } catch (error) {
      this._notificationSubscription = undefined;
    }
  };

  _getLocationAsync = async user => {
    try {
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        return;
      }

      if (user.role === 'driver') {
        this._locationSubscription = await Location.watchPositionAsync(
          {
            enableHighAccuracy: false,
            timeInterval: 1000 * 10, // 10second
            distanceInterval: 200 // 200meter
          },
          location => this._onLocationChange(location, user)
        );
      } else {
        const currentLocation = await Location.getCurrentPositionAsync({
          enableHighAccuracy: true
        });
        this._onLocationChange(currentLocation, user);
      }
    } catch (error) {
      this._locationSubscription = undefined;
    }
  };

  _onLocationChange = (location, user) => {
    this.props.setLocation({
      lat: location.coords.latitude,
      long: location.coords.longitude
    });

    sendEvent('user position', {
      _id: user._id,
      role: user.role,
      coordinates: [location.coords.longitude, location.coords.latitude]
    });
  };

  _onNotificationChange = async ({ origin, data }) => {
    if (origin === 'selected' && data) {
      await Notifications.dismissAllNotificationsAsync();
      const { type, _id } = data;

      if (type === 'Order') {
        Actions.orderdetail({ orderId: _id });
      } else if (type === 'OrderChat') {
        Actions.orderchat({ orderId: _id });
      }
    }

    /* const { unread } = this.props;

    if (Platform.OS === 'ios') {
      await Notifications.setBadgeNumberAsync(unread);
    }

    await Notifications.presentLocalNotificationAsync(data); */
  };

  render() {
    const { user, role } = this.state;

    return (
      <StyleProvider style={getTheme(theme)}>
        <Root>
          <Router hideNavBar>
            <Stack key="root" hideNavBar>
              <Scene
                initial
                key="home"
                title="Home"
                {...NavigationProps.navbarProps}
                component={HomeShared}
                UiComponent={HomeScene}
              />
              <Stack
                key="ordermenus"
                title="Orders"
                {...NavigationProps.navbarProps}
                hideNavBar
              >
                <Tabs
                  key="ordertabs"
                  lazy
                  swipeEnabled={false}
                  tabBarPosition="bottom"
                  tabBarComponent={props => (
                    <LayoutFooter user={user} {...props} />
                  )}
                >
                  <Scene
                    key="orderlist"
                    title="Orders"
                    icon={TabIcon}
                    // renderLeftButton={props => {
                    //   if (
                    //     (
                    //       role &&
                    //       [
                    //         'admin_super',
                    //         'admin_company',
                    //         'admin_pool',
                    //         'maintenancer',
                    //         'driver'
                    //       ].indexOf(role) > -1)
                    //   ) {
                    //     return <Button transparent />;
                    //   }
                    //   return (
                    //     <Button transparent onPress={() => Actions.addorder()}>
                    //       <Icon name="add" style={{ color: 'props.tintColor' }} />
                    //     </Button>
                    //   );
                    // }}
                    renderRightButton={props => (
                      <Button
                        transparent
                        onPress={() => Actions.orderhistory()}
                      >
                        <Icon name="time" style={{ color: 'black' }} />
                      </Button>
                    )}
                    {...NavigationProps.navbarProps}
                    onEnter={props => {
                      if (
                        user &&
                        user.role &&
                        user.role === 'maintenancer'
                      ) {
                        Actions.replace('fleetmenus');
                      } else {
                        Actions.refresh({
                          key: Math.random(),
                          user: user
                        });
                      }
                    }}
                    component={OrderListScene}
                    user={user}
                  />
                  <Scene
                    key="fleetmenus"
                    title="Utilization"
                    renderLeftButton={TransparentButton}
                    renderRightButton={TransparentButton}
                    {...NavigationProps.navbarProps}
                    component={FleetShared}
                    UiComponent={FleetMenuScene}
                  />
                  <Scene
                    key="notification"
                    title="Notifications"
                    renderLeftButton={TransparentButton}
                    renderRightButton={TransparentButton}
                    {...NavigationProps.navbarProps}
                    component={NotificationShared}
                    UiComponent={NotificationScene}
                  />
                  <Scene
                    key="settings"
                    title="Account Setting"
                    renderLeftButton={TransparentButton}
                    renderRightButton={TransparentButton}
                    {...NavigationProps.navbarProps}
                    component={AuthShared}
                    UiComponent={SettingScene}
                  />
                </Tabs>
                <Scene
                  key="updateprofile"
                  title="Update Profile"
                  hideTabBar
                  renderBackButton={props => (
                    <BackButton iconStyle={{ color: props.tintColor }} />
                  )}
                  renderRightButton={TransparentButton}
                  {...NavigationProps.navbarProps}
                  component={UserShared}
                  UiComponent={UpdateProfileScene}
                />
                <Scene
                  key="editUser"
                  title="Edit User"
                  hideTabBar
                  renderBackButton={props => (
                    <BackButton iconStyle={{ color: props.tintColor }} />
                  )}
                  renderRightButton={TransparentButton}
                  {...NavigationProps.navbarProps}
                  component={UserShared}
                  UiComponent={EditUserScene}
                />
                 <Scene
                  key="orderoverview"
                  title="Order Overview"
                  renderBackButton={props => (
                    <BackButton iconStyle={{ color: 'black' }} />
                  )}
                  renderRightButton={route => route.albumButton}
                  {...NavigationProps.navbarProps}
                  component={OrderOverviewShared}
                  UiComponent={OrderOverviewScene}
                />
                <Scene
                  key="orderutilization"
                  title="Order Utilization"
                  renderBackButton={props => (
                    <BackButton iconStyle={{ color: props.tintColor }} />
                    )}
                    renderRightButton={route => route.albumButton}
                    {...NavigationProps.navbarProps}
                    component={OrderUtilizationShared}
                    UiComponent={OrderUtilizationScene}
                />
                <Scene
                  key="fleetmovement"
                  title="Fleet Movement"
                  hideTabBar
                  hideNavBar
                  {...NavigationProps.navbarProps}
                  component={OrderUtilizationShared}
                  UiComponent={FleetMovementScene}
                  />
                <Scene
                  key="fleetmonitoring"
                  title="Fleet Monitoring"
                  renderBackButton={props => (
                    <BackButton iconStyle={{ color: props.tintColor }} />
                    )}
                    renderRightButton={route => route.albumButton}
                    {...NavigationProps.navbarProps}
                    component={HomeShared}
                    UiComponent={FleetMonitoringScene}
                    />
                <Scene
                  key="fleetmonitorfiltering"
                  title="Select Fleet for Monitoring"
                  renderBackButton={props => (
                    <BackButton iconStyle={{ color: props.tintColor }} />
                  )}
                  renderRightButton={TransparentButton}
                  {...NavigationProps.navbarProps}
                  component={HomeShared}
                  UiComponent={FleetMonitoringFilteringScene}
                />
                <Scene
                  key="fleetanalysis"
                  title="Fleet Analysis"
                  renderBackButton={props => (
                    <BackButton iconStyle={{ color: props.tintColor }} />
                  )}
                  renderRightButton={route => route.albumButton}
                  {...NavigationProps.navbarProps}
                  component={FleetShared}
                  UiComponent={FleetAnalysisScene}
                />
                <Scene
                  key="filterscene"
                  title="Set Filter"
                  hideTabBar
                  renderBackButton={props => (
                    <BackButton iconStyle={{ color: props.tintColor }} />
                  )}
                  renderRightButton={TransparentButton}
                  modal
                  {...NavigationProps.navbarProps}
                  component={HomeShared}
                  UiComponent={FilterSceneScene}
                />
                <Scene
                  key="fleetutilization"
                  title="Fleet Utilization"
                  renderBackButton={props => (
                    <BackButton iconStyle={{ color: props.tintColor }} />
                  )}
                  renderRightButton={route => route.albumButton}
                  {...NavigationProps.navbarProps}
                  component={FleetShared}
                  UiComponent={FleetUtilizationScene}
                />
                <Scene
                  key="fleetanalysis1"
                  title="Fleet Analysis"
                  renderBackButton={props => (
                    <BackButton iconStyle={{ color: props.tintColor }} />
                  )}
                  renderRightButton={route => route.albumButton}
                  {...NavigationProps.navbarProps}
                  component={FleetShared}
                  UiComponent={FleetAnalysis1Scene}
                />
                <Scene
                  key="reportlist"
                  title="Fleet Maintenance Report"
                  renderBackButton={props => (
                    <BackButton iconStyle={{ color: props.tintColor }} />
                  )}
                  renderRightButton={props => (
                    <Button transparent onPress={() => Actions.addreport()}>
                      <Icon name="add" style={{ color: props.tintColor }} />
                    </Button>
                  )}
                  {...NavigationProps.navbarProps}
                  component={FleetReportScene}
                  /> 
                <Scene
                  key="orderhistory"
                  title="Order History"
                  hideTabBar
                  renderBackButton={props => (
                    <BackButton iconStyle={{ color: props.tintColor }} />
                  )}
                  renderRightButton={TransparentButton}
                  {...NavigationProps.navbarProps}
                  component={OrderHistoryScene}
                />
                <Scene
                  key="addorder"
                  title="Create Order"
                  hideTabBar
                  renderBackButton={props => (
                    <BackButton iconStyle={{ color: props.tintColor }} />
                  )}
                  renderRightButton={TransparentButton}
                  {...NavigationProps.navbarProps}
                  component={OrderCreateShared}
                  UiComponent={OrderCreateScene}
                />
                <Scene
                  key="orderdetail"
                  title="Order Detail"
                  hideTabBar
                  hideNavBar
                  {...NavigationProps.navbarProps}
                  component={OrderDetailScene}
                  onEnter={props => {
                    Actions.refresh({
                      ...props,
                      key: Math.random()
                    });
                  }}
                  />
                <Scene
                  key="editorder"
                  title="Edit Order"
                  hideTabBar
                  renderBackButton={props => (
                    <BackButton iconStyle={{ color: props.tintColor }} />
                  )}
                  renderRightButton={TransparentButton}
                  {...NavigationProps.navbarProps}
                  modal
                  component={OrderEditShared}
                  UiComponent={OrderEditScene}
                />
                <Scene
                  key="ordercommand"
                  title="Order Command"
                  hideTabBar
                  renderBackButton={props => (
                    <BackButton iconStyle={{ color: props.tintColor }} />
                  )}
                  renderRightButton={TransparentButton}
                  modal
                  {...NavigationProps.navbarProps}
                  component={OrderCommandScene}
                />
                <Scene
                  key="orderchat"
                  title="Order Chat"
                  hideTabBar
                  renderBackButton={props => (
                    <BackButton iconStyle={{ color: props.tintColor }} />
                  )}
                  renderRightButton={TransparentButton}
                  modal
                  {...NavigationProps.navbarProps}
                  UiComponent={OrderChatScene}
                  component={OrderChatShared}
                />
                <Scene
                  key="reportdetail"
                  title="Report Detail"
                  hideNavBar
                  {...NavigationProps.navbarProps}
                  component={FleetReportDetailShared}
                  UiComponent={FleetReportDetailScene}
                />
                <Scene
                  key="editreport"
                  title="Edit Report"
                  renderBackButton={props => (
                    <BackButton iconStyle={{ color: props.tintColor }} />
                  )}
                  renderRightButton={TransparentButton}
                  {...NavigationProps.navbarProps}
                  component={FleetReportEditShared}
                  UiComponent={FleetReportEditScene}
                />
                <Scene
                  key="addreport"
                  title="Create report"
                  renderBackButton={props => (
                    <BackButton iconStyle={{ color: props.tintColor }} />
                  )}
                  renderRightButton={TransparentButton}
                  {...NavigationProps.navbarProps}
                  component={FleetReportCreateShared}
                  UiComponent={FleetReportCreateScene}
                />
                <Scene
                  key="openimage"
                  hideNavBar
                  hideTabBar
                  {...NavigationProps.navbarProps}
                  component={ModalImageScene}
                />
              </Stack>
              <Stack key="noauthmenus" hideNavBar>
                <Scene
                  key="login"
                  title="Login"
                  hideNavBar
                  {...NavigationProps.navbarProps}
                  component={LoginShared}
                  UiComponent={LoginScene}
                />
              </Stack>
            </Stack>
          </Router>
        </Root>
      </StyleProvider>
    );
  }
}

export default Route;