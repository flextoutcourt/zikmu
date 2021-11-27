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

    const [artist, setArtist] = useState(null);
    const [albums, setAlbums] = useState(null);
    const [topTracks, setTopTracks] = useState([]);
    const [related, setRelated] = useState([]);

    const { store } = useContext(ReactReduxContext);

    const navigation = useNavigation();

    const _get_artist = () => {
        if(props.route.params.artist_id){
            axios.get(`https://api.spotify.com/v1/artists/${props.route.params.artist_id}`, {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + store.getState().authentication.accessToken,
                    "Content-Type": "application/json"
                }
            })
            .then((data) => {
                console.log("data.data", data.data)
                setArtist(data.data);
                navigation.setOptions({
                    title: data.data.name
                });
            })
            .catch(e => {
                console.error('errorrrrr', e.status);
            })
        }else{
            setArtist(props.route.params.artist);
        }
    }

    _get_artist();

    return (
        <ScrollView style={{flex: 1, backgroundColor: 'black'}}>
            {
                artist
                ?
                    <>
                        <View style={{alignItems: 'center', marginTop: 10}} >
                            <Image source={{uri: artist?.images[0]?.url}} style={{width: Dimensions.get('screen').width - 150, height: Dimensions.get('screen').width - 150, borderRadius: artist?.images[0].height}} />
                        </View>
                        <Text style={{fontSize: 36, color: 'white', textAlign: 'center', marginTop: 10}}>{artist?.name}</Text>
                        <TopTracks artist={artist} />
                        <Albums artist={artist} />
                        <RelatedArtists artist={artist} />
                    </>
                :
                    <Text>test</Text>
            }
        </ScrollView>
    )
    
}

const mapStateToProps = store => {
    props: store
}


export default connect(mapStateToProps)(ArtistScreen);
