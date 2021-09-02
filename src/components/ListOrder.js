import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Content,
  List,
  ListItem,
  Body,
  Text,
  Spinner,
  Button
} from 'native-base';
import uuidv1 from 'uuid/v1';
import moment from 'moment';
import axios from 'axios';
// import 'moment/locale/id';
import { View, RefreshControl, FlatList, SafeAreaView, ScrollView } from 'react-native';
import { Actions } from 'react-native-router-flux';

import OrderBadge from '../components/OrderBadge';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ListOrder extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
        role: '',
        user: '',
        token: '',
        page: 1,
        refreshing: false,
        fetching: true,
        orders: []
    };

    this.refreshList = this.refreshList.bind(this);
    this._loadOrderList = this._loadOrderList.bind(this);
  }

    async store() {
        const token = await AsyncStorage.getItem("token")
        const data = await AsyncStorage.getItem("user")
        const user = JSON.parse(data)
        const role = await AsyncStorage.getItem("role")
        this.setState({ user, role, token })
    }

  componentDidMount() {
    this.store();
    this._loadOrderList();
  }

  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.list === 'object' && this.state.fetching) {
      this._appendList(nextProps);
    }
  }

  refreshList() {
    this.setState(
      {
        refreshing: true,
        fetching: true
      },
      () => {
        this._loadOrderList();
      }
    );
  }

  _loadNextPage = () => {
    const { fetching } = this.state;
    if (!fetching) {
      this.setState(
        {
          fetching: true
        },
        () => {
          this._loadOrderList({ page: this.state.page + 1 });
        }
      );
    }
  };

  _loadOrderList = (options = {}) => {
    const { refreshing, token } = this.state;
    const { listCheckType, listLimit, listSort, list } = this.props;
    const { totalPage } = list;

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
        page: refreshing ? 1 : options.page,
        sort: listSort,
        limit: listLimit,
        checkType: listCheckType
      };
      const url = 'https://apicar.eztruk.com/order?page='+queryList.page+'&limit='+queryList.limit+'&q=&sort='+queryList.sort+'&checkType='+queryList.checkType
      this.getListOrder(url);
      // this.props.getOrderList(queryList);
    } else {
      this.setState({
        refreshing: false,
        fetching: false
      });
    }
  };

  async getListOrder(url) {
    const token = await AsyncStorage.getItem("token")
    // console.log(token)
    try {
      const listOrder = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const orders = listOrder.data.data.order
      this.setState({ orders })
    } catch (err) {
      this.setState({ orders: []})
      console.log(err.response)
    }
  }

  _appendList = nextProps => {
    const { orders } = this.state;
    const { order, page, totalPage, count } = nextProps.list;
    // console.log(nextProps.list)

    if (page <= totalPage) {
      let concatOrders = [];
      if (page === 1 && count < orders.length) {
        concatOrders = order;
      } else {
        concatOrders = order.concat(orders);
      }
      const uniqueIds = [];
      const newOrders = concatOrders
        .map(item => {
          if (uniqueIds.indexOf(item._id) < 0) {
            uniqueIds.push(item._id);
            return item;
          }
          return undefined;
        })
        .filter(i => i)
        .sort((a, b) => {
          const after = moment(a.updatedAt).isSameOrAfter(moment(b.updatedAt));
          return after ? -1 : 1;
        });

      if (this.state.refreshing) {
        this.setState({
          orders: newOrders,
          fetching: false,
          refreshing: false,
          page
        });
      } else {
        this.setState({
          orders: newOrders,
          fetching: false,
          page
        });
      }
    } else {
      this.setState({
        fetching: false,
        refreshing: false
      });
    }
  };

  render() {
    const { orders, fetching, user, role } = this.state;
    // const { user } = this.props;

    let currentOrderTitle = '';
    if (this.props.listCheckType === 'historyOrder') {
      currentOrderTitle = 'history order found';
    } else if (this.props.listCheckType === 'ongoingOrder') {
      currentOrderTitle = 'ongoing order found';
    } else if (this.props.listCheckType === 'join') {
      currentOrderTitle = 'nearby order to join';
    }

    return (
      <ScrollView>
        {orders.length === 0 ? (
          <>
            {/* {fetching ? (
              <Spinner />
            ) : ( */}
                <FlatList 
                    data={['1']}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={() => this.refreshList()}
                            tintColor="#3369e7"
                        />
                    }
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={() => (
                        <ListItem
                            key={uuidv1()}
                            last
                            style={{ flexDirection: 'column' }}
                        >
                            <Text>Currently no {currentOrderTitle} :(</Text>
                            {['driver', 'admin_pool', 'maintenancer'].indexOf(
                            user.role
                            ) < 0 && (
                            <View style={{ padding: 12 }}>
                                <Button primary onPress={() => Actions.addorder()}>
                                <Text>Create Order</Text>
                                </Button>
                            </View>
                            )}
                        </ListItem>
                        )}
                        contentContainerStyle={{ backgroundColor: '#ffffff', flex: 1 }}
                />
            {/* )} */}
          </>
        ) : (
            <FlatList 
                data={orders}
                onEndReached={() => {
                    if (orders.length > 5) {
                        this._loadNextPage();
                    }
                    }}
                    onEndReachedThreshold={0.1}
                    refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={() => this.refreshList()}
                        tintColor="#3369e7"
                    />
                }
                keyExtractor={(item, index) => index.toString()}
                renderItem={(item, index) => (
                    <ListItem
                        key={item.item._id}
                        first={index === 0}
                        last={index === orders.length - 1}
                        onPress={() => Actions.orderdetail({ orderId: item.item._id, allOrder: item.item })}
                    >
                        <Body>
                        <Text>
                            {item.item.shuttle} - {item.item.trip}
                        </Text>
                        <Text note>Pickup Time: {item.item.pickupTime}</Text>
                        <Text note>Drop Time: {item.item.dropTime}</Text>
                        <Text note style={{ marginBottom: 6 }}>
                            Estimation Hour: {item.item.estimationHour}{' '}
                            {item.item.estimationHour > 1 ? 'hours' : 'hour'}
                        </Text>
                        <View style={{ paddingLeft: 12 }}>
                            <OrderBadge name={item.item.status} />
                        </View>
                        </Body>
                    </ListItem>
                )}
                contentContainerStyle={{ backgroundColor: '#ffffff' }}
            />
        //   <List
        //     dataArray={orders}
        //     onEndReached={() => {
        //       if (orders.length > 5) {
        //         this._loadNextPage();
        //       }
        //     }}
        //     onEndReachedThreshold={0.1}
        //     refreshControl={
        //       <RefreshControl
        //         refreshing={this.state.refreshing}
        //         onRefresh={() => this.refreshList()}
        //         tintColor="#3369e7"
        //       />
        //     }
        //     renderRow={(item, index) => (
        //       <ListItem
        //         key={item._id}
        //         first={index === 0}
        //         last={index === orders.length - 1}
        //         onPress={() => Actions.orderdetail({ orderId: item._id })}
        //       >
        //         <Body>
        //           <Text>
        //             {item.shuttle} - {item.trip}
        //           </Text>
        //           <Text note>Pickup Time: {item.pickupTime}</Text>
        //           <Text note>Drop Time: {item.dropTime}</Text>
        //           <Text note style={{ marginBottom: 6 }}>
        //             Estimation Hour: {item.estimationHour}{' '}
        //             {item.estimationHour > 1 ? 'hours' : 'hour'}
        //           </Text>
        //           <View style={{ paddingLeft: 12 }}>
        //             <OrderBadge name={item.status} />
        //           </View>
        //         </Body>
        //       </ListItem>
        //     )}
        //     contentContainerStyle={{ backgroundColor: '#ffffff' }}
        //   />
        )}
      </ScrollView>
    );
  }
}

ListOrder.propTypes = {
  listLimit: PropTypes.number,
  listSort: PropTypes.string,
  listCheckType: PropTypes.oneOf(['ongoingOrder', 'historyOrder', 'join']),
  list: PropTypes.shape({}),
  getOrderList: PropTypes.func.isRequired,
  user: PropTypes.shape({})
};

ListOrder.defaultProps = {
  listLimit: 6,
  listSort: '-updatedAt',
  listCheckType: 'ongoingOrder',
  list: {},
  user: null
};

export default ListOrder;