//import liraries
import React, { Component, useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { connect, ReactReduxContext } from 'react-redux';
import TrackItem from '../../../components/Track/TrackItem';
import axios from 'axios';

const Tracks = () => {

    const {store} = useContext(ReactReduxContext)

    const [tracks, setTracks] = useState([]);

    const _get_tracks = (offset = 0) => {
        const promise = axios.get('https://api.spotify.com/v1/me/tracks', {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + store.getState().authentication.accessToken,
                "Content-Type": "application/json"
            },
        });
        const response = promise.then((data) => data);
        return response;
    }

    _get_tracks().then(data => setTracks(data.data));

    return (
        <View style={styles.container}>
            <FlatList
                data={tracks?.items}
                scrollEnabled={true}
                horizontal={false}
                onEndReachedThreshold={0.1}
                onEndReached={() => {
                    _get_tracks(tracks.length).then(json => setTracks(tracks => tracks?.items?.concat(json.items)))
                }}
                renderItem={({item, key}) => (
                    <TrackItem track={item.track} album={item?.track?.album} favorites={true} />
                )}
            />
        </View>
    );
};

const mapStateToProps = store => {
    props: store.props
}

export default connect(mapStateToProps)(Tracks);

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});
