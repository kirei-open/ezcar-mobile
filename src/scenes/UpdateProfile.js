import React from 'react';
import { ImagePicker, Permissions } from 'expo';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator
} from 'react-native';
import {
  Container,
  Content,
  Card,
  CardItem,
  Body,
  Text,
  Spinner,
  Item,
  Input,
  Button,
  Thumbnail,
  Label
} from 'native-base';
import uuidv1 from 'uuid/v1';
import mime from 'mime';
import { Actions } from 'react-native-router-flux';
import { sendEvent } from '../modules/socket';
import config from '../modules/constants/config';
import avatar from '../constants/avatar';

const style = StyleSheet.create({
  textLabel: {
    fontSize: 12,
    marginLeft: 0
  },
  textValue: {
    fontSize: 16,
    marginLeft: 0
  },
  cardHeader: {
    backgroundColor: '#F0EFF5',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingTop: 10,
    paddingBottom: 10
  },
  cardHeaderText: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  logout: {
    marginTop: 12,
    marginBottom: 20
  },
  thumbnailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12
  },
  thumbnailImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    marginRight: 10
  }
});

async function uploadImageAsync(uri, uploadOptions) {
  const apiUrl = `${config.api}/upload`;
  const uriParts = uri.split('.');
  const fileExt = uriParts[uriParts.length - 1];
  const fileType = mime.getType(uri);

  const { token, group, title, attached } = uploadOptions;

  const formData = new FormData();
  formData.append('attachment', {
    uri,
    name: `${title || uuidv1()}.${fileExt}`,
    type: `${fileType}`
  });
  formData.append('name', title || uuidv1());
  formData.append('group', group);
  formData.append('attached', attached);

  const options = {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  };
  console.log('options.body', options.body);

  return fetch(apiUrl, options);
}

class UpdateProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      image: null,
      uploading: false,
      attachment: "",
      name: this.props.user.name,
      email: this.props.user.email
    };
    this.loggingOut = this.loggingOut.bind(this);
    this._pickImage = this._pickImage.bind(this);
    this._handleImagePicked = this._handleImagePicked.bind(this);
    this._handleUpload = this._handleUpload.bind(this);
    this.newData = this.newData.bind(this);
  }

  componentDidMount() {
    const { user } = this.props;
    this.props.getSingleUser(user._id);
  }

  loggingOut = () => {
    sendEvent('unsubscribe user', this.props.user._id);
    sendEvent('user inactive', this.props.user._id);

    this.setState(
      {
        loading: true
      },
      () => {
        this.props.onUserLogout();

        Actions.reset('noauthmenus');
      }
    );
  };

  _pickImage = () => {
    this.setState(
      { loading: true },
      async () => {
        const permited = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (permited.status === 'granted') {
          const pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            mediaTypes: 'Images',
            quality: 0.1
          });
          if (!pickerResult.cancelled) {
            this._handleImagePicked(pickerResult);
          }
        }
      },
      () => {
        this.setState({ loading: false });
      }
    );
  };

  _handleUpload = () => {
    const { name, email } = this.state;
    const { single, user } = this.props;

    user.name = name !== '' ? name : user.name;
    user.email = email !== '' ? email : user.email;

    const params = {
      company: single.company,
      division: single.division,
      email: email !== '' ? email : single.email,
      name: name !== '' ? name : single.name,
      pool: single.pool,
      profile: {
        address: single.profile.address,
        citizenship: single.profile.citizenship,
        education: single.profile.education,
        gender: single.profile.gender,
        identities: single.profile.identities,
        phone: single.profile.phone,
        photo: single.profile.photo,
        user: single.profile.user
      },
      role: single.role,
      username: single.username
    };
    console.log('paramup', params, user && user._id);
    this.props.updateUser(user && user._id, params);
    console.log('upuser', user);
    Actions.settings();
    alert('Update Success');
  };

  _handleImagePicked = async pickerResult => {
    let uploadResponse;
    let uploadResult;

    const { token, user, single } = this.props;

    const title = 'Profile Photo';
    const group = 'image';
    const attached = 'Profile';
    console.log('waiting');
    try {
      uploadResponse = await uploadImageAsync(pickerResult.uri, {
        token,
        title,
        group,
        attached
      });

      uploadResult = await uploadResponse.json();
      if (uploadResult.status === 'success') {
        console.log('result', uploadResult.data);
        const url = uploadResult.data.url;
        user.profile.photo = url;
        const params = {
          company: single.company,
          division: single.division,
          email: single.email,
          name: single.name,
          pool: single.pool,
          profile: {
            address: single.profile.address,
            citizenship: single.profile.citizenship,
            education: single.profile.education,
            gender: single.profile.gender,
            identities: single.profile.identities,
            phone: single.profile.phone,
            photo: url,
            user: single.profile.user
          },
          role: single.role,
          username: single.username
        }
        this.props.updateUser(user._id, params);
      }
    } catch (e) {
      console.log({ uploadResponse });
      console.log({ uploadResult });
      console.log({ e });
      alert('Upload failed, sorry :(');
    }
  };

  newData(user) {
    const newUser = user;
    delete newUser.__v;
    delete newUser._id;
    delete newUser.createdAt;
    delete newUser.updatedAt;
    delete newUser.profile.__v;
    delete newUser.profile._id;
    delete newUser.profile.updatedAt;
    delete newUser.profile.createdAt;

    return newUser;
  }

  render() {
    const { user, single } = this.props;
    const { name, email } = this.state;
    console.log('user', user);
    return (
      <Container>
        <Content padder>
          <Body style={style.thumbnailContainer}>
            <TouchableOpacity transparent large onPress={this._pickImage}>
              {this.state.loading ? (
                <Spinner color="white" />
              ) : (
                <Thumbnail
                  source={{
                    uri:
                      single && single.profile && single.profile.photo
                        ? single.profile.photo
                        : avatar(single.name, 120)
                  }}
                  mode="circle"
                  large
                  style={style.thumbnailImage}
                />
              )}
            </TouchableOpacity>
          </Body>
          <Card>
            <CardItem header style={style.cardHeader}>
              <Body>
                <Text style={style.cardHeaderText}>General Info</Text>
              </Body>
            </CardItem>
            <CardItem>
              {this.state.loading ? (
                <Spinner color="white" />
              ) : (
                <Body>
                  <Item fixedLabel>
                    <Label style={style.textLabel}>Name</Label>
                    <Input
                      style={style.textValue}
                      onChangeText={value => this.setState({ name: value })}
                      placeholder={single.name}
                    />
                  </Item>
                  <Item fixedLabel>
                    <Label style={style.textLabel}>Email</Label>
                    <Input
                      style={style.textValue}
                      onChangeText={value => this.setState({ email: value })}
                      placeholder={single.email}
                    />
                  </Item>
                </Body>
              )}
            </CardItem>
          </Card>
          <Button
            block
            primary
            style={style.logout}
            onPress={this._handleUpload}
          >
            {this.state.loading ? (
              <Spinner color="white" />
            ) : (
              <Text>Update</Text>
            )}
          </Button>
        </Content>
      </Container>
    );
  }
}

export default UpdateProfile;
