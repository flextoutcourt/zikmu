import {useNavigation} from '@react-navigation/core';
import React from 'react';
import {Dimensions, Image, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Animated from 'react-native-reanimated';
import {SharedElement} from 'react-navigation-shared-element';

function PlaylistItem({playlist}) {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            onPress={() => {
                navigation.navigate('Playlist', {
                    playlist_id: playlist.id,
                });
            }}>
            <View
                style={{
                    padding: 0,
                    margin: 5,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: Dimensions.get('screen').width - 20,
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{backgroundColor: 'black', elevation: 10, borderRadius: 10}}>
                        <Image
                            source={{uri: playlist?.images[0]?.url}}
                            style={{width: 50, height: 50, margin: 'auto', borderRadius: 10}}
                        />
                    </View>
                    <View style={{marginLeft: 10}}>
                        <Text style={{fontWeight: 'bold', color: 'white'}}>
                            {playlist?.name}
                        </Text>
                        <Text style={{color: 'white', opacity: 0.8}}>{playlist?.tracks?.total} sons</Text>
                    </View>
                </View>
                <TouchableOpacity>
                    <Icon name="heart" size={24} color={'white'}/>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

export default PlaylistItem;
