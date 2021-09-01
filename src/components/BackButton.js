import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { Button, Icon } from 'native-base';
import { SafeAreaView } from 'react-native';

class BackButton extends Component {
  render() {
    const { onBackPress, iconStyle } = this.props;

    return (
      <>
        <Button
          transparent
          onPress={() => {
            if (onBackPress) {
              onBackPress();
            } else {
              Actions.pop({ refresh: { test: Math.random() } });
            }
          }}
        >
          <Icon name="ios-arrow-back" style={iconStyle} />
        </Button>
      </>
    );
  }
}

export default BackButton;
