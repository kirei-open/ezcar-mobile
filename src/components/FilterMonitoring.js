import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { Button, Icon } from 'native-base';

class FilterMonitoring extends Component {
  render() {
    const { iconStyle } = this.props;

    return (
      <>
        <Button
          transparent
          onPress={() => {
              Actions.fleetmonitorfiltering()
          }}
        >
          <Icon name="car-outline" style={iconStyle} />
        </Button>
      </>
    );
  }
}

export default FilterMonitoring;
