import React from 'react';

import {Provider} from 'react-redux';
import {store} from './src/redux/store/store';
import EntryScreen from './src/screens/Entry/EntryScreen';

export default function App() {

    console.disableYellowBox = true;

    return (
        <Provider store={store}>
            <EntryScreen/>
        </Provider>
    );
}
