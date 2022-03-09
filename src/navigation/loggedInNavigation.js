import React, {useContext, useEffect} from 'react';
import {Button, Linking, StyleSheet, Text, View} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import Icon from 'react-native-vector-icons/Feather';
import {navigationRef} from '../utils/RootNavigation';
import {BlurView} from 'expo-blur';

import {connect, ReactReduxContext} from 'react-redux';

import HomeScreen from './../screens/Home/HomeScreen';
import Category from './../screens/Category/CategoryScreen';
import Album from './../screens/Album/AlbumScreen';
import Artist from './../screens/Artist/ArtistScreen';
import Track from './../screens/Track/TrackScreen';
import Playlist from './../screens/Playlist/PlaylistScreen';
import Genre from './../screens/Genres/GenreScreen';
import SearchScreen from '../screens/Search/SearchScreen';

import Library from '../screens/MyProfile/Library';
import Tracks from '../screens/MyProfile/Library/Tracks';
import PopularScreen from '../screens/Genres/Items/PopularScreen';
import NewsScreen from '../screens/Genres/Items/NewsScreen';
import SelfScreen from '../screens/User/SelfScreen';
import UserScreen from '../screens/User/UserScreen';
import PlayerAlt from '../components/Global/PlayerAlt';
import StoryScreen from '../screens/Stories/StoryScreen';
import DeepLinking from "react-native-deep-linking";

const Tab = createBottomTabNavigator();

const Stack = createSharedElementStackNavigator();

class HomeStack extends React.PureComponent{
	render(){
		return (
			<Stack.Navigator
				screenOptions={{
					gestureEnabled: false,
					headerShown: false,
					cardOverlayEnabled: true,
					cardStyle: { backgroundColor: "transparent" },
				}}
				mode="modal"
			>
				<Stack.Screen
					name="Home"
					component={HomeScreen}
				/>
				<Stack.Screen name="Category" component={Category}  />
				<Stack.Screen name="Album" component={Album}/>
				<Stack.Screen name="Artist" component={Artist}/>
				<Stack.Screen name="Track" component={Track}/>
				<Stack.Screen name="Playlist" component={Playlist}/>
				<Stack.Screen name="Genre" component={Genre}/>
				<Stack.Screen name="Genre_Popular" component={PopularScreen} />
				<Stack.Screen name="Genre_News" component={NewsScreen} />
				<Stack.Screen name="Self" component={SelfScreen} />
				<Stack.Screen name="User" component={UserScreen} />
				<Stack.Screen
					name="Story"
					component={StoryScreen}
					sharedElements={(route) => {
						const { story } = route.params;
						return [story];
					}}
				/>
			</Stack.Navigator>
		);
	}
}

class SearchStack extends React.PureComponent {
	render(){
		return (
			<Stack.Navigator
				screenOptions={{
					gestureEnabled: true,
					headerShown: false,
				}}>
				<Stack.Screen
					name="Search"
					component={SearchScreen}
				/>
				<Stack.Screen name="Category" component={Category}/>
				<Stack.Screen name="Album" component={Album}/>
				<Stack.Screen name="Artist" component={Artist}/>
				<Stack.Screen name="Track" component={Track}/>
				<Stack.Screen name="Playlist" component={Playlist}/>
				<Stack.Screen name="Genre" component={Genre}/>
				<Stack.Screen name="Genre_Popular" component={PopularScreen} />
				<Stack.Screen name="Genre_News" component={NewsScreen} />
			</Stack.Navigator>
		);
	}
}

class LibraryStack extends React.PureComponent {
	render(){
		return (
			<Stack.Navigator
				screenOptions={{
				}}
				defaultScreenOptions={{
					headerShown: false,
				}}>
				<Stack.Screen
					options={{
						headerShown: false,
					}}
					name="Test"
					component={Library}
				/>
				<Stack.Screen name="Category" component={Category}/>
				<Stack.Screen
					name="Album"
					component={Album}
					options={{
						headerShown: false,
						headerTransparent: true,
						title: '',
					}}
				/>
				<Stack.Screen
					name="Artist"
					component={Artist}
					options={{
						headerShown: false,
						title: '',
					}}
				/>
				<Stack.Screen name="MyTracks" component={Tracks} options={{
					headerShown: false,
					headerTransparent: true,
					title: '',
				}}/>
				<Stack.Screen
					name="Playlist"
					component={Playlist}
					options={{
						headerShown: false,
						headerTransparent: true,
						title: '',
					}}
				/>
				<Stack.Screen name="Genre" component={Genre}/>
				<Stack.Screen name="Genre_Popular" component={PopularScreen} />
				<Stack.Screen name="Genre_News" component={NewsScreen} />
			</Stack.Navigator>
		);
	}
}



const LoggedInNavigation = () => {

    const navigation = useNavigation();

    DeepLinking.addScheme(['zikmu://']);
    DeepLinking.addRoute('home/artist/:id', response => {
        navigation.navigate('Artist', {
            artist_id: response.id
        })
    });

    useEffect(() => {
        Linking.addEventListener('url', handleOpenURL);
        return (() => {
            Linking.remove('url', handleOpenURL);
        })
    }, []);

    const handleOpenURL = (event) => {
        alert(event.url);
        DeepLinking.evaluateUrl(event.url);
    }
    return (
        <NavigationContainer ref={navigationRef}>
            <Tab.Navigator
                screenOptions={({route}) => ({
                    tabBarIcon: ({focused, color, size}) => {
                        let iconName = 'home';
                        if (route.name === 'Home') {
                            iconName = focused ? 'home' : 'home';
                            color = focused ? '#B00D70' : 'white';
                        } else if (route.name === 'Search') {
                            iconName = focused ? 'search' : 'search';
                            color = focused ? '#B00D70' : 'white';
                        } else if (route.name === 'Library') {
                            iconName = focused ? 'book' : 'book';
                            color = focused ? '#B00D70' : 'white';
                        }
                        return <Icon name={iconName} size={24} color={color}/>;
                    },
                    tabBarActiveTintColor: '#B00D70',
                    tabBarInactiveTintColor: 'white',
                    tabBarStyle: {
                        position: 'absolute',
                        bottom: 0,
                        borderTopWidth: 0,
                        elevation: 0
                    },
                    tabBarBackground: () => (
                        <BlurView tint="dark" intensity={85} style={StyleSheet.absoluteFill}/>
                    ),
                    headerShown: false,
                })}>
                <Tab.Screen name="Home" component={HomeStack}/>
                <Tab.Screen name="Search" component={SearchStack}/>
                <Tab.Screen name="Library" component={LibraryStack}/>
            </Tab.Navigator>
        </NavigationContainer>
		);
}

const mapStateToProps = store => {
	return {
		store: store,
	};
};

export default connect(mapStateToProps)(LoggedInNavigation);
