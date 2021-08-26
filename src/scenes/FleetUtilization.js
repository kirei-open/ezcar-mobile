import React from 'react';
import moment from 'moment';
import { Actions } from 'react-native-router-flux';
import { StyleSheet, View } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import {
  Container,
  Tabs,
  Tab,
  Button,
  Icon,
  Content,
  Card,
  CardItem,
  Body,
  Text
} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6 }
});

export default class FleetAnalysis extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: '',
      startDate: moment()
        .subtract(1, 'days')
        .format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
      tableHead: ['Head', 'Head2', 'Head3', 'Head4'],
      tableData: [
        ['1', '2', '3', '4'],
        ['a', 'b', 'c', 'd'],
        ['1', '2', '3', '456\n789'],
        ['a', 'b', 'c', 'd']
      ]
    };

    this.onFilterChange = this.onFilterChange.bind(this);
    this.loadData = this.loadData.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  componentWillMount() {
    this.loadData();
  }

  async getUser() {
    const data = await AsyncStorage.getItem("user");
    const user = JSON.parse(data);
    this.setState({ user })
  }

  componentDidMount() {
    this.getUser()
    Actions.refresh({
      albumButton: this.renderAlbumButton()
    });
  }

  componentWillUnmount() {
    this.props.onFleetUnload();
  }

  onFilterChange = (startDate, endDate) => {
    // this.props.getFleetAnalysis({
    //   startDate,
    //   endDate
    // });
    this.loadData();

    this.setState({
      startDate,
      endDate
    });
  };

  getTableColumns(activeTab) {
    let columns = [];
    if (activeTab === 'Driver') {
      columns = [
        'Driver',
        'Driving Time',
        'Driving Distance',
        'Driving Fuel',
        'Order Taken',
        'Order Cancelled/Rejected',
        'Average Time/Order',
        'Average Distance/Order',
        'Average Fuel/Order',
        'Average Response Time',
        'Total Rating'
      ];
    }
    if (activeTab === 'Vehicle') {
      columns = [
        'Plate Number',
        'Idle Time',
        'Drived Time (GPS)',
        'Drived Time (Input Driver)',
        'Km/L (Click to Edit)',
        'Driving Fuel',
        'Remaining Fuel',
        'Mileage (GPS)',
        'Mileage (Input Driver)',
        'Total Accident',
        'Total Maintenance',
        'Order Taken',
        'Order Cancelled/Rejected',
        'Average Occupancy'
      ];
    }
    if (activeTab === 'Pool' || activeTab === 'DriverIssue') {
      columns = ['No', 'Comparation Point'];
    }

    const modifiedColumns = columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave
        })
      };
    });

    return modifiedColumns;
  }

  loadData() {
    const { startDate, endDate, user } = this.state;
    // const { user } = this.props;

    const q = {};

    if (
      user &&
      user.role &&
      ['admin_company', 'admin_pool'].indexOf(user.role) > -1
    ) {
      q.company = user.company;
      if (['admin_pool'].indexOf(user.role) > -1) q.pool = user.pool;
    }

    const query = {
      q,
      startDate: moment(startDate).format('YYYY-MM-DD HH:mm Z'),
      endDate: moment(endDate).format('YYYY-MM-DD HH:mm Z')
    };

    this.props.getFleetUtilization(query);
  }

  renderAlbumButton() {
    return (
      <Button
        transparent
        onPress={() => {
          this.goPickDateRange();
        }}
      >
        <Icon name="time" style={{ color: this.props.tintColor }} />
      </Button>
    );
  }

  render() {
    const {
      page,
      limit,
      loading,
      activeTab,
      company,
      pool,
      listPool,
      filterDates,
      datas
    } = this.state;
    const { utilization } = this.props;
    const { /* datas, */ count } = utilization;
    const { tableHead, tableData } = this.state;

    console.log('render', datas);
    const data = [1, 2, 3, 4, 5];

    return (
      <Container>
        <Tabs locked>
          <Tab heading="Vehicle">
            <Container>
              <Content padder>
                <Card>
                  <View style={styles.container}>
                    <Table
                      borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}
                    >
                      <Row
                        data={this.getTableColumns('Vehicle')}
                        style={styles.head}
                        textStyle={styles.text}
                      />
                      <Rows data={tableData} textStyle={styles.text} />
                    </Table>
                  </View>
                </Card>
              </Content>
            </Container>
          </Tab>
          <Tab heading="Driver">
            <Container>
              <Content padder />
            </Container>
          </Tab>
          <Tab heading="Pool Comparison">Pool Comparison</Tab>
          <Tab heading="Driver Input Issues">Driver Input Issues</Tab>
        </Tabs>
      </Container>
    );
  }
}
