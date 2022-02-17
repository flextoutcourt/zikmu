import React, {PureComponent} from 'react';
import {View, StyleSheet, Image, Text, Dimensions} from 'react-native';
import {SharedElement} from 'react-navigation-shared-element'

import { PanGestureHandler } from "react-native-gesture-handler";

class StoryScreen extends PureComponent{

    constructor(props){
        super(props)
        this.state = {
            story: props.route.params.story
        }
    }

    render(){
        return(
            <View style={{flex: 1  }}>
                <SharedElement id={this.state.story.id} style={{...StyleSheet.absoluteFill}}>
                    <Image source={{uri: this.state.story.picture}} style={{...StyleSheet.absoluteFill}} />
                </SharedElement>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})

export default StoryScreen;
