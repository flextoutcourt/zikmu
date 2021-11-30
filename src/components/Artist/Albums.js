import { useNavigation } from '@react-navigation/core';
import React, {useState, useEffect, useContext} from 'react'
import { View, Text, Image, Dimensions, FlatList, ScrollView } from 'react-native'
import {connect, ReactReduxContext} from 'react-redux';
import axios from 'axios';
import AlbumItem from '../Album/AlbumItem';

function Albums({artist}) {
    
    const [albums, setAlbums] = useState([]);

    const { store } = useContext(ReactReduxContext);
    
    const navigation = useNavigation();

    const _get_artist_album = () => {
        const promise = axios.get(`https://api.spotify.com/v1/artists/${artist.id}/albums`, {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + store.getState().authentication.accessToken,
                "Content-Type": "application/json"
            }
        });
        const response = promise.then((data) => data.data);
        return response;
    }

    _get_artist_album().then(json => setAlbums(json));

    return (
        <FlatList
            data={albums?.items}
            scrollEnabled={false}
            style={{marginBottom: 110}}
            renderItem={({item, key}) => (
                <AlbumItem album={item} />
            )}
        />
    )
}


const mapStateToProps = store => {
    props: store.props
}

export default connect(mapStateToProps)(Albums)