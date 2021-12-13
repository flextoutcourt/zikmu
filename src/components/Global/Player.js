import axios from 'axios';
import React, { useContext, useState } from 'react';
import { Dimensions, FlatList, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import {onGestureEvent} from 'react-native-redash/lib/module/v1'
import Animated, { event } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { connect, ReactReduxContext } from 'react-redux';
import * as rootNavigation from './../../utils/RootNavigation';
import Lyrics from './Player/Lyrics';
import SeekBar from './Player/Seek';
import BigPlayer from './Players/BigPlayer';
import Miniplayer from './Players/MiniPlayer';



class Player extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            listening: null,
            big: false,
            paroles: false
        }
    }

    render(){

        const translationY = new Animated.Value(0);
        const velocityY = new Animated.Value(0);
        const state = new Animated.Value(State.UNDETERMINED);

        const gestureEvent = onGestureEvent({
            translationY,
            state,
            velocityY
        })
        
        const translateY = translationY;

        return (
            <>
                <PanGestureHandler {...gestureEvent}>
                    <Animated.View
                        style={[styles.PlayerSheet, { transform: [{ translateY }] }]}                        
                    >
                        <BigPlayer />
                        <View style={{position: 'absolute', left: 0, right: 0, bottom: 100, height: 65}}>
                            <Miniplayer />
                        </View>
                    </Animated.View>
                </PanGestureHandler>
            </>
        )
    }
}

const styles = StyleSheet.create({
    PlayerSheet: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'yellow'
    }
})

const mapStateToProps = store => {
    return {
        store: store
    }
}

export default connect(mapStateToProps)(Player);