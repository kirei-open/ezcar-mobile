import React from 'react';
import { StyleSheet } from 'react-native';
import { Container, Content, Button, Text } from 'native-base';
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const style = StyleSheet.create({
  textLabel: {
    fontSize: 12,
    marginLeft: 0
  },
  textValue: {
    fontSize: 16,
    marginLeft: 0
  },
  cardHeader: {
    backgroundColor: '#F0EFF5',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingTop: 10,
    paddingBottom: 10
  },
  cardHeaderText: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  logout: {
    marginTop: 12,
    marginBottom: 20
  },
  thumbnailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12
  },
  thumbnailImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    marginRight: 10
  }
});

class FleetMenus extends React.Component {
  constructor() {
    super();
    this.state = {
      user: '',
      role: ''
    }
  }

  async componentDidMount() {
    const user = await AsyncStorage.getItem('user');
    const role = await AsyncStorage.getItem('role')
    this.setState({ user, role })
  }

  render() {
    const { user, role } = this.state;

    return (
      <Container>
        <>
          {
            ['maintenancer', 'admin_pool'].indexOf(role) > -1 && (
              <Button
                block
                primary
                style={style.logout}
                onPress={() => Actions.reportlist()}
              >
                <Text>Fleet Maintenance</Text>
              </Button>
            )}

          {
            ['admin_super', 'admin_company', 'admin_pool'].indexOf(role) >
              -1 && (
              <Button
                block
                primary
                style={style.logout}
                onPress={() => Actions.orderoverview()}
              >
                <Text>Order Overview</Text>
              </Button>
            )}

          {
            ['admin_super', 'admin_company', 'admin_pool'].indexOf(role) >
              -1 && (
              <Button
                block
                primary
                style={style.logout}
                onPress={() => Actions.orderutilization()}
              >
                <Text>Order Utilization</Text>
              </Button>
            )}

          {
            ['admin_super', 'admin_company', 'admin_pool'].indexOf(role) >
              -1 && (
              <Button
                block
                primary
                style={style.logout}
                onPress={() => Actions.fleetmonitoring()}
              >
                <Text>Fleet Monitoring</Text>
              </Button>
            )}

          {/* {user &&
            user.role &&
            ['admin_super', 'admin_company', 'admin_pool'].indexOf(user.role) >
              -1 && (
              <Button
                block
                primary
                style={style.logout}
                onPress={() => Actions.fleetanalysis()}
              >
                <Text>Fleet and Driver Analysis</Text>
              </Button>
            )} */}

          {
            ['admin_super', 'admin_company', 'admin_pool'].indexOf(role) >
              -1 && (
              <Button
                block
                primary
                style={style.logout}
                onPress={() => Actions.fleetanalysis1()}
              >
                <Text>Fleet Analysis</Text>
              </Button>
            )}

          {/* {user &&
            user.role &&
            ['admin_super', 'admin_company', 'admin_pool'].indexOf(user.role) >
              -1 && (
              <Button
                block
                primary
                style={style.logout}
                onPress={() => Actions.fleetutilization()}
              >
                <Text>Fleet Utilization</Text>
              </Button>
            )} */}
        </>
      </Container>
    );
  }
}

export default FleetMenus;
