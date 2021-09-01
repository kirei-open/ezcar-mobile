import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import {
  Container,
  Subtitle,
  Header,
  Left,
  Right,
  Body,
  Title
} from 'native-base';

const style = StyleSheet.create({
  left: {
    flex: 0.5
  },
  right: {
    flex: 0.5
  },
  subtitle: {
    fontSize: 11
  }
});

class Layout extends Component {
  render() {
    const {
      enableHeader,
      enableSegment,
      enableTab,
      LeftComponent,
      RightComponent,
      title,
      subtitle,
      children
    } = this.props;
    console.log(subtitle)
    return (
      <View>
      </View>
    );
  }
}

export default Layout;