import { useNavigation } from '@react-navigation/core';
import React, {useState, useEffect, useContext} from 'react'
import { View, Text, Image, Dimensions, FlatList, ScrollView } from 'react-native'

import {connect, ReactReduxContext} from 'react-redux';

import axios from 'axios';

import TrackItem from '../../components/Track/TrackItem';
import AlbumItem from '../../components/Album/AlbumItem';
import TopTracks from '../../components/Artist/TopTracks';
import Albums from '../../components/Artist/Albums';
import RelatedArtists from '../../components/Artist/RelatedArtists';
import { SafeAreaView } from 'react-native-safe-area-context';

function ArtistScreen(props) {

    const artist = props.route.params.artist;

    const [albums, setAlbums] = useState(null);
    const [topTracks, setTopTracks] = useState([]);
    const [related, setRelated] = useState([]);

    const { store } = useContext(ReactReduxContext);

    const navigation = useNavigation();

    navigation.setOptions({
        title: artist.name
    })

    return (
        <SafeAreaView>
            <ScrollView style={{flex: 1, backgroundColor: 'black'}}>
                <View style={{alignItems: 'center', marginTop: 10}} >
                    <Image source={{uri: artist?.images[0].url}} style={{width: Dimensions.get('screen').width - 150, height: Dimensions.get('screen').width - 150, borderRadius: artist?.images[0].height}} />
                </View>
                <Text style={{fontSize: 36, color: 'white', textAlign: 'center', marginTop: 10}}>{artist?.name}</Text>
                <TopTracks artist={artist} />
                <Albums artist={artist} />
                <RelatedArtists artist={artist} />
            </ScrollView>
        </SafeAreaView>
    )
}

const mapStateToProps = store => {
    props: store.props
}

export default connect(mapStateToProps)(ArtistScreen);
