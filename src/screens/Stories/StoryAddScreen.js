import React from 'react';
import {Dimensions, StatusBar, StyleSheet, Text, View} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {snapPoint, useVector} from 'react-native-redash';
import {SharedElement} from 'react-navigation-shared-element';
import LinearGradient from 'react-native-linear-gradient';

const {width, height} = Dimensions.get('window');

const StoryScreen = ({route, navigation}) => {


  return (
    <LinearGradient
      colors={['#15202B', '#15202B']}
      style={({marginTop: 0}, styles.container)}>

      <Text style={{color: 'white'}}>test</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#15202B',
  },
});

export default StoryScreen;
