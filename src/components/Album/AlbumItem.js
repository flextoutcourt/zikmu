import { useNavigation } from '@react-navigation/core';
import React, {useState, useEffect, useContext} from 'react'
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';

function AlbumItem({album}) {

    const navigation = useNavigation();

    return (
        <TouchableOpacity onPress={() => {
            navigation.navigate('Album', {
                album_id: album.id,
            })
        }}>
            <View style={{width: 116, padding: 0, backgroundColor: 'green', margin: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: Dimensions.get('screen').width - 20}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={{uri: album?.images[0]?.url}}
                    style={{width: 50, height: 50, margin: "auto"}} />
                    <View style={{marginLeft: 10}}>
                        <Text style={{fontWeight: 'bold', color: 'white'}}>{album?.name}</Text>
                    </View>
                </View>
                <TouchableOpacity>
                    <Icon name="heart" size={24} color={"white"} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )
}

export default AlbumItem;
