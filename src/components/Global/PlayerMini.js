import React, {useEffect, useState, useContext} from 'react'
import { View, Text, TouchableOpacity, Image, Alert, Button, TouchableHighlight} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';

import {ReactReduxContext, connect} from 'react-redux';

import axios from 'axios';

function PlayerMini() {

    const [listening, setListening] = useState(null)

    const { store } = useContext(ReactReduxContext);

    useEffect(() => {
        _get_listening().then(json => setListening(json));
    });

    const _get_listening = () => {
        const promise = axios.get('https://api.spotify.com/v1/me/player', {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + store.getState().authentication.accessToken,
                "Content-Type": "application/json"
            }
        });
        const response = promise.then(data => data.data);
        return response;
    }

    // const _pause = () => {
    //     axios.put('https://api.spotify.com.v1/me/player/pause');
    // }

    // const _play = () => {
    //     axios.put('https://api.spotify.com.v1/me/player/play');

    // }

    return (
        listening
        ?
        <TouchableOpacity
            style={{position: 'absolute', bottom: 60, left: 2, right: 2, backgroundColor: 'red', zIndex: 99, padding: 10, borderRadius: 10}}
            onPress={() => {}}  
          >
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
				<View style={{flexDirection: 'row', alignItems: 'center', flex: 3}}>
					<Image source={{uri: listening?.item?.album?.images[0]?.url}} style={{width: 50, height: 50, margin: "auto", borderRadius: 10}} />
					<View style={{marginLeft: 5}}>
						<Text style={{color: 'white'}}>{listening?.item?.name}</Text>
						<Text style={{color: 'lightgrey'}}>{listening?.item?.artists[0]?.name}</Text>
					</View>
				</View>
				<View style={{flex: 1, flexDirection: 'row'}}>
					<Icon name="home" size={24} style={{marginLeft: 5, marginRight: 5}} />
					<Icon name="heart" size={24} style={{marginLeft: 5, marginRight: 5, color: 'white'}} />
                    {
                        listening.is_playing
                        ?
                            <TouchableHighlight
                             onPress={() => {
                                    _pause()
                                }}
                            >
                                <Icon name="pause" size={24} style={{marginLeft: 5, marginRight: 5, color: 'white'}} />
                            </TouchableHighlight>
					    :
                            <TouchableHighlight 
                                onPress={() => {
                                    _play()
                                }}
                            >
                                <Icon name="play" size={24} style={{marginLeft: 5, marginRight: 5, color: 'white'}} />
                            </TouchableHighlight>

                    }
				</View>
            </View>
        </TouchableOpacity>
        :
            null
    )
}

const mapStateToProps = store => {
    props: store.props
}

export default connect(mapStateToProps)(PlayerMini);