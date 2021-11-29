//import liraries
import axios from 'axios';
import React, { Component, useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import { ReactReduxContext } from 'react-redux';
import ArtistItem from '../../../components/Artist/ArtistItem';

// create a component
export default function Artist(){

    const [artist, setArtist] = useState([]);

    const {store} = useContext(ReactReduxContext);

    const _get_artist = (offset = 0) => {
        const promise = axios.get('https://api.spotify.com/v1/me/following?type=artist', {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + store.getState().authentication.accessToken,
                "Content-Type": "application/json"
            },
        });
        const response = promise.then(data => data.data);
        return response;
    }

    _get_artist().then(data => setArtist(data.artists));

    return (
        <View style={styles.container}>
            <FlatList
                data={artist?.items}
                scrollEnabled={true}
                horizontal={false}
                numColumns={3}
                renderItem={({item}) => (
                    <ArtistItem artist={item} />
                )}
                // keyExtractor={(item, index) => index}
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
        backgroundColor: '#2c3e50',
    },
});
