import React, {useContext} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
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

export const config = {
	screens: {
		Home: {
			path: 'home',
		},
		Settings: {
			path: 'callback',
		},
		Test: {
			path: 'test',
		},
		Category: {
			path: 'category',
		},
		Playlist: {
			path: 'playlist',
		},
		Album: {
			path: 'album',
		},
		Track: {
			path: 'track',
		},
		Artist: {
			path: 'artist',
		},
	},
};

const Tab = createBottomTabNavigator();

const Stack = createSharedElementStackNavigator();

class HomeNavigationStack extends React.PureComponent{
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
				<Stack.Screen name="Category" component={Category}/>
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

class SearchNavigationStack extends React.PureComponent {
	render(){
		return (
			<Stack.Navigator
				screenOptions={{
					gestureEnabled: true,
					headerShown: false,
				}}>
				<Stack.Screen
					options={{
						transitionSpec: {
							open: config,
							close: config,
						},
					}}
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

class libraryNavigationStack extends React.PureComponent {
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
						transitionSpec: {
							open: config,
							close: config,
						},
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


class LoggedInNavigation extends React.PureComponent{

	constructor(props) {
		super(props);
	}

	TestScreen({navigation}) {
		return (
			<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
				<Text>Test !</Text>
				<Button
					title="Go to Home"
					onPress={() => navigation.navigate('Home')}
				/>
			</View>
		);
	}




	render(){
		return (
			<NavigationContainer ref={navigationRef}>
				<Tab.Navigator
					screenOptions={({route}) => ({
						tabBarIcon: ({focused, color, size}) => {
							let iconName = 'home';
							if (route.name === 'Accueil') {
								iconName = focused ? 'home' : 'home';
								color = focused ? '#B00D70' : 'white';
							} else if (route.name === 'Rechercher') {
								iconName = focused ? 'search' : 'search';
								color = focused ? '#B00D70' : 'white';
							} else if (route.name === 'Librarie') {
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
					<Tab.Screen name="Accueil" component={HomeNavigationStack}/>
					<Tab.Screen name="Rechercher" component={SearchNavigationStack}/>
					<Tab.Screen name="Librarie" component={libraryNavigationStack}/>
				</Tab.Navigator>
			</NavigationContainer>
		);
	}
}

const mapStateToProps = store => {
	return {
		store: store,
	};
};

export default connect(mapStateToProps)(LoggedInNavigation);
