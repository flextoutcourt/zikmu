import { useNavigation } from '@react-navigation/core';
import React, {useState, useEffect, useContext} from 'react'
import { View, Text, Image, Dimensions, FlatList, ScrollView } from 'react-native'
import {connect, ReactReduxContext} from 'react-redux';
import axios from 'axios';
import ArtistItem from './ArtistItem';

function RelatedArtists({artist}) {

    const [related, setRelated] = useState([]);

    const { store } = useContext(ReactReduxContext);

    const navigation = useNavigation();

    const _get_artist_related = () => {
        const promise = axios.get(`https://api.spotify.com/v1/artists/${artist.id}/related-artists`, {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + store.getState().authentication.accessToken,
                "Content-Type": "application/json"
            }
        });
        const response = promise.then((data) => data.data);
        return response;
    }
    
    _get_artist_related().then(json => setRelated(json))

    return (
        <FlatList
            data={related?.artists}
            scrollEnabled={true}
            horizontal={true}
            style={{marginBottom: 110}}
            renderItem={({item, key}) => (
                <ArtistItem artist={item} />
            )}
        />
    )
}

const mapStateToProps = store => {
    props: store.props
}

export default connect(mapStateToProps)(RelatedArtists)