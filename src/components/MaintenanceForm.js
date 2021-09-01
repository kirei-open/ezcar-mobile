import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import t from 'tcomb-form-native';

import { checkList, usageList } from '../modules/defaults/maintenance';
import myList from './template/myList';
import mySwitch from './template/mySwitch';
import newStyleSheet from '../constants/form';
import myTextbox from './template/myTextbox';

const { Form } = t.form;

const CheckList = t.struct({
  _id: t.maybe(t.String),
  name: t.String,
  good: t.maybe(t.Boolean),
  action: t.maybe(t.Boolean),
  actionName: t.String,
  info: t.maybe(t.String)
});

const UsageList = t.struct({
  _id: t.maybe(t.String),
  name: t.String,
  hi: t.maybe(t.Number),
  shi: t.maybe(t.Number)
});

const Maintenance = t.struct({
  check: t.list(CheckList),
  usage: t.list(UsageList)
});

const maintenanceOptions = {
  fields: {
    check: {
      label: 'Maintenance check list',
      template: myList,
      item: {
        fields: {
          _id: {
            hidden: true
          },
          name: {
            hidden: true
          },
          actionName: {
            hidden: true
          },
          good: {
            label: 'Condition',
            template: mySwitch
          },
          action: {
            template: mySwitch
          }
        }
      },
      config: {
        labelType: 'checkList',
        labelName: checkList
      },
      disableOrder: true,
      disableAdd: true,
      disableRemove: true
    },
    usage: {
      label: 'Maintenance usage list',
      template: myList,
      item: {
        auto: 'name',
        fields: {
          _id: {
            hidden: true
          },
          name: {
            label: 'Name'
          },
          hi: {
            label: 'HI',
            template: myTextbox
          },
          shi: {
            label: 'SHI',
            template: myTextbox
          }
        }
      },
      disableOrder: true
    }
  },
  stylesheet: newStyleSheet
};

class MaintenanceForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: {
        check: props.check || checkList,
        usage: props.usage || usageList
      }
    };
  }

  onChangeForm = value => {
    this.setState({ value });
  };

  render() {
    return (
      <View>
        <Form
          ref={_form => {
            this.form = _form;
          }}
          type={Maintenance}
          value={this.state.value}
          onChange={this.onChangeForm}
          options={maintenanceOptions}
        />
      </View>
    );
  }
}

MaintenanceForm.propTypes = {
  check: PropTypes.arrayOf(PropTypes.shape({})),
  usage: PropTypes.arrayOf(PropTypes.shape({}))
};

MaintenanceForm.defaultProps = {
  check: undefined,
  usage: undefined
};

export default MaintenanceForm;
