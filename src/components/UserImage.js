import React, { PureComponent } from 'react';
import { Thumbnail } from 'native-base';
import avatar from '../constants/avatar';

class UserImage extends PureComponent {
  render() {
    const { user, mode, styleContainer, size } = this.props;
    
    const item = user && user.profile ? user.profile : user;

    const source = item && item.photo ? item.photo : avatar(user.name, 120);

    return (
      <Thumbnail
        source={{ uri: source }}
        square={mode === 'square'}
        small={size === 'small'}
        large={size === 'large'}
        style={styleContainer}
      />
    );
  }
}

export default UserImage;
