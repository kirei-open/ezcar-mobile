import React from 'react';
import {
  Body,
  Content,
  Container,
  Thumbnail,
  Text,
  Button,
  Icon,
  Form,
  Header,
  Item,
  Input,
  Spinner,
  Subtitle,
  Title,
  Toast
} from 'native-base';
import { View, StyleSheet, Image, Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const style = StyleSheet.create({
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'center',
    height: 150,
    width: '100%'
  },
  form: {
    marginTop: 20
  },
  formGroup: {
    marginBottom: 10
  }
});

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      identity: '',
      password: '',
      loading: false
    };
  }

  async componentDidMount() {
    const token = await AsyncStorage.getItem("token");
    const message = await AsyncStorage.getItem("message");
    console.log("token here " +token)
    if (token) {
      Actions.home();
      if (message) {
        Toast.show({
          text: message,
          position: 'top',
          buttonText: 'Close',
          duration: 2000
        });
      }
    }

  }

  componentWillUnmount() {
    this.props.onLoginUnload();
  }

  submitForm = async () => {
    const { identity, password } = this.state;
    const obj = {
      "identity": identity,
      "password": password
    }
    try {
      const url = 'https://apicar.eztruk.com/auth/login'
      const response = await axios.post(url, obj, {
        'Content-Type': 'application/json'
      })
      // storeToken(response.data.data.token);
      const token = response.data.data.token
      const user = response.data.data.user
      const role = response.data.data.user.role
      const message = response.data.data.message
      AsyncStorage.setItem('token', token)
      AsyncStorage.setItem('user', JSON.stringify(user));
      AsyncStorage.setItem('role', role);
      AsyncStorage.setItem('message', message);
      this.setState({ loading: true })
      Actions.home()
    } catch (error) {
      // console.log(error.response)
      // console.log(error.response.data.data.message)
      Alert.alert('Error', error.response.data.data.message);
    }
  };

  render() {
    const { loading } = this.state;
    const { loaded, subtitle } = this.props;
    // if (!loaded) {
    //   return <Spinner />;
    // }

    return (
      <View style={{backgroundColor: "#e9e9ef"}}>
        {!loaded ? (
          <View>
            <Image source={require('../../assets/logo.png')} style={style.imageContainer} />
            <Form style={style.form}>
              <Item regular style={style.formGroup}>
                <Icon active name="ios-person-outline" />
                <Input
                  autoCapitalize="none"
                  placeholder="Username or email"
                  value={this.state.identity}
                  onChangeText={identity => this.setState({ identity })}
                />
              </Item>
              <Item regular style={style.formGroup}>
                <Icon active name="lock-closed-outline" />
                <Input
                  secureTextEntry
                  placeholder="Password"
                  value={this.state.password}
                  onChangeText={password => this.setState({ password })}
                />  
              </Item>
            </Form>
            <Button block primary onPress={() => this.submitForm()}>
              {loading ? <Spinner color="white" /> : <Text>Login</Text>}
            </Button>
          </View>
        ) : (
          <Spinner />
        )}
      </View>
    );
  }
}

export default Login;