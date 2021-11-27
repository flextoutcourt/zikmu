import React, {useState, useEffect, useContext} from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import {useNavigation} from '@react-navigation/native';

import axios from 'axios';

import { connect, ReactReduxContext } from 'react-redux';
import TrackItem from '../../components/Track/TrackItem';
import ArtistItem from '../../components/Artist/ArtistItem';
import { SafeAreaView } from 'react-native-safe-area-context';

/** components */

function SearchScreen() {

    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);

    const { store } = useContext(ReactReduxContext)

    const navigation = useNavigation()

    const _search = (e) => {
        setSearch(e);
        axios.get(`https://api.spotify.com/v1/search?q=${e}&limit=3&type=track,artist,album`, {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + store.getState().authentication.accessToken,
                "Content-Type": "application/json"
            }
        })
        .then((data) => setResults(data.data));
    }

    return (
        <SafeAreaView style={{flex: 1, justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <ScrollView style={{flex: 1, backgroundColor: 'black', width: Dimensions.get('screen').width}}>
                <TextInput onChangeText={_search} placeholder={"Rechercher"} value={search} />
                <View>
                    {
                        results?.artists?.items?.length > 0
                        ?
                            <Text>Artistes</Text>
                        :
                            null
                    }
                    <FlatList
                        data={results?.artists?.items}
                        scrollEnabled={false}
                        renderItem={({item, key}) => (
                            <ArtistItem artist={item} />
                        )}
                    />
                </View>
                <View>
                {
                        results?.artists?.items?.length > 0
                        ?
                            <Text>Titres</Text>
                        :
                            null
                    }
                    <FlatList
                        data={results?.tracks?.items}
                        scrollEnabled={false}
                        horizontal={false}
                        renderItem={({item, key}) => (
                            <TrackItem track={item} />
                        )}
                    />
                </View>
                <View style={{marginBottom: 110}}>
                    {
                        results?.artists?.items?.length > 0
                        ?
                            <Text>Albums</Text>
                        :
                            null
                    }
                    <FlatList
                        data={results?.albums?.items}
                        scrollEnabled={false}
                        horizontal={false}
                        renderItem={({item, key}) => (
                            <TrackItem track={item} />
                        )}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default connect()(SearchScreen);
