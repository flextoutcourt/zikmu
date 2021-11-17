import React from 'react';
import {View, Button, Text, Linking} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Main from './Pages/Main';
import Category from './Pages/Category';
import Artist from './Pages/Artist'
import Album from './Pages/Album';
import Playlist from './Pages/Playlist';
import Track from './Pages/Track';

import {Provider} from 'react-redux';
import {store, persistor} from './src/redux/store/index';
import EntryScreen from './src/screens/Entry/EntryScreen';

export default function App() {
  return (
    <Provider store={store}>
       <EntryScreen />
    </Provider>
  );
}