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

const {width, height} = Dimensions.get('window');

const StoryScreen = ({route, navigation}) => {
  const {story} = route.params;

  const style = useAnimatedStyle(() => {
    const scale = 1;
    return {
      flex: 1,
      transform: [{scale}],
      zIndex: 99,
    };
  });
  return (
    <Animated.View style={style}>
      <SharedElement id={story.id} style={{flex: 1}}>
        {!story.video ? (
          <Animated.View
            style={[
              {
                ...StyleSheet.absoluteFillObject,
                width: undefined,
                height: undefined,
                resizeMode: 'cover',
                borderRadius: 10,
              },
            ]}>
            <Animated.Image
              source={{uri: story.source}}
              style={[
                {
                  ...StyleSheet.absoluteFillObject,
                  width: undefined,
                  height: undefined,
                  resizeMode: 'cover',
                  borderRadius: 10,
                },
              ]}
            />
            <View
              style={{
                padding: 10,
                paddingTop: StatusBar.currentHeight + 10,
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}>
              <Text style={{color: 'white'}}>{story?.user?.name}</Text>
            </View>
          </Animated.View>
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: 'black'}}>Video exists</Text>
          </View>
        )}
      </SharedElement>
    </Animated.View>
  );
};

export default StoryScreen;
