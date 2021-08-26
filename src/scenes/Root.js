import React from 'react';
import { Container, Content, Spinner } from 'native-base';
import { Actions } from 'react-native-router-flux';

class RootScreen extends React.Component {
  componentWillMount() {
    const { user, loaded } = this.props;

    if (loaded) {
      if (!user) {
        Actions.reset('login');
      } else {
        Actions.reset('maintab');
      }
    }
  }

  render() {
    return (
      <Container>
        <Content>
          <Spinner />
        </Content>
      </Container>
    );
  }
}

export default RootScreen;
