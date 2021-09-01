import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { Button, Icon } from 'native-base';

class FilterUtilization extends Component {
  render() {
    const { iconStyle } = this.props;

    return (
      <>
        <Button
          transparent
          onPress={() => {
              Actions.filterscene()
          }}
        >
          <Icon name="md-funnel" style={iconStyle} />
        </Button>
      </>
    );
  }
}

export default FilterUtilization;
