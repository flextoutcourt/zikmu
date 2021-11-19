import React, {useState, useEffect, useContext} from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Dimensions, ScrollView } from 'react-native';
import { connect, ReactReduxContext } from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import axios from 'axios';
import TrackItem from '../../components/Track/TrackItem';

function AlbumScreen(props) {

    const [album, setAlbum] = useState(null);

    const { store } = useContext(ReactReduxContext);

    const navigation = useNavigation();

    

    useEffect(() => {
        _get_album().then(json => {
            setAlbum(json)
            navigation.setOptions({
                title: json?.name
            })
        });
    });

    const _get_album = () => {
        const promise = axios.get(`https://api.spotify.com/v1/albums/${props.route.params.album_id}`, {
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
        <ScrollView style={{backgroundColor: 'black', flex: 1}}>
            <View style={{alignItems: 'center'}}>
                <Image source={{uri: album?.images[0]?.url}} style={{width: Dimensions.get('screen').width - 20, height: Dimensions.get('screen').width - 20, margin: "auto", borderRadius: 10}}/>
            </View>
            <Text style={{fontSize: 24, color: 'white', textAlign: 'center'}}>{album?.name}</Text>
            <FlatList
                data={album?.tracks?.items}
                scrollEnabled={true}
                horizontal={false}
                style={{marginBottom: 110}}
                renderItem={({item, key}) => (
                    <TrackItem track={item} album={album} />
                )}
            />
        </ScrollView>
    )
}

const mapStateToProps = store => {
    props: store.props
}

export default connect(mapStateToProps)(AlbumScreen)
