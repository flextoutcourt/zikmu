import React, {useEffect} from 'react';
import {Linking} from 'react-native';
import {Provider} from 'react-redux';
import {store, persistor} from './src/redux/store/store';
import EntryScreen from './src/screens/Entry/EntryScreen';
import DeepLinking from 'react-native-deep-linking';

export default function App() {

  return (
    <Provider store={store}>
      <EntryScreen />
    </Provider>
  );
}
