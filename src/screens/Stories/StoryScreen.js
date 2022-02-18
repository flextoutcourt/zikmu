import React, {PureComponent} from 'react';
import {View, StyleSheet, Image, Text, Dimensions} from 'react-native';
import {SharedElement} from 'react-navigation-shared-element'
import Animated, {useAnimatedGestureHandler, useSharedValue, useAnimatedStyle, withSpring, runOnJS, interpolate, Extrapolate, withTiming} from 'react-native-reanimated';
import { useVector, snapPoint } from "react-native-redash";

import { PanGestureHandler} from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");

const StoryScreen = ({route, navigation}) => {

    const isGestureActive = useSharedValue(false);
    const translation = useVector();
    const { story } = route.params;
    const onGestureEvent = useAnimatedGestureHandler({
        onStart: () => (isGestureActive.value = true),
        onActive: ({ translationX, translationY }) => {
            translation.x.value = translationX;
            translation.y.value = translationY;
        },
        onEnd: ({ translationY, velocityY }) => {
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
            Extrapolate.CLAMP
        );
        return {
            flex: 1,
            transform: [
                { translateX: translation.x.value * scale },
                { translateY: translation.y.value * scale },
                { scale },
            ],
        };
    });

    return(
        <PanGestureHandler onGestureEvent={onGestureEvent}>
            <Animated.View style={style}>
                <SharedElement id={story.id} style={{flex: 1}}>
                    <Animated.Image
                        source={{uri: story.source}}
                        style={{...styles.imageContainer}}
                        resizeMode={"cover"}
                    />
                </SharedElement>
            </Animated.View>
        </PanGestureHandler>
    )

}

const styles = StyleSheet.create({
    imageContainer: {
        ...StyleSheet.absoluteFill
    }
})

export default StoryScreen;
