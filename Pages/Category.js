import React, {useState, useEffect, Suspense} from 'react'
import { View, Text, Image, FlatList, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

const Category = (props) => {

    const navigation = useNavigation();

    const [category, setCategory] = useState(null);
    const [categoryPlaylists, setCategoryPlaylists] = useState([])

    useEffect(() => {
        _get_category().then(json => setCategory(json));
        _get_category_playslits().then(json => setCategoryPlaylists(json.playlists.items));
    });

    const _get_category = () => {
        const promise = axios.get('https://api.spotify.com/v1/browse/categories/' + props.route.params.category_id, {
            headers: {
				Accept: "application/json",
				Authorization: Token.Token,
				"Content-Type": "application/json"
			}
        });
        const response = promise.then((data) => data.data);
        return response;
    }

    const _get_category_playslits = (offset = 0) => {
        const promise = axios.get('https://api.spotify.com/v1/browse/categories/' + props.route.params.category_id + '/playlists', {
            headers: {
				Accept: "application/json",
				Authorization: Token.Token,
				"Content-Type": "application/json"
			}
        })
        const response = promise.then((data) => data.data);
        return response;
    }

    return (
        <Suspense fallback={null}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
                <Image source={{uri: category?.icons[0]?.url}}
                    style={{width: 116, height: 116, margin: "auto"}} />
                <Text style={{color: 'white'}}>{category?.name}</Text>
            </View>
            <FlatList
                data={categoryPlaylists}
                scrollEnabled={true}
                horizontal={true}
                renderItem={({item, key}) => (
                    <TouchableOpacity onPress={() => navigation.navigate('Playlist', {
                        playlist_id: item.id
                    })}>
                        <View style={{width: 116, padding: 0, backgroundColor: 'transparent', margin: 5}}>
                            <Image source={{uri: item?.images[0]?.url}}
                            style={{width: 116, height: 116, margin: "auto"}} />
                            <View>
                                <Text style={{fontWeight: 'bold', color: 'white'}}>{item?.name}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </Suspense>
    )
}

export default Category