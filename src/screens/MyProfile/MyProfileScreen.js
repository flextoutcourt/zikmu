import React, {Component} from 'react';
import {View, Text} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

class MyProfileScreen extends Component {
  state = {};
  render() {
    return (
      <SafeAreaView>
        <Text>My profile!</Text>
      </SafeAreaView>
    );
  }
}

export default MyProfileScreen;