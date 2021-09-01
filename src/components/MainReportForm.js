import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Separator, Text } from 'native-base';
import t from 'tcomb-form-native';

import PickerMinilist from '../containers/PickerMinilist';
import mySwitch from './template/mySwitch';
import newStyleSheet from '../constants/form';
import myTextbox from './template/myTextbox';

const { Form } = t.form;

const MainInfo = t.struct({
  _id: t.maybe(t.String),
  title: t.String,
  isOk: t.maybe(t.Boolean),
  category: t.enums.of(['Maintenance', 'Accident']),
  notes: t.maybe(t.String)
});

const mainInfoOptions = {
  fields: {
    _id: {
      hidden: true
    },
    isOk: {
      label: 'Condition',
      template: mySwitch
    },
    category: {
      nullOption: { value: '', text: 'Choose a category' }
    },
    notes: {
      label: 'Report Notes',
      multiline: true,
      numberOfLines: 2,
      template: myTextbox
    }
  },
  stylesheet: newStyleSheet
};

class MainReportForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: {
        _id: props._id || undefined,
        title: props.title || undefined,
        isOk: props.isOk || false,
        category: props.category || undefined,
        notes: props.notes || undefined
      },
      pool: props.pool || undefined,
      fleet: props.fleet || undefined
    };
  }

  onChangeForm = value => {
    if (value.category !== this.state.value.category) {
      this.props.changeCategory(value.category);
    }
    this.setState({ value });
  };

  render() {
    return (
      <View style={{ marginBottom: 12 }}>
        <Separator>
          <Text style={{ ...newStyleSheet.controlLabel.normal, fontSize: 12 }}>
            Main Information
          </Text>
        </Separator>
        <View
          style={{
            padding: 12,
            borderColor: '#ccc',
            borderWidth: 1
          }}
        >
          <Form
            ref={_form => {
              this.form = _form;
            }}
            type={MainInfo}
            options={mainInfoOptions}
            value={this.state.value}
            onChange={this.onChangeForm}
          />
          <View>
            <Text style={{ fontSize: 15, color: '#575757' }}>Pool</Text>
            <PickerMinilist
              name="pool"
              styleWidth="100%"
              placeholder="Choose a pool"
              pickedValue={this.state.pool}
              onPickedValue={pool => this.setState({ pool })}
              notFoundText="Pool list is empty"
            />
          </View>
          {!!this.state.pool && (
            <View>
              <Text style={{ fontSize: 15, color: '#575757' }}>Fleet</Text>
              <PickerMinilist
                name="fleet"
                styleWidth="100%"
                query={{
                  pool: this.state.pool
                }}
                placeholder="Choose a fleet"
                pickedValue={this.state.fleet}
                onPickedValue={fleet => this.setState({ fleet })}
                notFoundText="Fleet list is empty"
              />
            </View>
          )}
        </View>
      </View>
    );
  }
}

MainReportForm.propTypes = {
  _id: PropTypes.string,
  title: PropTypes.string,
  isOk: PropTypes.bool,
  category: PropTypes.string,
  notes: PropTypes.string,
  pool: PropTypes.string,
  fleet: PropTypes.string
};

MainReportForm.defaultProps = {
  _id: undefined,
  title: undefined,
  category: undefined,
  isOk: false,
  notes: undefined,
  pool: undefined,
  fleet: undefined
};

export default MainReportForm;
