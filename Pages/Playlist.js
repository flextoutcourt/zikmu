import React, {useState, useEffect, Suspense} from 'react'
import {Text, View} from 'react-native'
import axios from 'axios'

import Track from './../Components/Track'

export default function Playlist(props) {

    const [playlist, setPlaylist] = useState(null)

    useEffect(() => {
        _get_playlist().then(json => setPlaylist(json))
    });

    const _get_playlist = () => {
        const promise = axios.get('https://api.spotify.com/v1/playlists/' + props.route.params.playlist_id , {
            headers: {
				Accept: "application/json",
				Authorization: Token.Token,
				"Content-Type": "application/json"
			}
        });
        const response = promise.then(data => data.data);
        return response
    }

    return (
        <Suspense fallback={null}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>{playlist?.name}</Text>
                <Text>{playlist?.description}</Text>
            </View>
            <FlatList
                data={playlist}
                scrollEnabled={true}
                horizontal={true}
                renderItem={({item, key}) => (
                    <TouchableOpacity onPress={() => navigation.navigate('Playlist', {
                        playlist_id: item.id
                    })}>
                        <Track />
                    </TouchableOpacity>
                )}
            />
        </Suspense>
    )
}
