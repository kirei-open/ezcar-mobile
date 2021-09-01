import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { View, Modal } from 'react-native';
import {
  Content,
  Button,
  Icon,
  Text,
  Header,
  Item,
  Input,
  List,
  ListItem,
  Left,
  Right,
  Subtitle,
  Body,
  Title
} from 'native-base';
import { Permissions, Location } from 'expo';
import qs from 'query-string';
import BackButton from '../components/BackButton';

// import Layout from '../components/Layout';
import config from '../modules/constants/config';

class PassengerModal extends Component {
  constructor(props) {
    super(props);

    this.closeModal = this.closeModal.bind(this);
    this.getPassenger = this.getPassenger.bind(this);
    this.setSelected = this.setSelected.bind(this);
  }

  getPassenger(user) {
    this.props.getPassenger(user);
    this.closeModal();
  }

  setSelected(e) {
    console.log(e);
  }

  closeModal() {
    this.props.openModalPassenger(false);
  }

  render() {
    const { user, list } = this.props;

    return (
      <View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.props.showModal}
          onRequestClose={() => this.closeModal()}
        >
          <Header>
            <Left style={{ flex: 0.5 }}>
              <BackButton iconStyle={{ color: 'black' }} />
            </Left>
            <Body style={{ flex: 1 }}>
              <Title>
                Passenger
              </Title>
              <Subtitle>Passenger</Subtitle>
            </Body>
            <Right style={{ flex: 0.5 }}><Text></Text></Right>
          </Header>
              <Header searchBar rounded>
                <Item>
                  <Icon name="ios-search" />
                  <Input
                    placeholder="Search"
                    onChangeText={value => {
                      this.props.onSearchPassenger(value);
                    }}
                  />
                  <Icon name="ios-people" />
                </Item>
                <Button transparent>
                  <Text>Search</Text>
                </Button>
              </Header>
              <List>
                {list &&
                  list.user &&
                  list.user.map((x, i) => (
                    <ListItem
                      key={i}
                      label={x.name}
                      button
                      onPress={() => {
                        this.getPassenger(x);
                      }}
                    >
                      <Left>
                        <Text>{x.name}</Text>
                      </Left>
                      <Right>
                        <Icon name="checkmark" />
                      </Right>
                    </ListItem>
                  ))}
              </List>
            {/* </Content>
          </Layout> */}
        </Modal>
      </View>
    );
  }
}

PassengerModal.propTypes = {
  showModal: PropTypes.bool,
  openModalPassenger: PropTypes.func,
  onSearchPassenger: PropTypes.func,
  getPassenger: PropTypes.func,
  user: PropTypes.shape({}),
  list: PropTypes.shape({})
};

PassengerModal.defaultProps = {
  showModal: false,
  user: {},
  list: {}
};

export default PassengerModal;
