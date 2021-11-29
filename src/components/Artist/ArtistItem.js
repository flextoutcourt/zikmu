import { useNavigation } from '@react-navigation/core';
import React, {useState, useEffect, useContext} from 'react'
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native'

function ArtistItem({artist}) {

    const navigation = useNavigation();

    return (
        <TouchableOpacity onPress={() => navigation.navigate('Artist', {
            artist: artist
        })} style={{flex: 1, width: Dimensions.get('screen').width}}>
            <View style={{width: 116, padding: 0, backgroundColor: 'transparent', margin: 5}}>
                <Image source={{uri: artist?.images[0]?.url}}
                style={{width: 116, height: 116, margin: "auto", borderRadius: artist?.images[0]?.height}} />
                <View>
                    <Text style={{fontWeight: 'bold', color: 'white'}}>{artist?.name}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default ArtistItem;
