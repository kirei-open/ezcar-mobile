import React from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import {
  Container,
  Content,
  List,
  ListItem,
  Text,
  Spinner,
  Left,
  Body
} from 'native-base';
import { Actions } from 'react-native-router-flux';
import moment from 'moment';
// import 'moment/locale/id';

import OrderThumbnail from '../components/OrderThumbnail';

class Notification extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      fetching: true,
      refreshing: false,
      notifications: []
    };

    this.refreshList = this.refreshList.bind(this);
    this._loadNotification = this._loadNotification.bind(this);
  }

  componentDidMount() {
    this._loadNotification();
  }

  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.notifications === 'object' && this.state.fetching) {
      const { notifications } = this.state;
      const { longList, page, totalPage } = nextProps.notifications;

      if (page <= totalPage) {
        const concatNotifs = notifications.concat(longList);
        const uniqueIds = [];
        const newNotifs = concatNotifs
          .map(item => {
            if (uniqueIds.indexOf(item._id) < 0) {
              uniqueIds.push(item._id);
              return item;
            }
            return undefined;
          })
          .filter(item => item);

        if (this.state.refreshing) {
          this.setState({
            notifications: newNotifs,
            fetching: false,
            refreshing: false,
            page
          });
        } else {
          this.setState({
            notifications: newNotifs,
            fetching: false,
            page
          });
        }
      } else {
        this.setState({
          fetching: false
        });
      }
    }
  }

  refreshList = () => {
    this.setState(
      {
        fetching: true,
        refreshing: true
      },
      () => {
        this._loadNotification();
      }
    );
  };

  _loadNextPage = () => {
    const { fetching } = this.state;

    if (!fetching) {
      this.setState(
        {
          fetching: true
        },
        () => {
          this._loadNotification({ page: this.state.page + 1 });
        }
      );
    }
  };

  _loadNotification = (options = {}) => {
    const { refreshing } = this.state;
    const { notifications } = this.props;
    const { totalPage } = notifications;

    options.page = options.page || this.state.page;

    let allowed = true;
    if (totalPage && totalPage > 0) {
      if (refreshing) {
        allowed = totalPage >= 1;
      } else {
        allowed = totalPage >= options.page;
      }
    }

    if (allowed) {
      const queryList = {
        page: refreshing ? 1 : options.page
      };

      this.props.onMount(queryList);
    } else {
      this.setState({
        refreshing: false,
        fetching: false
      });
    }
  };

  render() {
    const { notifications, fetching } = this.state;

    return (
      <Container>
        <View>
          {notifications.length === 0 ? (
            <View>
              {!fetching ? (
                <FlatList
                  data={['1']}
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={() => this.refreshList()}
                      tintColor="#3369e7"
                    />
                  }
                  renderItem={() => (
                    <ListItem
                      key="no-notifications-found"
                      last
                      style={{ flexDirection: 'column' }}
                    >
                      <Text>You have no notification</Text>
                    </ListItem>
                  )}
                  contentContainerStyle={{
                    backgroundColor: '#ffffff',
                    flex: 1
                  }}
                />
              ) : (
                <Spinner />
              )}
            </View>
          ) : (
            <FlatList
              data={notifications}
              contentContainerStyle={{ backgroundColor: '#ffffff' }}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={() => this.refreshList()}
                  tintColor="#3369e7"
                />
              }
              renderItem={(item, index) => (
                <ListItem
                  key={item.item._id}
                  avatar
                  last={index === notifications.length - 1}
                  onPress={() => {
                    if (item.item.reference) {
                      if (item.item.attached === 'Order') {
                        console.log(item.item.reference._id)
                        console.log(item.item._id)
                        // Actions.orderdetail({
                        //   orderId: item.item.reference._id
                        // });
                      }
                    }
                  }}
                >
                  <Left style={{ flex: 0.1 }}>
                    <OrderThumbnail name={item.item.type} />
                  </Left>
                  <Body>
                    <Text>{item.item.title}</Text>
                    <Text note>{item.item.content}</Text>
                    <Text note>{moment(item.item.createdAt).fromNow()}</Text>
                  </Body>
                </ListItem>
              )}
            />
          )}
        </View>
      </Container>
    );
  }
}

export default Notification;
