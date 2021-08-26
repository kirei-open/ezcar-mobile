/**
 * Multiple select list with search
 * ataomega@gmail.com
 * www.atasmohammadi.net
 * version 1.0
 */
import React, { Component } from 'react';
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default class CustomMultiPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageWidth: Dimensions.get('window').width,
      pageHeight: Dimensions.get('window').height,
      searchText: null,
      selected: []
    };
  }

  componentDidMount = () => {
    const { selected } = this.props;

    if (typeof selected === 'object') {
      selected.map(select => {
        console.log('didMount1', selected);
        this._onSelect(select);
      });
    } else {
      console.log('didMount2', selected);
      this._onSelect(selected);
    }
  };

  componentWillReceiveProps(nextProps) {
    console.log('compWillRecvProps', nextProps.selected, this.props.selected);
    if (
      nextProps.selected &&
      JSON.stringify(nextProps.selected) !== JSON.stringify(this.props.selected)
    ) {
      let { selected } = nextProps;
      console.log('masuk willreceiveprops', selected);

      if (selected === 'resetAll') {
        console.log('MultipleSelect masuk Reset All');

        this.setState({ selected: [] });
        selected = [];
        this.props.callback(selected);
      }

      if (typeof selected === 'object') {
        selected.map(select => {
          console.log('compDidUp1', selected);
          this._onSelect(select);
        });
      } else {
        console.log('compDidUp2', selected);
        this._onSelect(selected);
      }
    }
  }

  getNewDimensions(event) {
    var pageHeight = event.nativeEvent.layout.height;
    var pageWidth = event.nativeEvent.layout.width;
    this.setState({
      pageHeight,
      pageWidth
    });
  }

  _onSelect = item => {
    let { selected } = this.state;
    if (this.props.multiple) {
      if (selected.indexOf(item) === -1) {
        selected.push(item);
        this.setState({
          selected
        });
      } else {
        selected = selected.filter(i => i !== item);
        this.setState({
          selected
        });
      }
    } else if (selected.indexOf(item) === -1) {
      selected = [item];
      this.setState({
        selected
      });
    } else {
      selected = [];
      this.setState({
        selected
      });
    }
    this.props.callback(selected);
  };

  _onSearch = text => {
    this.setState({
      searchText: text.length > 0 ? text.toLowerCase() : null
    });
  };

  _isSelected = item => {
    const { selected } = this.state;
    if (selected.indexOf(item) === -1) {
      return false;
    }
    return true;
  };

  filterObjectByValue = (obj, predicate) =>
    Object.keys(obj)
      .filter(key => predicate(obj[key]))
      .reduce((res, key) => ((res[key] = obj[key]), res), {});

  render() {
    const { options, returnValue } = this.props;
    const list = this.state.searchText
      ? this.filterObjectByValue(options, option =>
          option.toLowerCase().includes(this.state.searchText)
        )
      : options;
    const labels = Object.keys(list).map(i => list[i]);
    const values = Object.keys(list);

    return (
      <View
        onLayout={evt => {
          this.getNewDimensions(evt);
        }}
      >
        {this.props.search && (
          <View style={{ flexDirection: 'row', height: 55 }}>
            <View
              style={{
                marginTop: 15,
                marginLeft: 15,
                backgroundColor: 'transparent'
              }}
            >
              <Icon
                name="ios-search-outline"
                color={this.props.iconColor}
                size={25}
              />
            </View>
            <TextInput
              style={{
                width: this.state.pageWidth - 20,
                height: 35,
                margin: 0,
                marginTop: 10,
                marginLeft: -25,
                padding: 5,
                paddingLeft: 30,
                borderColor: this.props.iconColor,
                borderWidth: 1,
                borderRadius: 5
              }}
              onChangeText={text => {
                this._onSearch(text);
              }}
              clearButtonMode="always"
              placeholder={this.props.placeholder}
              placeholderTextColor={this.props.placeholderTextColor}
              underlineColorAndroid="transparent"
            />
          </View>
        )}
        <ScrollView style={{ padding: 5, height: this.props.scrollViewHeight }}>
          {labels.map((label, index) => {
            const itemKey = returnValue === 'label' ? label : values[index];
            return (
              <TouchableOpacity
                key={Math.round(Math.random() * 1000000)}
                style={{
                  padding: 7,
                  marginTop: 0,
                  marginLeft: 2,
                  marginRight: 2,
                  marginBottom: 6,
                  backgroundColor: this.props.rowBackgroundColor,
                  height: this.props.rowHeight,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderRadius: this.props.rowRadius
                }}
                onPress={() => {
                  console.log('pressed', itemKey);
                  this._onSelect(itemKey);
                }}
              >
                <Text>{label}</Text>
                {this._isSelected(itemKey) ? (
                  <Icon
                    name={this.props.selectedIconName}
                    color={this.props.iconColor}
                    size={this.props.iconSize}
                  />
                ) : (
                  <Icon
                    name={this.props.unselectedIconName}
                    color={this.props.iconColor}
                    size={this.props.iconSize}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  }
}
