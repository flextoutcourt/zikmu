import React from 'react';
import {Dimensions, Image, ImageBackground, StatusBar, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Button from '../../components/Home/Guest/Button';
import LinearGradient from 'react-native-linear-gradient';

export default function GuestScreen() {
    const navigation = useNavigation();

    const image = require('./../../images/GuestBack.webp');

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: 'black',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: -StatusBar.currentHeight,
            }}>
            <ImageBackground
                source={image}
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: Dimensions.get('screen').width,
                    paddingTop: StatusBar.currentHeight,
                }}>
                <LinearGradient colors={['rgba(120,86,255, 0.5)', 'rgba(0,0,0,0.5)']}>
                    <View style={{flex: 1, alignItems: 'center', padding: 10}}>
                        <Image source={require('./../../images/logo.png')}/>
                        <Text style={{color: 'white'}}>Écoutez votre musique favorite en un seul clic</Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'center', padding: 10}}>
                        <Button
                            onPress={() => navigation.navigate('Login')}
                            title={'Se connecter'}
                            color={'#7856FF'}
                        />
                    </View>
                    <View style={{flex: 1, alignItems: 'center', padding: 10}}>
                        <Text style={{color: 'white'}}>
                            Explorez tout un monde de musiques sans publicité, hors connexion et
                            même avec l'écran verrouilé. Disponible sur mobile et ordinateur,
                            Ziq&Mu propose des albums officiels, des playlists, des signles et
                            plus encore.
                        </Text>
                    </View>
                </LinearGradient>
            </ImageBackground>
            {/* <View style={{flex: 2}}>
                <Image source={{uri: 'https://picsum.photos/400'}} style={{height: Dimensions.get('screen').width - 20, width: Dimensions.get('screen').width - 20, borderRadius: 10, marginTop: 10}}/>
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
                <Text style={{color: 'white', fontSize: 48, textTransform: 'uppercase'}}>ZikMu</Text>
                <Text style={{color: 'rgba(255,255,255,0.7)', fontSize: 32, textAlign: 'center'}}>L'application musique du SEII-GNEUUUUR</Text>
            </View>
            <View style={{flex: 1}}>
                <TouchableHighlight
                    onPress={(e) => { navigation.navigate('Login') }}
                    style={{backgroundColor: "#B00D70", padding: 10, borderRadius: 10, elevation: 10}}
                >
                    <Text>Se connecter</Text>
                </TouchableHighlight>
            </View> */}
        </SafeAreaView>
    );
}
