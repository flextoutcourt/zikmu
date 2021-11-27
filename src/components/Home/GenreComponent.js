import React, {useState, useEffect, useContext} from 'react'
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native'

import {ReactReduxContext, connect} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import axios from "axios";

function GenreComponent() {

    const [genres, setGenres] = useState([]);

    const { store } = useContext(ReactReduxContext);

    const navigation = useNavigation();

    useEffect(() => {
        _get_genres().then((json) => setGenres(json.categories.items))
    });

    const _get_genres = (offset = 0) => {
        console.log("genres");
        const promise = axios.get(`https://api.spotify.com/v1/browse/categories?offset=${offset}`, {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + store.getState().authentication.accessToken,
                "Content-Type": "application/json"
            }
        })
        const response = promise.then((data) => data);
        return response;
    }

    return (
        <FlatList
            data={genres}
            scrollEnabled={true}
            horizontal={true}
            onEndReachedThreshold={0.5}
            onEndReached={() => {
                _get_genres(genres.length).then(json => setGenres(genres => genres.concat(json.categories.items)))
            }}
            renderItem={({item, key}) => (
                <TouchableOpacity onPress={() => navigation.navigate('Category', {
                    category_id: item.id
                })}>
                    <View style={{width: 116, padding: 0, backgroundColor: 'transparent', margin: 5}}>
                        <Image source={{uri: item?.icons[0]?.url}}
                            style={{width: 116, height: 116, margin: "auto"}} />
                        <View>
                            <Text style={{fontWeight: 'bold', color: 'white'}}>{item?.name}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )}
        />
    )
}

const mapStateToProps = store => {
    props: store.props
}

export default connect(mapStateToProps)(GenreComponent);
