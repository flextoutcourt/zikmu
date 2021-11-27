import React, {Component} from 'react';
import {View, Text, Dimensions} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

class MyFavoriteMusicScreen extends Component {
  state = {};
  render() {
    return (
      <SafeAreaView style={{flex: 1, justifyContent: 'space-between', alignItems: 'flex-start', width: Dimensions.get('screen').width}}>
        <Text>My favorite music!</Text>
      </SafeAreaView>
    );
  }
}

export default MyFavoriteMusicScreen;