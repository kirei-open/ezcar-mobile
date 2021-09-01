import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import {
  Content,
  Container,
  Card,
  CardItem,
  Text,
  Item,
  Input,
  Label,
  Right,
  Button,
  Footer,
  FooterTab
} from 'native-base';
import ImageUpload from '../components/ImageUpload';

const deviceWidth = Dimensions.get('window').width;

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

class UserForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      roleList: [],
      citizenship: '',
      citizenshipValue: '',
      userForm: {}
    };

    this.onInputSelected = this.onInputSelected.bind(this);
    // this.onSubmit = this.onSubmit.bind(this);
    // // this.onSelectedType = this.onSelectedType.bind(this);
    // // this.getGeneralList = this.getGeneralList.bind(this);
    // this.onCitizenshipChange = this.onCitizenshipChange.bind(this);
    // this.onWNAChange = this.onWNAChange.bind(this);
    // this.onSelectCompany = this.onSelectCompany.bind(this);
    // this.onSelectDivision = this.onSelectDivision.bind(this);
    // this.onSelectPool = this.onSelectPool.bind(this);

    // this.lastSearchRequest = 0;
  }

  shouldComponentUpdate(nextProps) {
    // console.log('should_comp_upd', nextProps.detail, this.props.detail);
    // if (
    //   Object.keys(nextProps.detail).length > 0 &&
    //   JSON.stringify(this.props.detail) !== JSON.stringify(nextProps.detail)
    // ) {
    //   console.log('should_comp_upd', true);
    //   return true;
    // }

    console.log('should_comp_upd', false);
    return false;
  }

  onInputSelected(name, value) {
    const { userForm } = this.state;
    userForm[name] = value;

    console.log('onInputSelected', userForm);

    this.setState({
      userForm
    });
  }

  render() {
    const { detail, token } = this.props;
    const { roleList, userForm } = this.state;

    const photo = detail && detail.profile && detail.profile.photo;
    let initialPhoto;
    if (photo) {
      initialPhoto = [
        {
          uid: -1,
          source: photo.replace('https://apicar.eztruk.com', '')
        }
      ];
    }

    console.log('initialPhoto', initialPhoto);
    console.log('userForm', userForm);

    return (
      <View style={{ flex: 1 }}>
        <Content padder>
          <Card>
            <CardItem header style={style.cardHeader}>
              <Text>Photo Profile</Text>
            </CardItem>
            <CardItem>
              <ImageUpload
                containerStyle={{
                  paddingVertical: 12,
                  paddingHorizontal: 6
                }}
                group="image"
                attached="Order"
                images={
                  userForm && userForm.photo ? userForm.photo : initialPhoto
                }
                handleChange={images => this.onInputSelected('photo', images)}
              />
            </CardItem>
          </Card>
          <Card>
            <CardItem header style={style.cardHeader}>
              <Text>General Info</Text>
            </CardItem>
            <CardItem>
              <Item stackedLabel style={style.noborder}>
                <Label>Full Name</Label>
                <Input
                  value={detail && detail.name}
                  style={{
                    width: deviceWidth - 60,
                    borderWidth: 2,
                    borderColor: 'lightgrey'
                  }}
                  onChangeText={value => this.onChangeInput('seat', value)}
                />
              </Item>
            </CardItem>
          </Card>
        </Content>
        <Footer>
          <FooterTab>
            <Button full primary onPress={() => this.handleSubmit()}>
              <Text style={{ color: '#fff', fontWeight: '500' }}>
                Submit User
              </Text>
            </Button>
          </FooterTab>
        </Footer>
      </View>
    );
  }
}

UserForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  title: PropTypes.string,
  detail: PropTypes.shape({}),
  user: PropTypes.shape({}).isRequired,
  token: PropTypes.string.isRequired
};

UserForm.defaultProps = {
  title: null,
  detail: {
    profile: {
      identities: [],
      citizenship: 'Indonesia'
    }
  }
};

export default UserForm;
