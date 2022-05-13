import React from 'react';
import {Dimensions, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

class MyProfileScreen extends React.PureComponent {
    state = {};

    render() {
        return (
            <SafeAreaView
                style={{
                    flex: 1,
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    width: Dimensions.get('screen').width,
                }}>
                <Text>My profile!</Text>
            </SafeAreaView>
        );
    }
}

export default MyProfileScreen;
