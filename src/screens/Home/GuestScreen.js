import React from 'react'
import { View, Text, Image, Dimensions, TouchableHighlight } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native';

export default function GuestScreen() {

    const navigation = useNavigation();

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center'}}> 
            <View style={{flex: 2}}>
                <Image source={{uri: 'https://picsum.photos/400'}} style={{height: Dimensions.get('screen').width - 20, width: Dimensions.get('screen').width - 20, borderRadius: 10, marginTop: 10}}/>
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
                <Text style={{color: 'white', fontSize: 48, textTransform: 'uppercase'}}>ZikMu</Text>
                <Text style={{color: 'rgba(255,255,255,0.7)', fontSize: 32, textAlign: 'center'}}>L'application musique du SEII-GNEUUUUR</Text>
            </View>
            <View style={{flex: 1}}>
                <TouchableHighlight 
                    onPress={(e) => { navigation.navigate('Login') }}
                    style={{backgroundColor: "purple", padding: 10, borderRadius: 10, elevation: 10}}
                >
                    <Text>Se connecter</Text>
                </TouchableHighlight>
            </View>
        </SafeAreaView>
    )
}
