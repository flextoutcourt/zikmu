//import liraries
import axios from 'axios';
import React, { Component, useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { ReactReduxContext } from 'react-redux';
import AlbumItem from '../../../components/Album/AlbumItem';
import PlaylistItem from '../../../components/Playlist/PlaylistItem';
import {useNavigation} from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

// create a component
export default function Playlists(){

    const [playlists, setPlaylists] = useState([]);

    const {store} = useContext(ReactReduxContext);

    const navigation = useNavigation();

    const _get_playlists = (offset = 0) => {
        const promise = axios.get('https://api.spotify.com/v1/me/playlists', {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + store.getState().authentication.accessToken,
                "Content-Type": "application/json"
            },
        });
        const response = promise.then(data => data.data);
        return response;
    }

    _get_playlists().then(data => setPlaylists(data));

    return (
        <View style={{marginTop: -StatusBar.currentHeight}, styles.container}>
            <FlatList
                ListHeaderComponent={() => (
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('MyTracks');
                    }}>
                        <Text>Mes titres likés</Text> 
                    </TouchableOpacity>
                )}
                data={playlists?.items}
                scrollEnabled={true}
                horizontal={false}
                // onEndReachedThreshold={0.4}
                // onEndReached={() => {
                //     _get_playlists(playlists?.items?.length).then(json => setPlaylists(playlists => playlists?.items?.concat(json.items)))
                // }}
                renderItem={({item, key}) => (
                    <PlaylistItem playlist={item} />
                )}
            />
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50'
    },
});
