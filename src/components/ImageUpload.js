import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { Actions } from 'react-native-router-flux';
// import { ImagePicker, Permissions } from 'expo';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import uuidv1 from 'uuid/v1';
import mime from 'mime';

import { Button, Text, Thumbnail, Icon } from 'native-base';

import config from '../modules/constants/config';
import WithToken from '../shared/Token';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ImageUpload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uploading: false,
      token: ''
    };

    this.uploadImageAsync = this.uploadImageAsync.bind(this);
    this._maybeRenderUploadingOverlay = this._maybeRenderUploadingOverlay.bind(
      this
    );
    this._maybeRenderImage = this._maybeRenderImage.bind(this);
    this._takePhoto = this._takePhoto.bind(this);
    this._pickImage = this._pickImage.bind(this);
    this._handleImagePicked = this._handleImagePicked.bind(this);
  }

  async getToken() {
    const token = await AsyncStorage.getItem("token")
    this.setState({ token })
  }

  componentDidMount() {
    this.getToken()
    this._isMounted = true;
    // console.log('ImageUpload comp_d_m', this._isMounted);
  }

  componentWillUnmount() {
    this._isMounted = false;
    // console.log('ImageUpload comp_w_u_mount', this._isMounted);
  }

  _isMounted = false;

  uploadImageAsync = async (uri, uploadOptions) => {
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
    // console.log('cek', options);
    return fetch(apiUrl, options);
  };

  _maybeRenderUploadingOverlay = () => {
    if (this.state.uploading) {
      return (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: 'rgba(0,0,0,0.4)',
              alignItems: 'center',
              justifyContent: 'center'
            }
          ]}
        >
          <ActivityIndicator color="#fff" animating size="large" />
        </View>
      );
    }
    return null;
  };

  _maybeRenderImage = () => {
    const { images, imgIsFullSourced } = this.props;
    console.log(images)
    if (!images || (Array.isArray(images) && images.length === 0)) {
      return null;
    }

    return (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          padding: 12
        }}
      >
        {images.map(image => (
          <View key={uuidv1()} style={{ flexBasis: '25%' }}>
            <TouchableOpacity
              onPress={() =>
                Actions.openimage({
                  sourceImage: imgIsFullSourced
                    ? `${image.source}`
                    : `${config.api}${image.source}`
                })
              }
            >
              <Thumbnail
                square
                large
                source={{
                  uri: imgIsFullSourced
                    ? `${image.source}`
                    : `${config.api}${image.source}`
                }}
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  _takePhoto = async () => {
    const res = await Promise.all([
      Permissions.askAsync(Permissions.CAMERA),
      Permissions.askAsync(Permissions.CAMERA_ROLL)
    ]);

    if (res.some(d => d.status === 'granted')) {
      const pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3]
      });

      if (this._isMounted) this._handleImagePicked(pickerResult);
    }
  };

  _pickImage = async () => {
    // console.log('_pickImage');
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: 'Images',
      quality: 0.85
    });

    // console.log('pickerResult; _isMounted', pickerResult, this._isMounted);
    if (this._isMounted && !pickerResult.cancelled)
      this._handleImagePicked(pickerResult);
  };

  _handleImagePicked = async pickerResult => {
    let uploadResponse;
    let uploadResult;

    const { title, group, attached } = this.props;
    const { token } = this.state

    // console.log('_handleImagePicked');

    try {
      this.setState({ uploading: true });

      if (!pickerResult.cancelled) {
        uploadResponse = await this.uploadImageAsync(pickerResult.uri, {
          token,
          title,
          group,
          attached
        });

        uploadResult = await uploadResponse.json();

        const { attachment } = uploadResult.data;

        const images = [...this.props.images, attachment];
        this.props.handleChange(images);
      }
    } catch (e) {
      console.log({ uploadResponse });
      console.log({ uploadResult });
      console.log({ e });
      alert('Upload failed, sorry :(');
    } finally {
      this.setState({ uploading: false });
    }
  };

  render() {
    const { images } = this.props;
    const { containerStyle } = this.props;
    const { token } = this.state;

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {images.length === 0 && (
          <View style={{ paddingVertical: 16 }}>
            <Text>Select Image to upload</Text>
          </View>
        )}
        {this._maybeRenderImage()}
        {this._maybeRenderUploadingOverlay()}
        {!token ? (
          <View style={containerStyle}>
            <Text>Cannot upload image. No authorization found</Text>
          </View>
        ) : (
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <Button full iconLeft dark onPress={this._pickImage}>
                <Icon name="folder" />
                <Text>File Manager</Text>
              </Button>
            </View>
            <View style={{ flex: 1 }}>
              <Button full iconLeft dark onPress={this._takePhoto}>
                <Icon name="camera" />
                <Text>Camera</Text>
              </Button>
            </View>
          </View>
        )}
      </View>
    );
  }
}

ImageUpload.propTypes = {
  token: PropTypes.string,
  containerStyle: PropTypes.shape({}),
  images: PropTypes.arrayOf(PropTypes.shape({})),
  group: PropTypes.string,
  attached: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  imgIsFullSourced: PropTypes.bool
};

ImageUpload.defaultProps = {
  token: '',
  containerStyle: {},
  images: [],
  group: 'image',
  imgIsFullSourced: false
};

export default WithToken(ImageUpload);
