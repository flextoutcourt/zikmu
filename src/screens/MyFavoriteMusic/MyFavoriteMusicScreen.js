import React, {Component} from 'react';
import {View, Text} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

class MyFavoriteMusicScreen extends Component {
  state = {};
  render() {
    return (
      <SafeAreaView>
        <Text>My favorite music!</Text>
      </SafeAreaView>
    );
  }
}

export default MyFavoriteMusicScreen;