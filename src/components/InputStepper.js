import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Icon, Text } from 'native-base';

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  content: {
    marginRight: 6
  }
});

class InputStepper extends Component {
  render() {
    const { onValueChange, value } = this.props;
    return (
      <View style={style.container}>
        <Button
          small
          bordered
          primary
          onPress={() => onValueChange(Number(value) - 1)}
          style={style.content}
        >
          <Icon name="remove" />
        </Button>
        <Text style={style.content}> {value} </Text>
        <Button
          small
          bordered
          primary
          onPress={() => onValueChange(Number(value) + 1)}
        >
          <Icon name="add" />
        </Button>
      </View>
    );
  }
}

export default InputStepper;
