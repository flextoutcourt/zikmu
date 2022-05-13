import React from 'react';
import {Text, View} from 'react-native';

export default function Track() {
    return (
        <View>
            <Image
                source={{uri: item?.images[0]?.url}}
                style={{width: 116, height: 116, margin: 'auto'}}
            />
            <Text>{track.name}</Text>
        </View>
    );
}
