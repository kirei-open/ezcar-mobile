import React from 'react';
import moment from 'moment';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
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
  Header,
  Title, 
  Left,
  Right
} from 'native-base';
import { VictoryPie, VictoryLegend } from 'victory-native';
import orderColor from '../constants/orderColor';
import { typeColor } from '../modules/constants/chart';
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

const typeStatus = [
  {
    _id: 'created',
    name: 'Created',
    icon: 'anticon anticon-edit',
    value: 0
  },
  {
    _id: 'switched',
    name: 'Switch PIC',
    icon: 'anticon anticon-team',
    value: 0
  },
  {
    _id: 'approved',
    name: 'Approved',
    icon: 'anticon anticon-check-circle-o',
    value: 0
  },
  {
    _id: 'edited',
    name: 'Edited',
    icon: 'anticon anticon-edit',
    value: 0
  },
  {
    _id: 'suspended',
    name: 'Suspended',
    icon: 'anticon anticon-form',
    value: 0
  },
  {
    _id: 'assigned',
    name: 'Assigned',
    icon: 'anticon anticon-idcard',
    value: 0
  },
  {
    _id: 'locked',
    name: 'Locked',
    icon: 'anticon anticon-lock',
    value: 0
  },
  {
    _id: 'started',
    name: 'Departed',
    icon: 'anticon anticon-export',
    value: 0
  },
  {
    _id: 'joined',
    name: 'Joined',
    icon: 'anticon anticon-user',
    value: 0
  },
  {
    _id: 'rated',
    name: 'Rated',
    icon: 'anticon anticon-star',
    value: 0
  },
  {
    _id: 'ended',
    name: 'Arrived',
    icon: 'anticon anticon-select',
    value: 0
  },
  {
    _id: 'cancelled',
    name: 'Cancelled',
    icon: 'anticon anticon-close-circle-o',
    value: 0
  },
  {
    _id: 'rejected',
    name: 'Rejected',
    icon: 'anticon anticon-close-circle-o',
    value: 0
  }
].filter(i => i);

/* eslint class-methods-use-this: ["error", { "exceptMethods": ["statusTag", "pieChartTag"] }] */
export default class OrderOverview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startDate: moment()
        .startOf('day')
        .subtract(30, 'days')
        .format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
      company: {},
      pool: {}
    };

    this.onFilterChange = this.onFilterChange.bind(this);
    this.onChangeTab = this.onChangeTab.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  componentWillMount() {
    this.loadData();
  }

  componentDidMount() {
    Actions.refresh({
      albumButton: this.renderAlbumButton()
    });
  }

  // componentWillUnmount() {
  //   this.props.onFleetUnload();
  // }

  onFilterChange = (startDate, endDate, selectedComp, selectedPool) => {
    // const q = {};
    // const query = {
    //   q,
    //   startDate: moment(startDate).format('YYYY-MM-DD HH:mm Z'),
    //   endDate: moment(endDate).format('YYYY-MM-DD HH:mm Z'),
    //   tab: 'flee-usage'
    // };

    // console.log('onFilterChange', query);
    console.log(
      'onFilterChange',
      startDate,
      endDate,
      selectedComp,
      selectedPool
    );

    const company = {
      id: selectedComp.selectedCompany,
      name: selectedComp.compName
    };
    const pool = { id: selectedPool.selectedPool, name: selectedPool.poolName };

    this.setState(
      {
        startDate,
        endDate,
        company,
        pool
      },
      () => {
        this.loadData();
      }
    );
  };

  onChangeTab(i) {
    let tab = null;
    switch (i) {
      case 0:
        tab = 'Overview';
        break;
      case 1:
        tab = 'Statusses';
        break;
      default:
        break;
    }
    this.setState(
      {
        activeTab: tab
      }
      // () => {
      //   this.loadData();
      // }
    );
  }

  statusTag(status) {
    return (
      <CardItem
        key={status._id}
        style={{ backgroundColor: orderColor[status._id] }}
      >
        <Body>
          <Text
            style={{
              color: '#ffffff',
              fontSize: 18,
              lineHeight: 22
            }}
          >
            {status.value} {status.name}
          </Text>
        </Body>
      </CardItem>
    );
  }

  pieChartTag(title, summary) {
    const datas = [];
    const labels = [];
    let sum = 0;
    summary.forEach(item => {
      sum += item.total ? item.total : 0;
    });

    summary
      .map((entry, index) => {
        const x = `${Number(((entry.total / sum) * 100).toFixed(0))}%`;
        const y = Number(entry.total.toFixed(0));

        const data = { x, y };
        const label = {
          name: entry.name ? entry.name : entry._id,
          symbol: { fill: typeColor[index] }
        };
        datas.push(data);
        labels.push(label);

        return entry;
      })
      .filter(item => item);

    return (
      <Card>
        <CardItem header style={style.cardHeader}>
          <Text>{title}</Text>
        </CardItem>
        <CardItem style={style.miniContainer}>
          <VictoryLegend x={5} y={5} orientation="horizontal" data={labels} />
        </CardItem>
        <CardItem style={style.container}>
          <VictoryPie
            style={{
              labels: {
                fill: 'white',
                stroke: 'none',
                fontSize: 12
              }
            }}
            labelRadius={50}
            data={datas}
            colorScale={typeColor}
          />
        </CardItem>
      </Card>
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

  loadData() {
    const { company, pool, startDate, endDate } = this.state;
    const q = {};

    if (company && company.id && company.id !== '-') q.company = company.id;
    if (pool && pool.id && pool.id !== '-') q.pool = pool.id;

    const query = {
      q,
      startDate: moment(startDate).format('YYYY-MM-DD HH:mm Z'),
      endDate: moment(endDate).format('YYYY-MM-DD HH:mm Z')
    };

    console.log('loadData', query);
    this.props.getOrderSummaries(query);
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
    const { summaries } = this.props;
    const {
      actualHours,
      actualStartHours,
      createdHours,
      createdToStartPeriod,
      estimationHours,
      filledSeats,
      ordersActuallyDepart,
      seats,
      shuttleOnly,
      // shuttleTrip,
      startHours,
      statuses,
      tripOnly
    } = summaries;

    console.log('render', this.props);

    if (statuses) {
      typeStatus.forEach(s => {
        const foundStatus = statuses.find(type => type._id === s._id);
        const item = s;
        if (foundStatus) {
          item.value = foundStatus.total;
        } else {
          item.value = 0;
        }
        return item;
      });
    }

    if (typeof summaries === 'object' && Object.keys(summaries).length <= 0) {
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
              Order Overview
            </Title>
          </Body>
          <Right style={{ flex: 0.5 }}>{this.renderAlbumButton()}</Right>
        </Header>
        <Tabs onChangeTab={({ i }) => this.onChangeTab(i)} locked>
          <Tab heading="Overview">
            <Container>
              <ScrollView>
                {this.filterTag()}
                {this.pieChartTag('Type', shuttleOnly)}
                {this.pieChartTag('Trip', tripOnly)}
                {this.pieChartTag('Order Created Time', createdHours)}
                {this.pieChartTag('Order Planned Start Time', startHours)}
                {this.pieChartTag(
                  'Order Created to Actually Start Periode',
                  createdToStartPeriod
                )}
                {this.pieChartTag('Order Actual Start Time', actualStartHours)}
                {this.pieChartTag('Estimation Hours', estimationHours)}
                {this.pieChartTag('Actual Hours per Order', actualHours)}
                {this.pieChartTag('Seat', seats)}
                {this.pieChartTag('Percentage of Seat Occupancy', filledSeats)}
                </ScrollView>
            </Container>
          </Tab>
          <Tab heading="Statusses">
            <Container>
              <ScrollView>
                {this.filterTag()}
                <Card>
                  <CardItem header style={style.cardHeader}>
                    <Text>In Approval</Text>
                  </CardItem>
                  {typeStatus.map(status => {
                    if (
                      [
                        'created',
                        'approved',
                        'edited',
                        'suspended',
                        'switched'
                      ].indexOf(status._id) > -1
                    ) {
                      return this.statusTag(status);
                    }

                    return null;
                  })}
                </Card>
                <Card>
                  <CardItem header style={style.cardHeader}>
                    <Text>On Progress</Text>
                  </CardItem>
                  {typeStatus.map(status => {
                    if (
                      ['assigned', 'locked', 'started', 'joined'].indexOf(
                        status._id
                      ) > -1
                    ) {
                      return this.statusTag(status);
                    }

                    return null;
                  })}
                </Card>
                <Card>
                  <CardItem header style={style.cardHeader}>
                    <Text>Ended</Text>
                  </CardItem>
                  {typeStatus.map(status => {
                    if (
                      ['rated', 'ended', 'cancelled', 'rejected'].indexOf(
                        status._id
                      ) > -1
                    ) {
                      return this.statusTag(status);
                    }

                    return null;
                  })}
                </Card>
                {this.pieChartTag(
                  'Percentage of Orders Actually Depart',
                  ordersActuallyDepart
                )}
              </ScrollView>
            </Container>
          </Tab>
        </Tabs>
      </Container>
    );
  }
}
