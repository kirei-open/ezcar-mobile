import React from 'react';
import { StyleSheet } from 'react-native';
import { Badge, Text } from 'native-base';

const style = StyleSheet.create({
  created: {
    backgroundColor: '#2dde98',
    height: 24
  },
  suspended: {
    backgroundColor: '#ffc168',
    height: 24
  },
  edited: {
    backgroundColor: '#6762a6',
    height: 24
  },
  switched: {
    backgroundColor: '#00aeff',
    height: 24
  },
  approved: {
    backgroundColor: '#3369e7',
    height: 24
  },
  accepted: {
    backgroundColor: '#3369e7',
    height: 24
  },
  rejected: {
    backgroundColor: '#ff6c5f',
    height: 24
  },
  assigned: {
    backgroundColor: '#8e43e7',
    height: 24
  },
  locked: {
    backgroundColor: '#003666',
    height: 24
  },
  confirmed: {
    backgroundColor: '#e4de0b',
    height: 24
  },
  started: {
    backgroundColor: '#b84592',
    height: 24
  },
  ended: {
    backgroundColor: '#1cc7d0',
    height: 24
  },
  joined: {
    backgroundColor: '#ff4f81',
    height: 24
  },
  rated: {
    backgroundColor: '#bf0c0c',
    height: 24
  },
  textBadge: {
    color: '#ffffff',
    fontSize: 12,
    lineHeight: 22
  }
});

class OrderBadge extends React.Component {
  render() {
    const { name } = this.props;
    return (
      <Badge style={style[name]}>
        <Text style={style.textBadge}>{name}</Text>
      </Badge>
    );
  }
}

export default OrderBadge;
