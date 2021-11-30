import React, {useState, useEffect, useContext, Suspense} from 'react'
import { View, Text, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native'

import {ReactReduxContext, connect} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import TrackItem from '../../components/Track/TrackItem';

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
                                <TrackItem track={item?.track} album={item?.track?.album} />
                            </TouchableOpacity>
                        )}
                    />
                :
                    null
            }
        </SafeAreaView>
    )
}

const mapStateToProps = store => {
    props: store.props
}

export default connect(mapStateToProps)(PlaylistScreen);