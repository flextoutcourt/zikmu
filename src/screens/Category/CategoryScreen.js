import React, {useState, useEffect, useContext, Suspense} from 'react'
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native'

import {ReactReduxContext, connect} from 'react-redux';

import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';

function CategoryScreen(props) {

    const {store} = useContext(ReactReduxContext);

    const [playlist, setPlaylist] = useState(null);
    const [playlistItems, setPlaylistItems] = useState();

    const navigation = useNavigation();

    useEffect(() => {
        _get_playlist().then((json) => {
            setPlaylist(json);
            setPlaylistItems(json.playlists.items);
        })
    });

    const _get_playlist = (next = null) => {
        let url = `https://api.spotify.com/v1/browse/categories/${props.route.params.category_id}/playlists?limit=15`;
        const promise = axios.get(next ?? url, {
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
        <SafeAreaView style={{flex: 1, justifyContent: 'center', backgroundColor: 'black'}}>
            <Suspense fallback={null}>
                {
                    playlist
                    ?
                        <FlatList
                            data={playlistItems}
                            scrollEnabled={true}
                            horizontal={false}
                            onEndReachedThreshold={0.5}
                            onEndReached={() => _get_playlist(playlist.next).then(json => {
                                setPlaylistItems(playlistItems => playlistItems.concat(json.playlists.items))
                            })}
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

export default connect(mapStateToProps)(CategoryScreen);
