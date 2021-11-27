import React, {useState, useEffect, useContext, Suspense} from 'react'
import { View, Text, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native'

import {ReactReduxContext, connect} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';

function PlaylistScreen(props) {

    const {store} = useContext(ReactReduxContext);

    const navigation = useNavigation();

    const [playlist, setPlaylist] = useState(null);

    
    const _get_playlist = () => {
        const promise = axios.get('https://api.spotify.com/v1/playlists/' + props.route.params.playlist_id , {
            headers: {
                Accept: "application/json",
				Authorization: "Bearer " + store.getState().authentication.accessToken,
				"Content-Type": "application/json"
			}
        });
        const response = promise.then(data => data.data);
        return response
    }
    
    _get_playlist().then(json => setPlaylist(json))

    return (
        <SafeAreaView style={{flex: 1, justifyContent: 'space-between', alignItems: 'flex-start', width: Dimensions.get('screen').width}}>
            <Suspense fallback={null}>
                {
                    playlist
                    ?
                        <FlatList
                            data={playlist.tracks.items}
                            scrollEnabled={true}
                            horizontal={false}
                            renderItem={({item, key}) => (
                                <TouchableOpacity onPress={() => navigation.navigate('Playlist', {
                                    playlist_id: item.track.id
                                })}>
                                    <Image source={{uri: item?.track?.album?.images[0]?.url ?? 'null'}}
                                        style={{width: 116, height: 116, margin: "auto"}} />
                                    <Text>
                                        {item?.track?.name}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    :
                        null
                }
            </Suspense>
        </SafeAreaView>
    )
}

const mapStateToProps = store => {
    props: store.props
}

export default connect(mapStateToProps)(PlaylistScreen);