import React from 'react';
import {Dimensions, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function TrackScreen() {
    return (
        <SafeAreaView
            style={{
                flex: 1,
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                width: Dimensions.get('screen').width,
            }}>
            <Text>Track</Text>
        </SafeAreaView>
    );
}
