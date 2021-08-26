import React from 'react';
import moment from 'moment';
import uuidv4 from 'uuid/v4';
import uuidv1 from 'uuid/v1';
import { StyleSheet, RefreshControl, View, Dimensions, FlatList } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Modal from 'react-native-modalbox';
import {
  Container,
  Tabs,
  Tab,
  Content,
  Card,
  CardItem,
  Body,
  Text,
  Button,
  Icon,
  Spinner,
  List,
  ListItem,
  Header,
  Title,
  Left,
  Right
} from 'native-base';
import OrderBadge from '../components/OrderBadge';
import BackButton from '../components/BackButton';
import FilterUtilization from '../components/FilterUtilization';

const style = StyleSheet.create({
  cardHeader: {
    backgroundColor: '#F0EFF5',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingTop: 10,
    paddingBottom: 10
  },
  cardHeaderText: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  containerNormal: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: -250,
    marginTop: -30,
    marginBottom: -30
  },
  miniContainer: {
    marginBottom: -250
  },
  modal: {
    backgroundColor: 'rgba(0,0,0,.8)',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  flexCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container1: {
    flex: 1
  }
});

export default class OrderUtilization extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      company: undefined,
      pool: undefined,
      page: 1,
      limit: 6,
      sortKey: '-',
      sortOrder: '-',
      loading: true,
      activeTab: 'Taken',
      filterDates: {
        from: moment().subtract(1, 'days'),
        to: moment()
      },
      refreshing: false,
      selectedOrder: {},
      orders: []
    };

    this.onFilterChange = this.onFilterChange.bind(this);
    this.onChangeTab = this.onChangeTab.bind(this);
    this.loadData = this.loadData.bind(this);
    this.refreshList = this.refreshList.bind(this);
  }

  componentWillMount() {
    this.loadData();
  }

  componentDidMount() {
    Actions.refresh({
      albumButton: this.renderAlbumButton()
    });
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.utilization &&
      nextProps.utilization.page === this.state.page
    ) {
      let { orders } = this.state;
      const concatOrders = nextProps.utilization.order.concat(orders);
      const uniqueIds = [];

      orders = concatOrders
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

      this.setState({ orders });
    }
  }

  // componentWillUnmount() {
  //   this.props.onFleetUnload();
  // }

  onFilterChange = (startDate, endDate, selectedComp, selectedPool) => {
    console.log(
      'onFilterChange',
      startDate,
      endDate,
      selectedComp,
      selectedPool
    );

    

    // const company = {
    //   id: selectedComp.selectedCompany,
    //   name: selectedComp.compName
    // };
    // const pool = { id: selectedPool.selectedPool, name: selectedPool.poolName };

    // this.setState(
    //   {
    //     startDate,
    //     endDate,
    //     company,
    //     pool
    //   },
    //   () => {
    //     this.loadData();
    //   }
    // );
  };

  onChangeTab(i) {
    let tab = null;
    switch (i) {
      case 0:
        tab = 'Taken';
        break;
      case 1:
        tab = 'Cancel';
        break;
      default:
        break;
    }
    this.setState(
      {
        activeTab: tab,
        loading: true
      },
      () => {
        this.loadData();
      }
    );
  }

  filterTag() {
    const { startDate, endDate, company, pool } = this.state;

    return (
      <Card>
        <CardItem header style={style.cardHeader}>
          <Text>Filter</Text>
        </CardItem>
        <CardItem style={{ flex: 1 }}>
          <Text>
            Date: {startDate} - {endDate}
          </Text>
        </CardItem>
        <CardItem style={{ flex: 1 }}>
          <Text>Company: {company.name}</Text>
        </CardItem>
        <CardItem style={{ flex: 1 }}>
          <Text>Pool: {pool.name}</Text>
        </CardItem>
      </Card>
    );
  }

  refreshList() {
    this.setState(
      {
        refreshing: true
      },
      () => {
        this.loadData();
      }
    );
  }

  _loadNextPage = () => {
    console.log('loadNextPage');
    const { page } = this.state;
    this.setState(
      {
        page: page + 1
      },
      () => {
        this.loadData();
      }
    );
  };

  _renderActionButton() {
    const { selectedOrder } = this.state;

    const convertedButtons = [
      {
        icon: 'eye',
        color: '#3b55e6',
        label: 'View Detail',
        action(order) {
          const orderId = order.item._id;
          const allOrder = order.item;
          Actions.orderdetail({ allOrder, orderId });
        }
      },
      {
        icon: 'map',
        color: '#3b55e6',
        label: 'View Fleet Movement',
        action(order) {
          Actions.fleetmovement({ order });
        }
      }
    ];

    const buttons = convertedButtons.map(button => (
      <Button
        key={uuidv4()}
        iconLeft
        transparent
        onPress={() => {
          this.modalAction.close();

          button.action(selectedOrder);
        }}
      >
        <Icon
          name={button.icon}
          style={{
            color: button.color
          }}
        />
        <Text
          style={{
            color: button.color
          }}
        >
          {button.label}
        </Text>
      </Button>
    ));

    return buttons;
  }

  _renderListOrder(utilization) {
    const { page, orders } = this.state;
    // let orders = utilization && utilization.order ? utilization.order : [];
    const totalPage =
      utilization && utilization.totalPage ? utilization.totalPage : page;
    const currPage = utilization && utilization.page ? utilization.page : 1;

    if (orders.length === 0) {
      return (
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
            <ListItem key={uuidv1()} last style={{ flexDirection: 'column' }}>
              <Text>Currently no Data in this category :(</Text>
            </ListItem>
          )}
          contentContainerStyle={{ backgroundColor: '#ffffff', flex: 1 }}
          keyExtractor={(item) => item.id}
        />
      );
    }

    // if (
    //   page > 1 &&
    //   page === currPage &&
    //   typeof prevUtilization === 'object' &&
    //   Object.keys(prevUtilization).length > 0 &&
    //   (prevUtilization.order && prevUtilization.order.length > 0)
    // ) {
    //   console.log('concatOrders', prevUtilization);
    //   const concatOrders = prevUtilization.order.concat(orders);
    //   const uniqueIds = [];

    //   orders = concatOrders
    //     .map(item => {
    //       if (uniqueIds.indexOf(item._id) < 0) {
    //         uniqueIds.push(item._id);
    //         return item;
    //       }
    //       return undefined;
    //     })
    //     .filter(i => i)
    //     .sort((a, b) => {
    //       const after = moment(a.updatedAt).isSameOrAfter(moment(b.updatedAt));
    //       return after ? -1 : 1;
    //     });
    // }

    // console.log(
    //   '_renderListOrder: page, currPage, orders ',
    //   page,
    //   currPage,
    //   orders
    // );

    return (
      <FlatList
        data={orders}
        onEndReached={() => {
          console.log('onEndReached', page, totalPage);
          if (page < totalPage) {
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
        renderItem={(item, index) => {
          return (
          <ListItem
            key={item._id}
            first={index === 0}
            last={index === orders.length - 1}
            onPress={() => {
              this.setState({ selectedOrder: item });
              this.modalAction.open();
            }}
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
        )}}
        contentContainerStyle={{ backgroundColor: '#ffffff' }}
      />
    );
  }

  loadData() {
    const {
      activeTab,
      page,
      limit,
      company,
      pool,
      sortKey,
      sortOrder,
      filterDates
    } = this.state;
    const { from, to } = filterDates;

    const q = {};
    if (company) {
      q.company = company;
      if (pool) q.pool = pool;
    }

    const query = {
      q,
      page,
      limit,
      sortKey,
      sortOrder,
      tab: activeTab,
      startDate: moment(from).format('YYYY-MM-DD HH:mm Z'),
      endDate: moment(to).format('YYYY-MM-DD HH:mm Z')
    };

    // console.log('loadData', query);

    this.setState(
      {
        loading: false
      },
      () => {
        this.props.getOrderUtilization(query);
      }
    );
  }

  goPickDateRange() {
    const { company, pool, startDate, endDate } = this.state;
    Actions.filterscene({
      onSubmit: this.onFilterChange,
      start: startDate,
      end: endDate,
      company,
      pool
    });
  }

  renderAlbumButton() {
    return (
      <Button
        transparent
        onPress={() => {
          this.goPickDateRange();
        }}
      >
        <Icon name="funnel" style={{ color: 'black' }} />
      </Button>
    );
  }

  render() {
    const { utilization } = this.props;

    // console.log('render', this.props);

    if (
      typeof utilization === 'object' &&
      Object.keys(utilization).length <= 0
    ) {
      return <Spinner />;
    }

    return (
      <Container>
        <Header>
          <Left style={{ flex: 0.5 }}>
            <BackButton iconStyle={{ color: 'black' }} />
          </Left>
          <Body style={{ flex: 1 }}>
            <Title>
              Order Utilization
            </Title>
          </Body>
          <Right style={{ flex: 0.5 }}>{this.renderAlbumButton()}</Right>
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
            height: 'auto',
            width: Dimensions.get('window').width,
            flexDirection: 'column'
          }}
          backButtonClose
        >
          <Text style={{ fontWeight: '500', marginVertical: 6 }}>
            Available Actions
          </Text>
          <View style={{ width: '100%' }}>{this._renderActionButton()}</View>
        </Modal>
        <Tabs onChangeTab={({ i }) => this.onChangeTab(i)} locked>
          <Tab heading="Taken Order">
            {this._renderListOrder(utilization)}
          </Tab>
          <Tab heading="Cancelled Order">
            {this._renderListOrder(utilization)}
          </Tab>
        </Tabs>
      </Container>
    );
  }
}
