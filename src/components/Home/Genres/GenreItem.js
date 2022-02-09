import React, {Component} from "react";
import {View, Text, Image, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';

class GenreItem extends Component{

    constructor(props){
        super(props);
        this.state = {

        }
    }

    componentDidMount(){

    }

    render(){
        return(
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Genre', {
                genre_id: this.props.genre?.id
            })} style={{width: Dimensions.get('screen').width / 2 - 40, marginHorizontal: 10, marginVertical: 10}}>
                <View style={{height: Dimensions.get('screen').width / 2 - 40, width: Dimensions.get('screen').width / 2 - 40, backgroundColor: 'black', borderRadius: 10, elevation: 10}}>
                    <Image source={{uri: this.props.genre?.icons[0]?.url}} style={{...StyleSheet.absoluteFill, borderRadius: 10}} />
                </View>
                <Text style={{textAlign: 'center', color: 'white', fontSize: 16, marginTop: 5}}>{this.props.genre?.name}</Text>
            </TouchableOpacity>
        )
    }

}

export default GenreItem;
