//import liraries
import axios from 'axios';
import React, { Component, useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { ReactReduxContext } from 'react-redux';
import AlbumItem from '../../../components/Album/AlbumItem';

// create a component
export default function albums(){

    const [albums, setalbums] = useState([]);

    const {store} = useContext(ReactReduxContext);

    const _get_albums = (offset = 0) => {
        const promise = axios.get('https://api.spotify.com/v1/me/albums', {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + store.getState().authentication.accessToken,
                "Content-Type": "application/json"
            },
        });
        const response = promise.then(data => data.data);
        return response;
    }

    _get_albums().then(data => setalbums(data));

    return (
        <View style={styles.container}>
            <FlatList
                data={albums?.items}
                scrollEnabled={true}
                horizontal={false}
                // onEndReachedThreshold={0.4}
                // onEndReached={() => {
                //     _get_albumss(albums?.items?.length).then(json => setalbums(albums => albums?.items?.concat(json.items)))
                // }}
                renderItem={({item, key}) => (
                    <AlbumItem album={item?.album} />
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
        backgroundColor: '#2c3e50',
    },
});
