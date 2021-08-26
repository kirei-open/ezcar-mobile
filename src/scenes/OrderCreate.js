import React, { Component } from 'react';
import { Alert, View } from 'react-native';
import { Container, Header, Body, Title, Left, Right } from 'native-base';
import { Actions } from 'react-native-router-flux';

import OrderForm from '../containers/OrderForm';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '../components/BackButton';
import axios from 'axios';

class OrderCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: ''
    }
    this.handleCreate = this.handleCreate.bind(this);
    this.searchPassenger = this.searchPassenger.bind(this);
  }

  async getUser() {
    const user = await AsyncStorage.getItem('user');
    const token = await AsyncStorage.getItem('token');
    const data = JSON.parse(user)
    this.setState({ user: data, token: token })
  }

  componentDidMount() {
    this.getUser()
    this.searchPassenger({
      limit: 5,
      q: {
        name: ''
      },
      page: 1
    });
  }

  handleCreate = async (value) => {
    // const { user, token } = this.state;
    const data = await AsyncStorage.getItem("user");
    const user = JSON.parse(data)
    if (user) {
      const embedUser = {
        ...value,
        passenger: user._id,
        division: user.division,
        company: user.company,
        createdBy: user._id // sebelumnya: value.userState._id
      };
      this.props.onOrderSubmit(embedUser);
      Actions.pop();
    }
  };

  searchPassenger(params) {
    this.props.onSearchPassenger(params);
  }

  render() {
    const { user } = this.state
    const { list } = this.props;
    return (
      <Container>
        <Header>
          <Left style={{ flex: 0.5 }}>
            <BackButton iconStyle={{ color: 'black' }} />
          </Left>
          <Body style={{ flex: 1 }}>
            <Title>
              Create Order
            </Title>
          </Body>
          <Right style={{ flex: 0.5 }}><View></View></Right>
        </Header>
        <OrderForm
          onFormSubmit={this.handleCreate}
          user={user}
          list={list}
          searchPassenger={this.searchPassenger}
        />
      </Container>
    );
  }
}

export default OrderCreate;
