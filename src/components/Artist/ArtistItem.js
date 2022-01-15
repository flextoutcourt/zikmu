import {useNavigation} from '@react-navigation/core';
import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';

function ArtistItem({artist}) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('Artist', {
          artist_id: artist.id,
        })
      }
      style={{}}>
      <View
        style={{
          width: 116,
          padding: 0,
          backgroundColor: 'transparent',
          margin: 5,
        }}>
        <Image
          source={{uri: artist?.images[0]?.url}}
          style={{
            width: 116,
            height: 116,
            margin: 'auto',
            borderRadius: artist?.images[0]?.height,
          }}
        />
        <View>
          <Text style={{fontWeight: 'bold', color: 'white'}}>
            {artist?.name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default ArtistItem;
