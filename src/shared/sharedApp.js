import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';

const SharedAppMobile = ({UiComponent, ...rest}) => ( <UiComponent {...rest} />)

SharedAppMobile.PropTypes = {
    token: PropTypes.string
}

export default SharedAppMobile;
