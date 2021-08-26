import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Image } from 'react-native';
import { Container, Icon, Text, Button } from 'native-base';
import { Actions } from 'react-native-router-flux';

class ModalImage extends Component {
  render() {
    const { sourceImage } = this.props;

    if (!sourceImage) {
      return (
        <Container>
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <Text>Image failed to load</Text>
            <Button light iconLeft onPress={() => Actions.pop()}>
              <Icon name="arrow-back" />
              <Text>Go Back</Text>
            </Button>
          </View>
        </Container>
      );
    }

    return (
      <Container>
        <Image
          source={{ uri: sourceImage }}
          style={{
            flex: 1,
            resizeMode: 'center'
          }}
        />
      </Container>
    );
  }
}

ModalImage.propTypes = {
  sourceImage: PropTypes.string
};

ModalImage.defaultProps = {
  sourceImage: ''
};

export default ModalImage;
