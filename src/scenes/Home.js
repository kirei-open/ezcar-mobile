import React, { Component, createContext } from 'react';
import { Actions } from 'react-native-router-flux';
import { ActionSheet, Container, Content, Spinner } from 'native-base';
import isEmpty from 'lodash/isEmpty';
// import { DangerZone } from 'expo';
import LottieView from 'lottie-react-native';
import { View, Text, StyleSheet, Alert } from 'react-native';
import truck from '../../assets/json/truck.json';
import Login from '../scenes/Login';
import Order from '../scenes/Order';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

class Home extends Component {
  constructor() {
    super();
    this.state = {
      token: null
    }
  }

  async getToken() {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token !== null) {
        Actions.reset('ordermenus');
      } else {
        Actions.reset('noauthmenus');
      }
    } catch (err) {
      console.log(err)
    }
  }

  componentDidMount() {
    this.getToken()
    if (this.animation) {
      this.animation.play();
    }
  }

  render() {
    return (
      <View style={styles.animationContainer}>
          {/* {!loaded ? ( */}
            <LottieView 
              ref={animation => {
                this.animation = animation;
              }}
              style={{
                width: 200,
                height: 200,
                backgroundColor: '#eee'
              }}
              source={truck}
            />
          {/* ) : (
            <Spinner />
          )} */}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  animationContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});

export default Home;
