import { useNavigation } from '@react-navigation/core';
import React, {useState, useEffect, useContext} from 'react'
import { View, Text, Image, Dimensions, FlatList, ScrollView } from 'react-native'
import {connect, ReactReduxContext} from 'react-redux';
import axios from 'axios';
import TrackItem from '../Track/TrackItem';

function TopTracks({artist}) {

    const [topTracks, setTopTracks] = useState([]);

    const { store } = useContext(ReactReduxContext);

    const navigation = useNavigation();

    useEffect(() => {
        _get_artist_top_tracks().then(json => setTopTracks(json));
    });

    const _get_artist_top_tracks = () => {
        const promise = axios.get(`https://api.spotify.com/v1/artists/${artist.id}/top-tracks?country=FR`, {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + store.getState().authentication.accessToken,
                "Content-Type": "application/json"
            }
        });
        const response = promise.then((data) => data.data);
        return response;
    }

    return (
        <FlatList
            data={topTracks?.tracks}
            scrollEnabled={false}
            horizontal={false}
            style={{marginBottom: 110}}
            renderItem={({item, key}) => (
                <TrackItem track={item} album={item.album} />
            )}
        />
    )
}


const mapStateToProps = store => {
    props: store.props
}

export default connect(mapStateToProps)(TopTracks)
