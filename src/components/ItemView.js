import React, { Component } from 'react';
import { TouchableHighlight, CheckBox } from 'react-native';
import { Text, ListItem, Body, Right } from 'native-base';
import PropTypes from 'prop-types';

export default class ItemView extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    status: PropTypes.string.isRequired,
    onChecked: PropTypes.func.isRequired
  };

  render() {
    const { id, name, checked, status } = this.props;

    console.log('ItemView');
    console.log(checked);

    return (
      <ListItem>
        <CheckBox onPress={() => this.props.onChecked(id)} checked={checked} />
        <Body>
          <Text>{name}</Text>
        </Body>
        <Right>
          <Text>{status}</Text>
        </Right>
      </ListItem>
    );
  }
}
