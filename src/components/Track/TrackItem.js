import axios from 'axios';
import React, {useState, useEffect, useContext} from 'react'
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { ReactReduxContext } from 'react-redux';

function TrackItem({track, album = null, favorites = false}) {

    const {store} = useContext(ReactReduxContext);

    const _play = (uri, offset = 0, position = 0) => {
        console.log(uri, offset, position)
        fetch("https://api.spotify.com/v1/me/player/play", {
            body: JSON.stringify({uris: [uri]}),
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + store.getState().authentication.accessToken,
                "Content-Type": "application/json"
            },
            method: "PUT"
        })
        .catch(e => {
            alert(JSON.stringify(e))
        })
    }

    return (
        <TouchableOpacity onPress={() => _play(track?.uri, track?.track_number)}>
            <View style={{width: 116, padding: 0, backgroundColor: 'green', margin: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: Dimensions.get('screen').width - 20}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={{uri: album?.images[0]?.url}}
                    style={{width: 50, height: 50, margin: "auto"}} />
                </View>
                <View style={{marginLeft: 10, flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10}}>
                    <Text style={{fontWeight: 'bold', color: 'white'}} numberOfLines={1}>{track?.name}</Text>
                    <TouchableOpacity>
                        <Icon name="heart" size={24} solid={favorites ? true: false} color={"white"} style={{color: 'white'}} />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default TrackItem;
