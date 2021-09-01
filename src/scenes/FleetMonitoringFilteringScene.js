import React, { Component } from 'react';
import { View } from 'react-native';
import CheckBox from 'react-native-check-box';
import { Actions } from 'react-native-router-flux';
import { Container, Text, Button, Body, Header, Title, Left, Right } from 'native-base';
import BackButton from '../components/BackButton';
import MiniListPicker from '../components/MiniListPicker';
import MultipleSelect from '../components/MultipleSelect';

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

class FleetMonitoringFilteringScene extends Component {
  constructor(props) {
    super(props);

    const { filter } = props;

    this.state = {
      selectedCompany: filter && filter.company ? filter.company : '-',
      selectedPool: filter && filter.pool ? filter.pool : '-',
      selectedRowKeys: [],
      selected:
        filter && filter.checkeds && filter.checkeds.length > 0
          ? filter.checkeds
          : []
    };

    this.loadFleetList = this.loadFleetList.bind(this);
    this.onSelectCompany = this.onSelectCompany.bind(this);
    this.onSelectPool = this.onSelectPool.bind(this);
    this.selectAll = this.selectAll.bind(this);
  }

  componentWillMount() {
    this.loadFleetList();
  }

  async onSelectCompany(value) {
    await this.setState({
      ...this.props.filter,
      selectedCompany: value
    });

    this.loadFleetList();
  }

  async onSelectPool(value) {
    await this.setState({
      ...this.props.filter,
      selectedPool: value
    });

    this.loadFleetList();
  }

  selectAll(checked) {
    if (checked) {
      // console.log('selectAll, reset');
      this.setState({ selected: 'resetAll' });
    } else {
      // console.log('selectAll, get keys');
      const { list } = this.props;
      const listId = list.fleet.map(item => item._id);

      this.setState({
        selected: listId,
        selectedRowKeys: listId
      });
    }
  }

  loadFleetList(value) {
    const { selectedCompany, selectedPool, selectedRowKeys } = this.state;
    const { list } = this.props;
    const q = { ...this.state.filter };

    if (selectedCompany !== '-') q.company = selectedCompany;
    if (selectedPool !== '-') q.pool = selectedPool;

    this.setState(() => {
      this.props.getFleetList({
        page: 1,
        limit: 9000,
        q,
        search: !value ? this.state.search : value
      });

      if (list.length === selectedRowKeys.length) {
        return { selectedRowKeys };
      }
      return { selectedRowKeys: [] };
    });
  }

  render() {
    const { list } = this.props;
    const {
      selectedCompany,
      selectedPool,
      selectedRowKeys,
      selected
    } = this.state;

    const dataList = {};
    let listId = [];
    if (list && list.fleet && list.fleet.length > 0) {
      listId = list.fleet.map(item => {
        dataList[item._id] = item.plateNumber;
        return item._id;
      });
    }

    const checked1 = JSON.stringify(selectedRowKeys) === JSON.stringify(listId); // select all

    return (
      <Container backgroundColor="white">
        <Header>
          <Left style={{ flex: 0.5 }}>
            <BackButton iconStyle={{ color: 'black' }} />
          </Left>
          <Body style={{ flex: 1 }}>
            <Title>
              Select Fleet for Monitoring
            </Title>
          </Body>
          <Right style={{ flex: 0.5 }}><Text></Text></Right>
        </Header>
        <MiniListPicker
          name="company"
          placeholder="Select a company from the list"
          onSelect={this.onSelectCompany}
          initialValue={selectedCompany}
          allowClear
        />
        {selectedCompany !== '-' && (
          <MiniListPicker
            name="pool"
            placeholder="Select a pool from the list"
            onSelect={this.onSelectPool}
            initialValue={selectedPool}
            query={{ company: selectedCompany }}
            allowClear
          />
        )}
        <View style={{ flexDirection: 'column' }}>
          <View style={{ flexDirection: 'row', marginLeft: 20 }}>
            <CheckBox
              style={{ flex: 1, padding: 15 }}
              isChecked={checked1}
              onClick={() => {
                this.selectAll(checked1);
              }}
              leftText={checked1 ? 'Unselect All' : 'Select All'}
            />
            {/* <Text style={{ marginTop: 5 }}>
              {checked1 ? 'Unselect All' : 'Select All'}
            </Text> */}
          </View>
        </View>
        <MultipleSelect
          options={dataList}
          search // should show search bar?
          multiple
          placeholder="Search"
          placeholderTextColor="#757575"
          returnValue="value" // label or value
          callback={res => {
            // console.log('callback', res);
            this.setState({ selectedRowKeys: res });
          }} // callback, array of selected items
          rowBackgroundColor="#eee"
          rowHeight={40}
          rowRadius={5}
          iconColor="#00a2dd"
          iconSize={30}
          selectedIconName="ios-checkmark-circle-outline"
          unselectedIconName="ios-radio-button-off-outline"
          scrollViewHeight={370}
          selected={selected} // list of options which are selected by default
        />
        <SubmitCommand
          onSubmitCommand={() => {
            this.props.onSubmit(selectedRowKeys);
            // console.log(this.props.onSubmit())

            this.props.setFleetFilter({
              ...this.props.filter,
              company: selectedCompany,
              pool: selectedPool,
              checkeds: selectedRowKeys
            });
            // console.log(selectedRowKeys)

            Actions.pop();
          }}
          onCancelCommand={() => Actions.pop()}
        />
      </Container>
    );
  }
}

export default FleetMonitoringFilteringScene;
