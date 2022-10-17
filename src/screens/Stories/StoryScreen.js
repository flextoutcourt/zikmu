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
  const isGestureActive = useSharedValue(false);
  const translation = useVector();
  const {story} = route.params;
  const onGestureEvent = useAnimatedGestureHandler({
    onStart: () => (isGestureActive.value = true),
    onActive: ({translationX, translationY}) => {
      translation.x.value = translationX;
      translation.y.value = translationY;
    },
    onEnd: ({translationY, velocityY}) => {
      const snapBack =
        snapPoint(translationY, velocityY, [0, height]) === height;

      if (snapBack) {
        runOnJS(navigation.goBack)();
      } else {
        isGestureActive.value = false;
        translation.x.value = withSpring(0);
        translation.y.value = withSpring(0);
      }
    },
  });
  const style = useAnimatedStyle(() => {
    const scale = interpolate(
      translation.y.value,
      [0, height],
      [1, 0.5],
      Extrapolate.CLAMP,
    );
    return {
      flex: 1,
      transform: [
        {translateX: translation.x.value * scale},
        {translateY: translation.y.value * scale},
        {scale},
      ],
    };
  });
  const borderStyle = useAnimatedStyle(() => {
    return {
      borderRadius: withTiming(isGestureActive.value ? 24 : 0),
    };
  });
  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
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
    </PanGestureHandler>
  );
};

export default StoryScreen;
