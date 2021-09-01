import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Footer, FooterTab, Button, Icon, Text } from 'native-base';

import NotificationButton from './NotificationButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

const style = StyleSheet.create({
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: '#eeeeee'
  },
  textMaint: {
    fontSize: 8
  }
});

class LayoutFooter extends Component {
  constructor() {
    super()
    this.state = {
      user: '',
      role: ''
    }
  }

  async componentDidMount() {
    const data = await AsyncStorage.getItem('user');
    const user = JSON.parse(data)
    const role = await AsyncStorage.getItem('role');
    this.setState({ user, role })
  }
  

  render() {
    const { user, role } = this.state;

    return (
      <Footer>
        <FooterTab style={style.borderTop}>
          {role !== 'maintenancer' && (
            <Button
              vertical
              // active={this.props.navigationState.index === 0}
              onPress={() => Actions.orderlist({ user })}
            >
              <Icon
                name="ios-list"
                // active={this.props.navigationState.index === 0}
              />
              <Text>Orders</Text>
            </Button>
          )}

          {/* {user &&
            role &&
            ['driver', 'admin_division', 'approver', 'passenger'].indexOf(
              role
            ) < 0 && (  */}
            {['driver', 'admin_division'].indexOf(role) < 0 && (
              <Button
                vertical
                // active={this.props.navigationState.index === 1}
                onPress={() => Actions.fleetmenus()}
              >
                <Icon
                  name="cog"
                  // active={this.props.navigationState.index === 1}
                />
                <Text>Utils</Text>
              </Button>
            )} 
          <NotificationButton />
          <Button
            vertical
            // active={this.props.navigationState.index === 3}
            onPress={() => Actions.settings()}
          >
            <Icon
              name="ios-person-outline"
              // active={this.props.navigationState.index === 3}
            />
            <Text>Accounts</Text>
          </Button>
        </FooterTab>
      </Footer>
    );
  }
}

export default LayoutFooter;