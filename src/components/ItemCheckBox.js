import React, { Component } from 'react';
import { CheckBox } from 'native-base';

class ItemCheckbox extends Component {
  constructor() {
    super();

    this.state = {
      checked: false
    };
  }

  render() {
    const { tag, color, updateCount } = this.props;
    const { checked } = this.state;

    return (
      <CheckBox
        key={tag}
        center
        title={tag}
        iconRight
        iconType="material"
        checkedIcon="clear"
        uncheckedIcon="add"
        checkedColor="red"
        checked={checked}
        containerStyle={{ width: 70, backgroundColor: color }}
        onPress={() => {
          this.setState({
            checked: !checked
          });
          updateCount(!this.state.checked);
        }}
      />
    );
  }
}

export default ItemCheckbox;
