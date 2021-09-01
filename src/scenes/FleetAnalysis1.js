import React from 'react';
import moment from 'moment';
import { Actions } from 'react-native-router-flux';
import { Container, Tabs, Tab, Button, Icon, Spinner, Body, Header, Title, Left, Right } from 'native-base';

import FleetAnalysisGraph from '../components/FleetAnalysisGraph';
import FleetAnalysisGraph1 from '../components/FleetAnalysisGraph1';
import BackButton from '../components/BackButton';
import FilterUtilization from '../components/FilterUtilization';

export default class FleetAnalysis1 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startDate: moment()
        .startOf('day')
        .subtract(1, 'days')
        .format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
      activeTab: 'fleet-usage'
    };

    this.onFilterChange = this.onFilterChange.bind(this);
    this.onChangeTab = this.onChangeTab.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  componentWillMount() {
    const { startDate, endDate, activeTab } = this.state;

    const q = {};
    const query = {
      q,
      startDate: moment(startDate).format('YYYY-MM-DD HH:mm Z'),
      endDate: moment(endDate).format('YYYY-MM-DD HH:mm Z'),
      tab: activeTab
    };

    console.log('query', query);
    this.props.getFleetAnalysis1(query);
  }

  componentDidMount() {
    Actions.refresh({
      albumButton: this.renderAlbumButton()
    });
  }

  componentWillUnmount() {
    this.props.onFleetUnload();
  }

  onFilterChange = (startDate, endDate) => {
    const q = {};
    const query = {
      q,
      startDate: moment(startDate).format('YYYY-MM-DD HH:mm Z'),
      endDate: moment(endDate).format('YYYY-MM-DD HH:mm Z'),
      tab: 'flee-usage'
    };

    console.log('query', query);
    this.props.getFleetAnalysis1(query);
    this.setState({
      startDate,
      endDate
    });
  };

  onChangeTab(i) {
    let tab = null;
    switch (i) {
      case 0:
        tab = 'fleet-usage';
        break;
      case 1:
        tab = 'fleet-occupancy';
        break;
      case 2:
        tab = 'driver-works';
        break;
      case 3:
        tab = 'idle-fleet';
        break;
      case 4:
        tab = 'moving-fleet';
        break;
      default:
        break;
    }
    this.setState(
      {
        activeTab: tab
      },
      () => {
        this.loadData();
      }
    );
  }

  loadData() {
    const { activeTab, startDate, endDate } = this.state;
    const q = {};

    const query = {
      q,
      startDate: moment(startDate).format('YYYY-MM-DD HH:mm Z'),
      endDate: moment(endDate).format('YYYY-MM-DD HH:mm Z'),
      tab: activeTab
    };

    this.props.getFleetAnalysis1(query);
  }

  goPickDateRange() {
    const { startDate, endDate } = this.state;
    Actions.filterscene({
      onSubmit: this.onFilterChange,
      start: startDate,
      end: endDate
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
    const { analysis } = this.props;
    const {
      averageFleetGraph,
      filledChart,
      averageDriverGraph,
      averageFleetTimeGraph,
      averageDriverTimeGraph,
      filledTimeChart,
      idleFleetTimeGraph,
      dataDays,
      dataTime,
      active
    } = analysis;
    const { startDate, endDate, activeTab } = this.state;
    // console.log('activeTab', activeTab);
    // console.log('dataDays', dataDays);
    // console.log('dataTime', dataTime);
    return (
      <Container>
        <Header>
          <Left style={{ flex: 0.5 }}>
            <BackButton iconStyle={{ color: 'black' }} />
          </Left>
          <Body style={{ flex: 1 }}>
            <Title>
              Fleet Analysis
            </Title>
          </Body>
          <Right style={{ flex: 0.5 }}>{this.renderAlbumButton()}</Right>
        </Header>
        <Tabs onChangeTab={({ i, ref, from }) => this.onChangeTab(i)} locked>
          <Tab heading="By Ordered Fleet">
            <FleetAnalysisGraph
              title="Fleet Ordered Graph"
              used="usedFleet"
              ttl="totalFleet"
              name="Fleet(s) Used"
              unit=" unit(s)"
              total="Total Fleet"
              datas={dataDays}
              startDate={startDate}
              endDate={endDate}
              hourlyData={dataTime}
            />
          </Tab>
          <Tab heading="By Seat Occupancy">
            <FleetAnalysisGraph
              title="Seat Occupancy Graph"
              used="usedSeat"
              ttl="totalSeat"
              name="Seat(s) Used"
              unit=" seat(s)"
              total="Total Seat"
              datas={dataDays}
              startDate={startDate}
              endDate={endDate}
              hourlyData={dataTime}
            />
          </Tab>
          <Tab heading="By Working Drivers">
            <FleetAnalysisGraph
              title="Working Driver(s) Graph"
              used="usedDriver"
              ttl="totalDriver"
              name="Driver(s) Work(s)"
              unit=" driver(s)"
              total="Available Driver"
              datas={dataDays}
              startDate={startDate}
              endDate={endDate}
              hourlyData={dataTime}
            />
          </Tab>
          {/* <Tab heading="By Idle Fleet">
            <FleetAnalysisGraph1
              title="Idle Fleet Graph"
              used="idleFleet"
              ttl="totalFleet"
              name="Fleet(s) Idle"
              unit=" unit(s)"
              total="Total Fleet"
              datas={dataDays}
              startDate={startDate}
              endDate={endDate}
              hourlyData={dataTime}
            />
          </Tab> */}
        </Tabs>
      </Container>
    );
  }
}
