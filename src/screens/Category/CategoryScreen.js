import React, {useState, useEffect, useContext} from 'react'
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native'

import {ReactReduxContext, connect} from 'react-redux';

import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

function CategoryScreen(props, {accessToken}) {

    const {store} = useContext(ReactReduxContext);

    const [playlist, setPlaylist] = useState([]);

    const navigation = useNavigation();

    useEffect(() => {
        _get_playlist().then((json) => setPlaylist(json.playlists.items))
    });

    _get_playlist = () => {
        const promise = axios.get(`https://api.spotify.com/v1/browse/categories/${props.route.params.category_id}/playlists`, {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + store.getState().authentication.accessToken,
                "Content-Type": "application/json"
            }
        })
        const response = promise.then((data) => data.data);
        return response;
    }

    return (
        <View>
            <FlatList
                data={playlist}
                scrollEnabled={true}
                horizontal={true}
                renderItem={({item, key}) => (
                    <TouchableOpacity onPress={() => navigation.navigate('Playlist', {
                        playlist_id: item.id
                    })}>
                        <View style={{width: 116, padding: 0, backgroundColor: 'transparent', margin: 5}}>
                            <Image source={{uri: item?.images[0]?.url}}
                            style={{width: 116, height: 116, margin: "auto"}} />
                            <View>
                                <Text style={{fontWeight: 'bold', color: 'white'}}>{item?.name}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}

const mapStateToProps = store => {
    props: store.props
}

export default connect(mapStateToProps)(CategoryScreen);
