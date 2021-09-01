import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Picker, Text } from 'native-base';

import request from '../modules/request';

class PickerMinilist extends Component {
  state = {
    minilist: []
  };

  componentWillMount() {
    this.loadMinilist();
  }

  loadMinilist = () => {
    const { name, query } = this.props;
    if (name === 'pool') {
      this._getPools(query);
    } else if (name === 'fleet') {
      this._getFleets(query);
    }
  };

  _getPools = async (query = {}) => {
    try {
      const result = await request.pool.minilist(query);
      if (result) {
        const { data } = result;
        const { pool } = data;
        const { placeholder } = this.props;
        const minilist = [{ name: placeholder, empty: 'pool-empty' }];

        if (pool) {
          minilist.push(...pool);
        }
        this.setState({
          minilist
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  _getFleets = async (query = {}) => {
    try {
      const result = await request.fleet.minilist(query);
      if (result) {
        const { data } = result;
        const { fleet } = data;
        const { placeholder } = this.props;
        const minilist = [{ plateNumber: placeholder, empty: 'fleet-empty' }];

        if (fleet) {
          minilist.push(...fleet);
        }
        this.setState({
          minilist
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { styleWidth, placeholder } = this.props;
    const { minilist } = this.state;

    return (
      <View style={{ width: styleWidth }}>
        {minilist.length ? (
          <Picker
            mode="dialog"
            placeholder={placeholder}
            style={{ width: styleWidth }}
            selectedValue={this.props.pickedValue}
            onValueChange={value => this.props.onPickedValue(value)}
          >
            {minilist.length &&
              minilist.map(item => (
                <Picker.Item
                  key={item.empty || item._id}
                  label={item.name || item.plateNumber}
                  value={item._id}
                />
              ))}
          </Picker>
        ) : (
          <Text style={{ paddingHorizontal: 6, paddingVertical: 12 }}>
            {this.props.notFoundText}
          </Text>
        )}
      </View>
    );
  }
}

PickerMinilist.propTypes = {
  name: PropTypes.oneOf(['pool', 'fleet']).isRequired,
  pickedValue: PropTypes.string,
  query: PropTypes.shape({}),
  onPickedValue: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  styleWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  notFoundText: PropTypes.string
};

PickerMinilist.defaultProps = {
  query: {},
  pickedValue: undefined,
  placeholder: 'Select one from the list',
  styleWidth: undefined,
  notFoundText: 'List not found'
};

export default PickerMinilist;
