import React, { Component } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Footer, Text, Button, Card, CardItem, Body, Title, Header, Left, Right } from 'native-base';
import BackButton from '../components/BackButton';
import MiniListPicker from '../components/MiniListPicker';
import DateRangePicker from '../components/DateRangePicker';

const style = StyleSheet.create({
  cardHeader: {
    backgroundColor: '#F0EFF5',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingTop: 10,
    paddingBottom: 10,
    justifyContent: 'center'
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

const SubmitCommand = ({ onCancelCommand, onSubmitCommand }) => (
  <View
    style={{
      flex: 1,
      flexDirection: 'row',
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      bottom: 0
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

export default class FilterScene extends Component {
  constructor(props) {
    super(props);

    const { start, end, company, pool } = props;

    this.state = {
      startDate: start || '',
      endDate: end || '',
      selectedCompany: company && company._id ? company._id : '-',
      selectedPool: pool && pool._id ? pool._id : '-',
      compName: company && company._id ? company.name : '-',
      poolName: pool && pool._id ? pool.name : '-'
    };

    this.onFilterChange = this.onFilterChange.bind(this);
    this.onSelectCompany = this.onSelectCompany.bind(this);
    this.onSelectPool = this.onSelectPool.bind(this);
  }

  onFilterChange = (startDate, endDate) => {
    this.setState({
      startDate,
      endDate
    });
  };

  onSelectCompany(value) {
    this.setState({
      selectedCompany: value && value._id ? value._id : '-',
      compName: value && value.name ? value.name : '-'
    });
  }

  onSelectPool(value) {
    this.setState({
      selectedPool: value && value._id ? value._id : '-',
      poolName: value && value.name ? value.name : '-'
    });
  }

  render() {
    const {
      startDate,
      endDate,
      selectedCompany,
      selectedPool,
      compName,
      poolName
    } = this.state;


    return (
      <View style={{ flex: 1 }}>
        <Header>
          <Left style={{ flex: 0.5 }}>
            <BackButton iconStyle={{ color: 'black' }} />
          </Left>
          <Body style={{ flex: 1 }}>
            <Title>
              Set Filter
            </Title>
          </Body>
          <Right style={{ flex: 0.5 }}><View></View></Right>
        </Header>
        <ScrollView style={{ paddingTop: 10, paddingBottom: 10 }}>
          <Card>
            <CardItem header style={style.cardHeader}>
              <Text>Filter Company / Pool</Text>
            </CardItem>
            <MiniListPicker
              name="company"
              placeholder="Select a company from the list"
              onSelect={this.onSelectCompany}
              initialValue={selectedCompany}
              reqName
              allowClear
            />
            {selectedCompany !== '-' && (
              <MiniListPicker
                name="pool"
                placeholder="Select a pool from the list"
                onSelect={this.onSelectPool}
                initialValue={selectedPool}
                query={{ company: selectedCompany }}
                reqName
                allowClear
              />
            )}
          </Card>
          <Card>
            <CardItem header style={style.cardHeader}>
              <Text>Set Daterange</Text>
            </CardItem>
            <CardItem style={{ justifyContent: 'center' }}>
              <DateRangePicker
                style={{ flex: 1 }}
                initialRange={[startDate, endDate]}
                onSuccess={this.onFilterChange}
                theme={{ markColor: 'blue', markTextColor: 'white' }}
              />
            </CardItem>
          </Card>
        </ScrollView>
        <View>
          <SubmitCommand
            onSubmitCommand={() => {
              this.props.onSubmit(
                startDate,
                endDate,
                { selectedCompany, compName },
                { selectedPool, poolName }
              );

              Actions.pop();
            }}
            onCancelCommand={() => Actions.pop()}
          />
        </View>
      </View>
    );
  }
}
