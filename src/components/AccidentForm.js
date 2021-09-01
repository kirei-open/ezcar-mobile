import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import t from 'tcomb-form-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
// import 'moment/locale/id';
import {
  Form as NForm,
  Item,
  Label,
  Text,
  Separator,
  Right
} from 'native-base';

import myList from './template/myList';
import newStyleSheet from '../constants/form';
import myTextbox from './template/myTextbox';
import OrderPlaceModal from '../containers/OrderPlaceModal';
import ImageUpload from './ImageUpload';

const { Form } = t.form;

const VictimList = t.struct({
  _id: t.maybe(t.String),
  name: t.String,
  age: t.Number,
  condition: t.enums.of(['Luka ringan', 'Luka berat', 'Meninggal']),
  info: t.maybe(t.String)
});

const DamageList = t.struct({
  _id: t.maybe(t.String),
  description: t.String,
  followUp: t.String
});

const Accident = t.struct({
  victim: t.list(VictimList),
  damage: t.list(DamageList)
});

const accidentOptions = {
  fields: {
    victim: {
      label: 'Victim list',
      template: myList,
      item: {
        fields: {
          _id: {
            hidden: true
          },
          age: {
            template: myTextbox
          }
        }
      },
      config: {
        disableLabel: true
      },
      disableOrder: true
    },
    damage: {
      label: 'Damage list',
      template: myList,
      item: {
        auto: 'placeholders',
        fields: {
          _id: {
            hidden: true
          }
        }
      },
      disableOrder: true
    }
  },
  stylesheet: newStyleSheet
};

const deviceWidth = Dimensions.get('window').width;
const initialModalPlace = {
  showModal: false,
  title: undefined,
  subtitle: undefined,
  name: undefined,
  number: undefined,
  address: undefined,
  latitude: undefined,
  longitude: undefined
};
class AccidentForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: {
        victim: props.detail ? props.detail.victim : undefined,
        damage: props.detail ? props.detail.damage : undefined
      },
      address: props.detail ? props.detail.address : undefined,
      location: {
        type: 'Point',
        coordinates:
          props.detail && props.detail.location
            ? props.detail.location.coordinates
            : []
      },
      photos: props.detail ? props.detail.photos : [],
      date: props.detail ? props.detail.date : new Date(),
      modalDate: false,
      modalPlace: initialModalPlace
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.openModalPlace = this.openModalPlace.bind(this);
    this.retrievePlaceValue = this.retrievePlaceValue.bind(this);
    this.closeModalPlace = this.closeModalPlace.bind(this);
  }

  onChangeForm = value => {
    this.setState({ value });
  };

  onInputChange(name, value) {
    this.setState({
      [name]: value
    });
  }

  openModalPlace(data) {
    this.setState({
      modalPlace: {
        ...this.state.modalPlace,
        showModal: true,
        ...data
      }
    });
  }

  closeModalPlace() {
    this.setState({
      modalPlace: initialModalPlace
    });
  }

  retrievePlaceValue(result) {
    const { address, latitude, longitude } = result;

    this.setState({
      address,
      location: {
        ...this.state.location,
        coordinates: [longitude, latitude]
      }
    });
  }

  render() {
    const { address, location, date, modalPlace } = this.state;

    return (
      <View>
        <DateTimePicker
          isVisible={this.state.modalDate}
          mode="datetime"
          onConfirm={value => {
            this.onInputChange('date', value);
            this.onInputChange('modalDate', false);
          }}
          onCancel={() => this.onInputChange('modalDate', false)}
        />
        <OrderPlaceModal
          {...modalPlace}
          retrieveValue={this.retrievePlaceValue}
          closeModal={this.closeModalPlace}
        />
        <View>
          <Separator>
            <Text
              style={{ ...newStyleSheet.controlLabel.normal, fontSize: 12 }}
            >
              Accident Detail
            </Text>
          </Separator>
          <NForm
            style={{ marginBottom: 12, borderWidth: 1, borderColor: '#ccc' }}
          >
            <Item stackedLabel style={{ height: 'auto' }}>
              <Label>Address</Label>
              <TouchableOpacity
                onPress={() =>
                  this.openModalPlace({
                    title: 'Accident Location',
                    name: 'address',
                    number: 0,
                    address,
                    latitude:
                      location &&
                      location.coordinates &&
                      location.coordinates.length > 1
                        ? location.coordinates[1]
                        : undefined,
                    longitude:
                      location &&
                      location.coordinates &&
                      location.coordinates.length > 0
                        ? location.coordinates[0]
                        : undefined
                  })
                }
                style={{
                  width: deviceWidth - 60,
                  paddingTop: 12
                }}
              >
                <Text>{address || 'Insert accident address'}</Text>
              </TouchableOpacity>
            </Item>
            <Item fixedLabel>
              <Label>Date Time</Label>
              <TouchableOpacity
                onPress={() => this.onInputChange('modalDate', true)}
              >
                <Right style={{ paddingVertical: 12 }}>
                  <Text style={{ paddingRight: 12 }}>
                    {moment(date).format('DD MMMM YYYY, HH:mm')}{' '}
                  </Text>
                </Right>
              </TouchableOpacity>
            </Item>
          </NForm>
        </View>
        <View style={{ marginBottom: 12 }}>
          <Separator>
            <Text
              style={{ ...newStyleSheet.controlLabel.normal, fontSize: 12 }}
            >
              Image Accidents
            </Text>
          </Separator>
          <ImageUpload
            containerStyle={{ paddingVertical: 12, paddingHorizontal: 6 }}
            group="image"
            attached="Accident"
            images={this.state.photos}
            handleChange={images => this.setState({ photos: images })}
          />
        </View>
        <Form
          ref={_form => {
            this.form = _form;
          }}
          type={Accident}
          value={this.state.value}
          onChange={this.onChangeForm}
          options={accidentOptions}
        />
      </View>
    );
  }
}

AccidentForm.propTypes = {
  detail: PropTypes.shape({})
};

AccidentForm.defaultProps = {
  detail: undefined
};

export default AccidentForm;
