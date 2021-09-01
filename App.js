import React from 'react';
import { StatusBar } from 'expo-status-bar';
import configureStore from './src/modules/store.js';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import SharedAppMobile from './src/shared/sharedApp';
import Router from './src/Router';
import * as Font from 'expo-font';

const { persistor, store } = configureStore();

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false
    };
  }

  componentDidMount() {
    this._loadAssets();
  }

  _loadAssets = async () => {
    /* eslint-disable */
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      Ionicons: require('./node_modules/@expo/vector-icons/Ionicons.js')
    });

    const images = [
      require('./assets/calendar-22.png'),
      require('./assets/calendar-23.png'),
      require('./assets/calendar-31.png'),
      require('./assets/calendar-32.png'),
      require('./assets/file-7.png'),
      require('./assets/mail-8.png'),
      require('./assets/notepad-15.png'),
      require('./assets/notepad-17.png'),
      require('./assets/placeholder-13.png'),
      require('./assets/placeholder-14.png'),
      require('./assets/user-22.png'),
      require('./assets/user-23.png'),
      require('./assets/user-25.png'),
      require('./assets/user-53.png')
    ];

    const cacheImages = images.map(image => Asset.fromModule(image).downloadAsync());
    /* eslint-enable */

    await Promise.all(cacheImages);

    this.setState({ loaded: true });
  }

  render() {
    const { loaded } = this.state;

    return (
      <Provider store={store}>
        <StatusBar hidden />
        <PersistGate loading={null} persistor={persistor}>
          <SharedAppMobile UiComponent={Router} />
        </PersistGate>
      </Provider>
    );
  }
}
