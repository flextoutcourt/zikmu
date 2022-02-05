//import liraries
import React from 'react';

import Playlists from './Library/Playlists';
import Albums from './Library/Albums';
import Artists from './Library/Artists';

import {useNavigation} from '@react-navigation/core';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {SafeAreaView} from 'react-native-safe-area-context';

const Library = () => {
	const Tab = createMaterialTopTabNavigator();
	const navigation = useNavigation();

	return (
		<SafeAreaView style={{flex: 1}}>
			<Tab.Navigator
				screenOptions={{
					tabBarContentContainerStyle: {
						backgroundColor: 'transparent',
					},
				}}>
				<Tab.Screen name="Playlists" component={Playlists} navigation={navigation}/>
				<Tab.Screen name="Albums" component={Albums}/>
				<Tab.Screen name="Artists" component={Artists}/>
			</Tab.Navigator>
		</SafeAreaView>
	);
};
export default Library;
