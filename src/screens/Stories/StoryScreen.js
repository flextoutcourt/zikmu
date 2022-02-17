import React, {PureComponent} from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import {SharedElement} from 'react-native-shared-element'

class StoryScreen extends PureComponent{

    constructor(props){
        super(props)
    }

    render(){
        return(
            <View style={{flex: 1}}>
                <SharedElement id={`story.3`} style={{...StyleSheet.absoluteFill}}>
                    <Image source={{uri: 'https://picsum.photos/1440'}} style={StyleSheet.absoluteFill} />
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
