import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Container,
  Content,
  Card,
  CardItem,
  Body,
  Text,
  Button,
  Spinner
} from 'native-base';
import { Actions } from 'react-native-router-flux';
import UserImage from '../components/UserImage';
import { roleList } from '../modules/constants/acl';
import { sendEvent } from '../modules/socket';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mapProfile = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' }
];

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
  update: {
    marginTop: 12
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

class Settings extends React.Component {
  state = {
    loading: false,
    user: '',
  };

  async componentDidMount() {
    const user = await AsyncStorage.getItem("user");
    const data = JSON.parse(user)
    this.setState({user: data})
  }

  updateProfile = () => {
    Actions.updateprofile();
  };

  editUser = () => {
    Actions.editUser();
  };

  async removeToken() {
    // const token = await AsyncStorage.getItem('token')
    // const user = await AsyncStorage.getItem('user')
    // const role = await AsyncStorage.getItem('role')
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("role");
      return Actions.reset('noauthmenus');;
    } catch (exception) {
      return false;
    }
  }

  loggingOut = async () => {
    const { user } = this.state
    const { list } = this.props
    sendEvent('unsubscribe user', user._id);
    sendEvent('user inactive', user._id);
    this.setState(
      {
        loading: true
      }
    //   // () => {
    //     // this.props.onUserLogout();
        
    //     // Actions.reset('noauthmenus');
    //     // }
      );
        this.removeToken()  
  };

  render() {
    const { user } = this.state;
    return (
      <Container>
          <Body style={style.thumbnailContainer}>
            <UserImage
              user={user}
              mode="circle"
              size="large"
              styleContainer={style.thumbnailImage}
            />
          </Body>
          <Card>
            <CardItem header style={style.cardHeader}>
              <Body>
                <Text style={style.cardHeaderText}>PROFILE SETTINGS</Text>
              </Body>
            </CardItem>
            {Object.keys(user).length > 0 &&
              mapProfile.map((item, index) => (
                <CardItem key={item.key} last={index === mapProfile.length - 1}>
                  <Body>
                    <Text style={style.textLabel}>{item.label}</Text>
                    <Text style={style.textValue}>
                      {item.key === 'role'
                        ? roleList.find(role => role.key === user[item.key])
                            .title
                        : user[item.key]}
                    </Text>
                  </Body>
                </CardItem>
              ))}
          </Card>
          {/* <Button
            block
            primary
            style={style.update}
            onPress={() => this.updateProfile()}
          >
            {this.state.loading ? (
              <Spinner color="white" />
            ) : (
              <Text>Update Profile</Text>
            )}
          </Button>
          <Button
            block
            primary
            style={style.update}
            onPress={() => this.editUser()}
          >
            {this.state.loading ? (
              <Spinner color="white" />
            ) : (
              <Text>Edit User</Text>
            )}
          </Button> */}
          <Button
            block
            danger
            style={style.logout}
            onPress={() => this.loggingOut()}
          >
            {this.state.loading ? (
              <Spinner color="white" />
            ) : (
              <Text>Logout</Text>
            )}
          </Button>
      </Container>
    );
  }
}

export default Settings;
