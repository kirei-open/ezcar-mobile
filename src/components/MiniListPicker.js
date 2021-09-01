import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Picker } from 'native-base';
import MiniList from '../shared/MiniList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const style = StyleSheet.create({
  cardHeader: {
    paddingVertical: 7
  },
  picker: {
    marginLeft: 10,
    marginRight: 10
  },
  noborder: {
    borderWidth: 0,
    borderColor: 'transparent'
  },
  inlineInner: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
});

class MiniListPicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      minilist: [],
      value: props.initialValue || undefined
    };

    this.onSelectedValue = this.onSelectedValue.bind(this);
    this.onChangeValue = this.onChangeValue.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  UNSAFE_componentWillMount() {
    this.loadData(this.props);
  }

  async componentDidMount() {
    const { name } = this.props;
    const { minilist } = this.state;
    let user;
    const companies = [];
    const pools = [];
    const token = await AsyncStorage.getItem('token');
    const url = 'https://apicar.eztruk.com/user?page=1&limit=12&q=role%3Dadmin_company'
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      user = response.data.data.user[0];
      console.log(user.division)
      const comp = user.company
      const pool = user.pool
      companies.push(comp)
      pools.push(pool)
    } catch (err) {
      console.log(err.response)
    }
    if (
      name === 'company' &&
      minilist !== companies &&
      companies &&
      companies.length > 0
    ) {
      this.setState({ minilist: companies })
    } else if (
      name === 'pool' &&
      minilist !== pools &&
      pools &&
      pools.length > 0
    ) {
      this.setState({
        minilist: pools
      })
    }
  }

  // componentWillReceiveProps(nextProps) {
    // const { name } = this.props;
    // const { companies, divisions, pools, fleets } = nextProps;
    // const { minilist } = this.state;

    // if (
    //   name === 'company' &&
    //   JSON.stringify(minilist) !== JSON.stringify(companies) &&
    //   companies &&
    //   companies.length > 0
    // ) {
    //   this.setState({
    //     minilist: companies
    //   });
    // } else if (
    //   name === 'pool' &&
    //   JSON.stringify(minilist) !== JSON.stringify(pools) &&
    //   pools &&
    //   pools.length > 0
    // ) {
    //   this.setState({
    //     minilist: pools
    //   });
    // } else if (
    //   name === 'division' &&
    //   JSON.stringify(minilist) !== JSON.stringify(divisions) &&
    //   divisions &&
    //   divisions.length > 0
    // ) {
    //   this.setState({
    //     minilist: divisions
    //   });
    // } else if (
    //   name === 'fleet' &&
    //   JSON.stringify(minilist) !== JSON.stringify(fleets) &&
    //   fleets &&
    //   fleets.length > 0
    // ) {
    //   this.setState({
    //     minilist: fleets
    //   });
    // }

    // if (
    //   nextProps.initialValue !== '' &&
    //   this.props.initialValue !== nextProps.initialValue
    // ) {
    //   this.setState({
    //     value: nextProps.initialValue
    //   });
    // }
  // }

  // componentWillUpdate(nextProps) {
  //   if (JSON.stringify(nextProps.query) !== JSON.stringify(this.props.query)) {
  //     this.loadData(nextProps);
  //   }
  // }

  UNSAFE_componentWillUnmount() {
    const { name } = this.props;
    if (name === 'company') {
      this.props.unloadCompanies();
    } else if (name === 'pool') {
      this.props.unloadPools();
    } else if (name === 'division') {
      this.props.unloadDivisions();
    } else if (name === 'fleet') {
      this.props.unloadFleets();
    }
  }

  onSelectedValue(value) {
    let item = value;
    const { reqName } = this.props;

    if (reqName) {
      const { minilist } = this.state;
      const data = minilist.filter(p => p._id === value)[0];
      item = data;
    }

    this.setState(
      {
        value
      },
      () => {
        this.props.onSelect(item);
      }
    );
  }

  onChangeValue(value) {
    if (!value) {
      this.setState(
        {
          value
        },
        () => {
          this.props.onSelect();
        }
      );
    }
  }

  loadData(props) {
    const { name, query } = props;
    if (name === 'company') {
      this.props.getCompanies(query);
    } else if (name === 'pool') {
      this.props.getPools(query);
    } else if (name === 'division') {
      this.props.getDivisions(query);
    } else if (name === 'fleet') {
      this.props.getFleets(query);
    }
  }

  render() {
    let { minilist } = this.state;
    const { value: selectedValue } = this.state;
    const { name, placeholder, allowClear } = this.props;

    const defaultPlaceholder = placeholder || `Type to search ${name}`;

    minilist = [{ _id: '-', name: `Choose all ${name}` }, ...minilist];

    return (
      <Picker
        mode="dropdown"
        placeholder={defaultPlaceholder}
        selectedValue={
          minilist && minilist.some(item => item._id === selectedValue)
            ? selectedValue
            : undefined
        }
        onValueChange={this.onSelectedValue}
        style={style.picker}
        allowClear={allowClear}
      >
        {minilist.map(item => (
          <Picker.Item
            key={item._id}
            value={item._id}
            label={name === 'fleet' ? item.plateNumber : item.name}
          >
            {name === 'fleet' ? item.plateNumber : item.name}
          </Picker.Item>
        ))}
      </Picker>
    );
  }
}

MiniListPicker.propTypes = {
  name: PropTypes.string.isRequired,
  query: PropTypes.shape({}),
  onSelect: PropTypes.func,
  placeholder: PropTypes.string,
  initialValue: PropTypes.string,
  reqName: PropTypes.bool,
  allowClear: PropTypes.bool
};

MiniListPicker.defaultProps = {
  query: {},
  placeholder: '',
  onSelect: () => {},
  initialValue: '',
  reqName: false,
  allowClear: false
};

export default MiniList(MiniListPicker);
