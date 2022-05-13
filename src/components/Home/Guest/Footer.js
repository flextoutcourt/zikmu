//import liraries
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

// create a component
const Footer = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View
                style={{flex: 2, flexDirection: 'row', justifyContent: 'space-around'}}>
                <TouchableOpacity
                    style={{color: 'white'}}
                    onPress={() => {
                        navigation.navigate('MTS');
                    }}>
                    <Text>Mentions légales</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{color: 'white'}}
                    onPress={() => {
                        navigation.navigate('CGV');
                    }}>
                    <Text>CGV</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{color: 'white'}}
                    onPress={() => {
                        navigation.navigate('Contact');
                    }}>
                    <Text>Contact</Text>
                </TouchableOpacity>
            </View>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                <TouchableOpacity
                    onPress={() => {
                        Linking.openURL('https://facebook.com/');
                    }}>
                    <FontAwesome5Icon
                        name="facebook"
                        color={'white'}
                        size={24}
                        style={{marginHorizontal: 5}}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        Linking.openURL('https://instagram.com/');
                    }}>
                    <FontAwesome5Icon
                        name="instagram"
                        color={'white'}
                        size={24}
                        style={{marginHorizontal: 5}}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        Linking.openURL('https://pinterest.com/');
                    }}>
                    <FontAwesome5Icon
                        name="pinterest"
                        color={'white'}
                        size={24}
                        style={{marginHorizontal: 5}}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        justifyItems: 'space-around',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#5D3194',
        flexDirection: 'row',
    },
});

//make this component available to the app
export default Footer;
