import React from 'react';

import {Provider} from 'react-redux';
import {store, persistor} from './src/redux/store/store';
import EntryScreen from './src/screens/Entry/EntryScreen';

export default function App() {
  return (
    <Provider store={store}>
       <EntryScreen />
    </Provider>
  );
}